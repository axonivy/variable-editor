import { BrowsersView, useBrowser } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { EMPTY_KNOWN_VARIABLES, type KnownVariables } from '@axonivy/variable-editor-protocol';
import { useMemo } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useMeta } from '../../../context/useMeta';
import { toNodes } from './known-variables';

export const VariableBrowser = ({ applyFn }: { applyFn: (node?: KnownVariables) => void }) => {
  const { context } = useAppContext();
  const knownVariables = useMeta('variables/meta/knownVariables', context, EMPTY_KNOWN_VARIABLES).data;
  const nodes = useMemo(() => toNodes(knownVariables), [knownVariables]);
  const variableBrowser = useBrowser(nodes);
  return (
    <BrowsersView
      browsers={[
        {
          name: 'Variables',
          icon: IvyIcons.Tool,
          browser: variableBrowser,
          infoProvider: row => <InfoProvider node={row?.original.data as KnownVariables} />
        }
      ]}
      apply={(_, result) => {
        applyFn(result?.data as KnownVariables);
      }}
      applyBtn={{ label: 'Import', icon: IvyIcons.FileImport }}
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
