import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Flex,
  selectRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeyLocalScopes,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { KnownVariables } from '@axonivy/variable-editor-protocol';
import { type Table } from '@tanstack/react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { toRowId } from '../../../utils/tree/tree';
import { useKnownHotkeys } from '../../../utils/useKnownHotkeys';
import { type Variable } from '../data/variable';
import { addKnownVariable } from './known-variables';
import './OverwriteDialog.css';
import { VariableBrowser } from './VariableBrowser';

type OverwriteProps = {
  table: Table<Variable>;
};

export const OverwriteDialog = ({ table }: OverwriteProps) => {
  const { t } = useTranslation();
  const { setVariables, setSelectedVariable } = useAppContext();
  const [dialogState, setDialogState] = useState(false);
  const { activateLocalScopes, restoreLocalScopes } = useHotkeyLocalScopes(['overwriteDialog']);
  const { importVar: shortcut } = useKnownHotkeys();
  const onOpenChange = (open: boolean) => {
    setDialogState(open);
    if (open) {
      activateLocalScopes();
    } else {
      restoreLocalScopes();
    }
  };

  useHotkeys(shortcut.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !dialogState });

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
    <Dialog open={dialogState} onOpenChange={onOpenChange}>
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
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className='variables-editor-overwrite-dialog-content'>
        <Flex direction='column' gap={4}>
          <DialogHeader>
            <DialogTitle>{t('dialog.overwrite.title')}</DialogTitle>
          </DialogHeader>
          <DialogDescription>{t('dialog.overwrite.desc')}</DialogDescription>
          <VariableBrowser
            applyFn={node => {
              insertVariable(node);
              setDialogState(false);
            }}
          />
        </Flex>
      </DialogContent>
    </Dialog>
  );
};
