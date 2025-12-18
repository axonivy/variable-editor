import { trimNamespace } from './trim-namespace';

test('trimNamespace', () => {
  expect(trimNamespace('')).toEqual('');
  expect(trimNamespace('   ')).toEqual('');
  expect(trimNamespace('namespace')).toEqual('namespace');
  expect(trimNamespace('  namespace  ')).toEqual('namespace');
  expect(trimNamespace('part1.part2.part3')).toEqual('part1.part2.part3');
  expect(trimNamespace('  part1 . part2 .  part3  ')).toEqual('part1 . part2 .  part3');
  expect(trimNamespace(' ..part1..part2.part3...  ')).toEqual('part1.part2.part3');
});
