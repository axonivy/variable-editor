import type { MessageData } from '@axonivy/ui-components';
import type { Severity, ValidationResult } from '@axonivy/variable-editor-protocol';

export const messageDataOfValidation = (validation: ValidationResult, openUrl: (url: string) => void): MessageData => ({
  message: validation.message,
  variant: validation.severity.toLocaleLowerCase() as Lowercase<Severity>,
  reference: {
    tooltip: validation.code,
    openUrl: () => openUrl(validation.url)
  }
});
