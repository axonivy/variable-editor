import { BasicField, BasicSelect } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import {
  fileMetadataFilenameExtensionOptions,
  isEnumMetadata,
  isFileMetadata,
  toFileMetadataUpdate,
  useMetadataOptions,
  type FileMetadataFilenameExtension,
  type Metadata,
  type MetadataType
} from '../data/metadata';
import { type Variable, type VariableUpdates } from '../data/variable';
import { EnumValues } from './EnumValues';

type MetadataPartProps = {
  variable: Variable;
  onChange: (updates: VariableUpdates) => void;
};

export const MetadataPart = ({ variable, onChange }: MetadataPartProps) => {
  const { t } = useTranslation();
  const metadata = variable.metadata;

  const onValueChange = (value: MetadataType) => {
    const newMetadata: Metadata = { type: value === 'default' ? '' : value };
    const updates: VariableUpdates = [];
    switch (value) {
      case 'daytime':
        updates.push({ key: 'value', value: '00:00' });
        break;
      case 'enum':
        updates.push({ key: 'value', value: '' });
        if (isEnumMetadata(newMetadata)) {
          newMetadata.values = [''];
        }
        break;
      case 'file':
        updates.push({ key: 'value', value: '' });
        if (isFileMetadata(newMetadata)) {
          newMetadata.extension = 'txt';
        }
    }
    updates.push({ key: 'metadata', value: newMetadata });
    onChange(updates);
  };

  const metadataOptions = useMetadataOptions();

  return (
    <>
      <BasicField label={t('label.metadata')}>
        <BasicSelect value={metadata.type === '' ? 'default' : metadata.type} items={metadataOptions} onValueChange={onValueChange} />
      </BasicField>
      {isEnumMetadata(metadata) && <EnumValues selectedValue={variable.value} values={metadata.values} onChange={onChange} />}
      {isFileMetadata(metadata) && (
        <BasicField label={t('label.filenameExtension')}>
          <BasicSelect
            value={metadata.extension}
            items={fileMetadataFilenameExtensionOptions}
            onValueChange={(filenameExtension: FileMetadataFilenameExtension) => onChange([toFileMetadataUpdate(filenameExtension)])}
          />
        </BasicField>
      )}
    </>
  );
};
