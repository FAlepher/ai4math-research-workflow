// Newly written offline example inspired by the original extension's
// branching and join state. No browser-page adapters or model calls.
(function (root) {
  'use strict';
  const roles = ['research', 'integration'];

  function start(task) {
    if (typeof task !== 'string' || !task.trim()) throw new Error('Enter a task.');
    return {version: 1, task: task.trim(), status: 'waiting', results: {}, joined: null};
  }

  function submit(state, role, text) {
    if (!state || state.status !== 'waiting') throw new Error('Start a round first.');
    if (!roles.includes(role)) throw new Error('Unknown role.');
    if (typeof text !== 'string' || !text.trim()) throw new Error('Result must not be empty.');
    return {...state, results: {...state.results, [role]: text.trim()}};
  }

  function join(state) {
    if (!state || state.status !== 'waiting') throw new Error('Start a round first.');
    const missing = roles.filter(role => typeof state.results[role] !== 'string' || !state.results[role].trim());
    if (missing.length) return {ok: false, state, missing};
    return {ok: true, state: {...state, status: 'joined', joined: roles.map(role => ({role, text: state.results[role]}))}};
  }

  const api = {start, submit, join};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ResearchExample = api;
})(globalThis);
