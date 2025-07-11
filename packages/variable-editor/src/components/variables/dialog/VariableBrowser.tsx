import { BrowsersView, type BrowsersViewProps, useBrowser } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { EMPTY_KNOWN_VARIABLES, type KnownVariables } from '@axonivy/variable-editor-protocol';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { useMeta } from '../../../context/useMeta';
import { toNodes } from './known-variables';

export const VariableBrowser = ({ applyFn }: { applyFn: (node?: KnownVariables) => void }) => {
  const { t } = useTranslation();
  const { context } = useAppContext();
  const knownVariables = useMeta('meta/knownVariables', context, EMPTY_KNOWN_VARIABLES).data;
  const nodes = useMemo(() => toNodes(knownVariables), [knownVariables]);
  const variableBrowser = useBrowser(nodes);
  const options = useMemo<BrowsersViewProps['options']>(
    () => ({
      applyBtn: { label: t('dialog.import'), icon: IvyIcons.FileImport },
      cancelBtn: { label: t('common.label.cancel') },
      info: { label: t('common.label.info') },
      search: { placeholder: t('common.label.search') }
    }),
    [t]
  );
  return (
    <BrowsersView
      browsers={[
        {
          name: t('label.variables'),
          icon: IvyIcons.Tool,
          browser: variableBrowser,
          infoProvider: row => <InfoProvider node={row?.original.data as KnownVariables} />
        }
      ]}
      apply={(_, result) => {
        applyFn(result?.data as KnownVariables);
      }}
      options={options}
    />
  );
};

const InfoProvider = ({ node }: { node?: KnownVariables }) => {
  if (!node) {
    return;
  }
  let value = node.value;
  if (node.metaData.type === 'password') {
    value = '***';
  }
  return (
    <div>
      <div>{`${node.namespace}.${node.name}`}</div>
      <div>{node.description}</div>
      {value && <div>{node.name + ' = ' + value}</div>}
    </div>
  );
};
