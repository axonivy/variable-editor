import {
  BasicField,
  Button,
  Combobox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Flex,
  hotkeyText,
  Input,
  Message,
  selectRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeyLocalScopes,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { EMPTY_KNOWN_VARIABLES, type KnownVariables } from '@axonivy/variable-editor-protocol';
import { type Table } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useMeta } from '../../../context/useMeta';
import { useKnownHotkeys } from '../../../utils/hotkeys';
import { keyOfFirstSelectedNonLeafRow, keysOfAllNonLeafRows, newNodeName, toRowId } from '../../../utils/tree/tree';
import { addNode } from '../../../utils/tree/tree-data';
import type { AddNodeReturnType } from '../../../utils/tree/types';
import { createVariable, type Variable } from '../data/variable';
import './AddDialog.css';
import { addKnownVariable, findVariable } from './known-variables';
import { trimNamespace } from './trim-namespace';
import { useValidateAddVariable } from './useValidateAddVariable';

type AddVariableDialogProps = {
  table: Table<Variable>;
};

export const AddVariableDialog = ({ table }: AddVariableDialogProps) => {
  const { context, variables, setVariables, setSelectedVariable } = useAppContext();
  const { activateLocalScopes, restoreLocalScopes } = useHotkeyLocalScopes(['addDialog']);

  const [open, setOpen] = useState(false);
  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      initializeVariableDialog();
      activateLocalScopes();
    } else {
      restoreLocalScopes();
    }
  };
  const [name, setName] = useState('');
  const [namespace, setNamespace] = useState('');
  const { nameValidationMessage, namespaceValidationMessage } = useValidateAddVariable(name, trimNamespace(namespace), variables);

  const [knownVariable, setKnownVariable] = useState<KnownVariables>();
  useEffect(() => setKnownVariable(undefined), [name, namespace]);

  const knownVariables = useMeta('meta/knownVariables', context, EMPTY_KNOWN_VARIABLES).data;

  const initializeVariableDialog = () => {
    setName(newNodeName(table, 'NewVariable'));
    setNamespace(keyOfFirstSelectedNonLeafRow(table));
  };

  const namespaceOptions = () => keysOfAllNonLeafRows(table).map(key => ({ value: key }));

  const updateSelection = (addNodeReturnValue: AddNodeReturnType<Variable>) => {
    selectRow(table, toRowId(addNodeReturnValue.newNodePath));
    setSelectedVariable(addNodeReturnValue.newNodePath);
  };

  const addKnown = (knownVariable: KnownVariables) => {
    setVariables(old => {
      const addNodeReturnValue = addKnownVariable(old, knownVariable);
      updateSelection(addNodeReturnValue);
      return addNodeReturnValue.newData;
    });
  };

  const addVariable = (event: React.MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
    if (knownVariable) {
      addKnown(knownVariable);
      onOpenChange(false);
      return;
    }
    const trimmedNamespace = trimNamespace(namespace);
    const namespaceKey = trimmedNamespace ? trimmedNamespace.split('.') : [];
    const foundKnownVariable = findVariable(knownVariables, ...namespaceKey, name);
    if (foundKnownVariable) {
      setKnownVariable(foundKnownVariable.node);
      event.preventDefault();
      return;
    }
    setVariables(old => {
      const addNodeReturnValue = addNode(name, trimmedNamespace, old, createVariable);
      updateSelection(addNodeReturnValue);
      return addNodeReturnValue.newData;
    });
    if (!event.ctrlKey && !event.metaKey) {
      onOpenChange(false);
    }
  };

  const { addVar: shortcut } = useKnownHotkeys();
  useHotkeys(shortcut.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });
  const enter = useHotkeys(
    ['Enter', 'mod+Enter'],
    e => {
      if (document.activeElement?.getAttribute('role') === 'combobox') {
        return;
      }

      if (!allInputsValid()) {
        return;
      }
      addVariable(e);
    },
    { scopes: ['addDialog'], enabled: open, enableOnFormTags: true }
  );

  const allInputsValid = () => !nameValidationMessage && !namespaceValidationMessage;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button className='variables-editor-add-button' icon={IvyIcons.Plus} aria-label={shortcut.label} />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{shortcut.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent onCloseAutoFocus={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add Variable</DialogTitle>
        </DialogHeader>
        <DialogDescription>Choose the name and namespace of the Variable you want to add.</DialogDescription>
        <Flex direction='column' gap={3} ref={enter} tabIndex={-1}>
          <BasicField label='Name' message={nameValidationMessage} aria-label='Name'>
            <Input value={name} onChange={event => setName(event.target.value)} />
          </BasicField>
          <BasicField
            label='Namespace'
            message={namespaceValidationMessage ?? { variant: 'info', message: `Folder structure of Variable (e.g. 'Connector.Key')` }}
            aria-label='Namespace'
          >
            <Combobox
              value={namespace}
              onChange={setNamespace}
              onInput={event => setNamespace(event.currentTarget.value)}
              options={namespaceOptions()}
            />
          </BasicField>
          {knownVariable && (
            <Message
              variant='warning'
              message='This Variable is already present in a required project. Do you want to import it?'
              aria-label='Import message'
            />
          )}
        </Flex>
        <DialogFooter>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='primary' size='large' aria-label='Create Variable' disabled={!allInputsValid()} onClick={addVariable}>
                  {`${knownVariable ? 'Import' : 'Create'} Variable`}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Hold {hotkeyText('mod')} to add an additional Variable</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
