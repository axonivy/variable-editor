import { BasicField, BasicInput, BasicSelect, Message, PasswordInput, type MessageData } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { isEnumMetadata } from '../data/metadata';
import type { Variable, VariableUpdates } from '../data/variable';

type ValueProps = {
  variable: Variable;
  onChange: (updates: VariableUpdates) => void;
  message?: MessageData;
};

export const Value = ({ variable, onChange, message }: ValueProps) => {
  const { t } = useTranslation();
  const enumSelectItems = useMemo(() => {
    const metadata = variable.metadata;
    if (!isEnumMetadata(metadata)) {
      return [];
    }
    return metadata.values.filter(value => value !== '').map(value => ({ label: value, value: value }));
  }, [variable]);

  const input = () => {
    switch (variable.metadata.type) {
      case 'password':
        return <PasswordInput value={variable.value} onChange={(newValue: string) => onChange([{ key: 'value', value: newValue }])} />;
      case 'daytime':
        return (
          <BasicInput value={variable.value} onChange={event => onChange([{ key: 'value', value: event.target.value }])} type='time' />
        );
      case 'enum':
        return (
          <BasicSelect
            value={variable.value}
            items={enumSelectItems}
            emptyItem={true}
            onValueChange={(value: string) => onChange([{ key: 'value', value: value }])}
          />
        );
      case 'file':
        return (
          <>
            <BasicInput value={variable.value} disabled={true} />
            <Message message={t('message.valueFromFile')} variant='info' />
          </>
        );
      default:
        return (
          <BasicInput
            value={variable.value}
            onChange={event => onChange([{ key: 'value', value: event.target.value }])}
            autoFocus={variable.value.length === 0}
          />
        );
    }
  };

  return (
    <BasicField label={t('common.label.value')} message={message}>
      {input()}
    </BasicField>
  );
};
