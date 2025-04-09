import { hotkeyText, isWindows } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type KnownHotkey = { hotkey: string; label: string };

export const useKnownHotkeys = () => {
  const { t } = useTranslation();
  const undo = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+Z';
    return { hotkey, label: t('common.hotkey.undo', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const redo = useMemo<KnownHotkey>(() => {
    const hotkey = isWindows() ? 'mod+Y' : 'mod+shift+Z';
    return { hotkey, label: t('common.hotkey.redo', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const openHelp = useMemo<KnownHotkey>(() => {
    const hotkey = 'F1';
    return { hotkey, label: t('common.hotkey.help', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const addVar = useMemo<KnownHotkey>(() => {
    const hotkey = 'A';
    return { hotkey, label: t('hotkey.addVariable', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const importVar = useMemo<KnownHotkey>(() => {
    const hotkey = 'I';
    return { hotkey, label: t('hotkey.importVariable', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const deleteVar = useMemo<KnownHotkey>(() => {
    const hotkey = 'Delete';
    return { hotkey, label: t('hotkey.deleteVariable', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const focusToolbar = useMemo<KnownHotkey>(() => {
    const hotkey = '1';
    return { hotkey, label: t('common.hotkey.focusToolbar', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const focusMain = useMemo<KnownHotkey>(() => {
    const hotkey = '2';
    return { hotkey, label: t('common.hotkey.focusMain', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const focusInscription = useMemo<KnownHotkey>(() => {
    const hotkey = '3';
    return { hotkey, label: t('common.hotkey.focusInscription', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  return { undo, redo, openHelp, addVar, importVar, deleteVar, focusToolbar, focusMain, focusInscription };
};
