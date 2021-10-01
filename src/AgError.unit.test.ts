// UNIT TESTS

import { AgError } from './AgError';

test('AgError meets requirements to be a valid AgError', () => {
  expect(AgError).toBeValidAgErrorClass(
    'AgError',
    'AgError',
  );
});
