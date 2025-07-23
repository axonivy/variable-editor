import {
  BasicDialogHeader,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Flex,
  selectRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useDialogHotkeys,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { KnownVariables } from '@axonivy/variable-editor-protocol';
import { type Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { toRowId } from '../../../utils/tree/tree';
import { useKnownHotkeys } from '../../../utils/useKnownHotkeys';
import { type Variable } from '../data/variable';
import { addKnownVariable } from './known-variables';
import './OverwriteDialog.css';
import { VariableBrowser } from './VariableBrowser';

export const OverwriteDialog = ({ table }: { table: Table<Variable> }) => {
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
            <DialogTrigger asChild>
              <Button icon={IvyIcons.FileImport} aria-label={shortcut.label} />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{shortcut.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className='variables-editor-overwrite-dialog-content'>
        <Flex direction='column' gap={4}>
          <BasicDialogHeader title={t('dialog.overwrite.title')} description={t('dialog.overwrite.desc')} />
          <VariableBrowser
            applyFn={node => {
              insertVariable(node);
              onOpenChange(false);
            }}
          />
        </Flex>
      </DialogContent>
    </Dialog>
  );
};
