export const trimNamespace = (namespace: string) => {
  return namespace
    .trim()
    .split('.')
    .filter(part => part !== '')
    .join('.');
};
