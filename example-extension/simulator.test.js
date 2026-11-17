'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const flow = require('./simulator');

test('a round joins only after both nonempty results are supplied', () => {
  let s = flow.start('Explore a synthetic question');
  s = flow.submit(s, 'research', 'Synthetic research');
  const blocked = flow.join(s);
  assert.equal(blocked.ok, false);
  assert.deepEqual(blocked.missing, ['integration']);
  s = flow.submit(s, 'integration', 'Synthetic review');
  const result = flow.join(s);
  assert.equal(result.state.status, 'joined');
  assert.deepEqual(result.state.joined.map(p => p.role), ['research', 'integration']);
});

test('empty inputs and results after a completed round are rejected', () => {
  assert.throws(() => flow.start('  '));
  let s = flow.start('Task');
  assert.throws(() => flow.submit(s, 'research', '  '));
  assert.throws(() => flow.submit(s, 'other', 'Result'));
  s = flow.submit(s, 'research', 'R');
  s = flow.submit(s, 'integration', 'I');
  s = flow.join(s).state;
  assert.throws(() => flow.submit(s, 'research', 'Another'));
});
