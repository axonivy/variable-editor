import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { getNode } from './tree/tree-data';

export const useHeaderTitles = () => {
  const { context, variables, selectedVariable } = useAppContext();
  const { t } = useTranslation();
  const mainTitle = t('title.main', { name: context.pmv });
  let detailTitle = mainTitle;
  const variable = getNode(variables, selectedVariable);
  if (variable) {
    detailTitle = t('title.detail', { name: variable.name });
  }
  return { mainTitle, detailTitle };
};
