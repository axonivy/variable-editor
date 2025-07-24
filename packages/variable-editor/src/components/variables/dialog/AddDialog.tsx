import {
  BasicDialogContent,
  BasicField,
  Button,
  Combobox,
  Dialog,
  DialogContent,
  DialogTrigger,
  hotkeyText,
  Input,
  Message,
  selectRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useDialogHotkeys,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { EMPTY_KNOWN_VARIABLES, type KnownVariables } from '@axonivy/variable-editor-protocol';
import { type Table } from '@tanstack/react-table';
import { useEffect, useRef, useState, type ReactNode } from 'react';
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
  children: ReactNode;
};

const DIALOG_HOTKEY_IDS = ['addDialog'];

export const AddVariableDialog = ({ table, children }: AddVariableDialogProps) => {
  const { open, onOpenChange } = useDialogHotkeys(DIALOG_HOTKEY_IDS);
  const { addVar: shortcut } = useKnownHotkeys();
  useHotkeys(shortcut.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>{children}</DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{shortcut.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent onCloseAutoFocus={e => e.preventDefault()}>
        <AddVariableDialogContent table={table} closeDialog={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export const AddVariableDialogContent = ({ table, closeDialog }: { table: Table<Variable>; closeDialog: () => void }) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { context, variables, setVariables, setSelectedVariable } = useAppContext();
  const [name, setName] = useState(newNodeName(table, 'NewVariable'));
  const [namespace, setNamespace] = useState(keyOfFirstSelectedNonLeafRow(table));
  const { nameValidationMessage, namespaceValidationMessage } = useValidateAddVariable(name, namespace, variables);

  const [knownVariable, setKnownVariable] = useState<KnownVariables>();
  useEffect(() => setKnownVariable(undefined), [name, namespace]);

  const knownVariables = useMeta('meta/knownVariables', context, EMPTY_KNOWN_VARIABLES).data;

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
      closeDialog();
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
      closeDialog();
    } else {
      setName('');
      nameInputRef.current?.focus();
    }
  };

  const enter = useHotkeys(
    ['Enter', 'mod+Enter'],
    e => {
      if (!allInputsValid()) {
        return;
      }
      addVariable(e);
    },
    { scopes: DIALOG_HOTKEY_IDS, enableOnFormTags: true }
  );

  const allInputsValid = () => !nameValidationMessage && !namespaceValidationMessage;

  return (
    <BasicDialogContent
      title={t('dialog.addVar.title')}
      description={t('dialog.addVar.desc')}
      submit={
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='primary'
                size='large'
                icon={IvyIcons.Plus}
                aria-label={t('dialog.create')}
                disabled={!allInputsValid()}
                onClick={addVariable}
              >
                {knownVariable ? t('dialog.import') : t('dialog.create')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('dialog.createTooltip', { modifier: hotkeyText('mod') })}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
      cancel={
        <Button variant='outline' size='large'>
          {t('common.label.cancel')}
        </Button>
      }
      ref={enter}
      tabIndex={-1}
    >
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
    </BasicDialogContent>
  );
};
