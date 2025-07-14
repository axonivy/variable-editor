import {
  BasicDialog,
  BasicField,
  Button,
  Combobox,
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
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { useMeta } from '../../../context/useMeta';
import { keyOfFirstSelectedNonLeafRow, keysOfAllNonLeafRows, newNodeName, toRowId } from '../../../utils/tree/tree';
import { addNode } from '../../../utils/tree/tree-data';
import type { AddNodeReturnType } from '../../../utils/tree/types';
import { useKnownHotkeys } from '../../../utils/useKnownHotkeys';
import { createVariable, type Variable } from '../data/variable';
import './AddDialog.css';
import { addKnownVariable, findVariable } from './known-variables';
import { useValidateAddVariable } from './useValidateAddVariable';

type AddVariableDialogProps = {
  table: Table<Variable>;
};

export const AddVariableDialog = ({ table }: AddVariableDialogProps) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
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
  const { nameValidationMessage, namespaceValidationMessage } = useValidateAddVariable(name, namespace, variables);

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

  const addVar = () => {
    setVariables(old => {
      const addNodeReturnValue = addNode(name, namespace, old, createVariable);
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
    const namespaceKey = namespace ? namespace.split('.') : [];
    const foundKnownVariable = findVariable(knownVariables, ...namespaceKey, name);
    if (foundKnownVariable) {
      setKnownVariable(foundKnownVariable.node);
      event.preventDefault();
      return;
    }
    addVar();
    if (!event.ctrlKey && !event.metaKey) {
      onOpenChange(false);
    } else {
      setName('');
      nameInputRef.current?.focus();
    }
  };

  const { addVar: shortcut } = useKnownHotkeys();
  useHotkeys(shortcut.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });
  const enter = useHotkeys(
    ['Enter', 'mod+Enter'],
    e => {
      if (!allInputsValid()) {
        return;
      }
      addVariable(e);
    },
    { scopes: ['addDialog'], enabled: open, enableOnFormTags: true }
  );

  const allInputsValid = () => !nameValidationMessage && !namespaceValidationMessage;

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      contentProps={{
        title: t('dialog.addVar.title'),
        description: t('dialog.addVar.desc'),
        buttonClose: (
          <Button variant='outline' size='large'>
            {t('common.label.cancel')}
          </Button>
        ),
        buttonCustom: (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='primary' size='large' aria-label={t('dialog.create')} disabled={!allInputsValid()} onClick={addVariable}>
                  {knownVariable ? t('dialog.import') : t('dialog.create')}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('dialog.createTooltip', { modifier: hotkeyText('mod') })}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
        onCloseAutoFocus: e => e.preventDefault()
      }}
      dialogTrigger={
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
      }
    >
      <Flex direction='column' gap={3} ref={enter} tabIndex={-1}>
        <BasicField label={t('common.label.name')} message={nameValidationMessage} aria-label={t('common.label.name')}>
          <Input ref={nameInputRef} value={name} onChange={event => setName(event.target.value)} />
        </BasicField>
        <BasicField
          label={t('common.label.namespace')}
          message={namespaceValidationMessage ?? { variant: 'info', message: t('message.variableInfo') }}
          aria-label={t('common.label.namespace')}
        >
          <Combobox
            value={namespace}
            onChange={setNamespace}
            onInput={event => setNamespace(event.currentTarget.value)}
            options={namespaceOptions()}
          />
        </BasicField>
        {knownVariable && <Message className='import-message' variant='warning' message={t('message.variablePresent')} />}
      </Flex>
    </BasicDialog>
  );
};
