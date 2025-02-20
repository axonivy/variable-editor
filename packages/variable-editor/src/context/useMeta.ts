import { useClient, type MetaRequestTypes } from '@axonivy/variable-editor-protocol';
import { useQuery } from '@tanstack/react-query';

type NonUndefinedGuard<T> = T extends undefined ? never : T;

export function useMeta<TMeta extends keyof MetaRequestTypes>(
  path: TMeta,
  args: MetaRequestTypes[TMeta][0],
  initialData: NonUndefinedGuard<MetaRequestTypes[TMeta][1]>
): { data: MetaRequestTypes[TMeta][1] } {
  const client = useClient();
  return useQuery({
    queryKey: [path, args],
    queryFn: () => client.meta(path, args),
    initialData: initialData
  });
}
