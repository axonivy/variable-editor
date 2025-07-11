import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type VariableUpdate } from './variable';

export type Metadata = { type: MetadataType };
const metadataOptions = ['', 'default', 'password', 'daytime', 'enum', 'file'] as const;
export type MetadataType = (typeof metadataOptions)[number];

export interface EnumMetadata extends Metadata {
  values: Array<string>;
}

export interface FileMetadata extends Metadata {
  extension: FileMetadataFilenameExtension;
}
export type FileMetadataFilenameExtension = (typeof fileMetadataFilenameExtensionOptions)[number]['value'];

export const useMetadataOptions = (): Array<{ label: string; value: MetadataType }> => {
  const { t } = useTranslation();
  return useMemo(
    () => [
      { label: t('metadata.default'), value: 'default' },
      { label: t('metadata.password'), value: 'password' },
      { label: t('metadata.daytime'), value: 'daytime' },
      { label: t('metadata.enum'), value: 'enum' },
      { label: t('metadata.file'), value: 'file' }
    ],
    [t]
  );
};

export const fileMetadataFilenameExtensionOptions = [
  { label: 'txt', value: 'txt' },
  { label: 'json', value: 'json' }
] as const satisfies Array<{ label: string; value: string }>;

export const isMetadataType = (metadataType: string): metadataType is MetadataType => {
  return metadataOptions.includes(metadataType as MetadataType);
};

export const isMetadata = (metadata: unknown): metadata is Metadata => {
  return typeof metadata === 'object' && metadata !== null && 'type' in metadata && isMetadataType((metadata as Metadata).type);
};

export const isEnumMetadata = (metadata?: Metadata): metadata is EnumMetadata => {
  return metadata !== undefined && metadata.type === 'enum';
};

export const isFileMetadata = (metadata?: Metadata): metadata is FileMetadata => {
  return metadata !== undefined && metadata.type === 'file';
};

export const isFileMetadataFilenameExtension = (filenameExtension: string): filenameExtension is FileMetadataFilenameExtension => {
  return fileMetadataFilenameExtensionOptions.some(option => option.value === filenameExtension);
};

export const toEnumMetadataUpdate = (values: Array<string>): VariableUpdate => {
  const metadata: EnumMetadata = { type: 'enum', values: values };
  return { key: 'metadata', value: metadata };
};

export const toFileMetadataUpdate = (filenameExtension: FileMetadataFilenameExtension): VariableUpdate => {
  const metadata: FileMetadata = { type: 'file', extension: filenameExtension };
  return { key: 'metadata', value: metadata };
};
