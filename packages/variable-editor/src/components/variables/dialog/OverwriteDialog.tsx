import {
  BasicDialogHeader,
  Dialog,
  DialogContent,
  DialogTrigger,
  selectRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useDialogHotkeys,
  useHotkeys
} from '@axonivy/ui-components';
import type { KnownVariables } from '@axonivy/variable-editor-protocol';
import { type Table } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { toRowId } from '../../../utils/tree/tree';
import { useKnownHotkeys } from '../../../utils/useKnownHotkeys';
import { type Variable } from '../data/variable';
import { addKnownVariable } from './known-variables';
import { VariableBrowser } from './VariableBrowser';

type OverwriteVariableDialogProps = {
  table: Table<Variable>;
  children: ReactNode;
};

export const OverwriteDialog = ({ table, children }: OverwriteVariableDialogProps) => {
  const { t } = useTranslation();
  const { setVariables, setSelectedVariable } = useAppContext();
  const { open, onOpenChange } = useDialogHotkeys(['overwriteDialog']);
  const { importVar: shortcut } = useKnownHotkeys();
  useHotkeys(shortcut.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });

  const insertVariable = (node?: KnownVariables): void => {
    if (!node) {
      return;
    }
    setVariables(old => {
      const addNodeReturnValue = addKnownVariable(old, node);
      selectRow(table, toRowId(addNodeReturnValue.newNodePath));
      setSelectedVariable(addNodeReturnValue.newNodePath);
      return addNodeReturnValue.newData;
    });
  };

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
      <DialogContent>
        <BasicDialogHeader title={t('dialog.overwrite.title')} description={t('dialog.overwrite.desc')} />
        <VariableBrowser
          applyFn={node => {
            insertVariable(node);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
