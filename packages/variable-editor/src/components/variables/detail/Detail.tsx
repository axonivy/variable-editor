import { Button, Flex, SidebarHeader, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, useHotkeys } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAction } from '../../../context/useAction';
import { useHeaderTitles } from '../../../utils/useHeaderTitles';
import { useKnownHotkeys } from '../../../utils/useKnownHotkeys';
import { VariablesDetailContent } from './DetailContent';

export const Detail = ({ helpUrl }: { helpUrl: string }) => {
  const { detailTitle } = useHeaderTitles();
  const openUrl = useAction('openUrl');
  const { openHelp: helpText } = useKnownHotkeys();
  useHotkeys(helpText.hotkey, () => openUrl(helpUrl), { scopes: ['global'] });

  return (
    <Flex direction='column' className='variables-editor-panel-content variables-editor-detail-panel'>
      <SidebarHeader title={detailTitle} icon={IvyIcons.PenEdit} className='variables-editor-detail-header' tabIndex={-1}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button icon={IvyIcons.Help} onClick={() => openUrl(helpUrl)} aria-label={helpText.label} />
            </TooltipTrigger>
            <TooltipContent>{helpText.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SidebarHeader>
      <VariablesDetailContent />
    </Flex>
  );
};
