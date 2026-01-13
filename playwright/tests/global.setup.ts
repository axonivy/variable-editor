const setup = async () => {
  if (!process.env.BASE_URL) {
    return;
  }
  const server = process.env.BASE_URL ?? 'http://localhost:8080';
  await fetch(`${server}api/web-ide/workspaces`, {
    method: 'GET',
    headers: {
      'X-Requested-By': 'dataclass-editor-tests',
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from('Developer:Developer').toString('base64')
    }
  });
};

export default setup;
