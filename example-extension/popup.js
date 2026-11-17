'use strict';
const api = globalThis.ResearchExample;
const el = id => document.getElementById(id);
const key = 'offlineResearchExample';
let state = null;
let busy = true;

function setBusy(value) {
  busy = value;
  for (const button of document.querySelectorAll('button')) button.disabled = value;
}

function render(message) {
  const available = state ? Object.keys(state.results) : [];
  el('roles').textContent = `Received: ${available.length ? available.join(', ') : 'none'}`;
  el('status').textContent = message || (state ? `Round: ${state.status}` : 'Create a round to begin.');
  el('result').textContent = state && state.joined ? state.joined.map(p => `${p.role}: ${p.text}`).join('\n\n') : '';
}

async function save(message) {
  await chrome.storage.local.set({[key]: state});
  render(message);
}

function handle(action) {
  return async () => {
    if (busy) return;
    setBusy(true);
    try { await action(); }
    catch (error) { render(`Not completed: ${error.message}`); }
    finally { setBusy(false); }
  };
}

el('start').addEventListener('click', handle(async () => {
  state = api.start(el('task').value);
  await save('Round started; waiting for both results.');
}));
el('research').addEventListener('click', handle(async () => {
  state = api.submit(state, 'research', 'Synthetic research result.');
  await save('Research result recorded.');
}));
el('integration').addEventListener('click', handle(async () => {
  state = api.submit(state, 'integration', 'Synthetic integration review.');
  await save('Integration result recorded.');
}));
el('join').addEventListener('click', handle(async () => {
  const result = api.join(state);
  if (!result.ok) { render(`Cannot join: waiting for ${result.missing.join(', ')}.`); return; }
  state = result.state;
  await save('Both synthetic results joined.');
}));
el('reset').addEventListener('click', handle(async () => {
  state = null;
  await chrome.storage.local.remove(key);
  render();
}));

setBusy(true);
chrome.storage.local.get(key).then(saved => {
  if (saved[key] && saved[key].version === 1) state = saved[key];
  render();
}).catch(error => render(`Could not restore example: ${error.message}`))
  .finally(() => setBusy(false));
