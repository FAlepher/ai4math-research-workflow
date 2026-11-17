'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const original = require('./original-excerpts');
const revised = require('./logic');

const baseline = () => ({thinkingState:'done', thinkingSeconds:100, wallMs:100000});
const silent = () => ({thinkingState:'none', thinkingSeconds:null, wallMs:10000});
const skipped = () => ({...silent(), shortPrompt:true});

test('interleaved skipped rounds: original and adapted timing windows differ', () => {
  const rounds = [baseline(),baseline()];
  for (let i = 0; i < 6; i++) rounds.push(silent(),skipped(),skipped());
  const streak = original.silentStreak({rounds});
  assert.equal(streak, 6);
  assert.equal(original.wallVerdict({rounds},streak), 'unknown');
  assert.deepEqual(revised.timingVerdict(rounds), {streak:6,verdict:'collapsed'});
});

test('without interleaving, both calculate the same verdict for this fixture', () => {
  const rounds = [baseline(),baseline(),silent(),silent(),silent()];
  const streak = original.silentStreak({rounds});
  assert.equal(original.wallVerdict({rounds},streak), 'collapsed');
  assert.equal(revised.timingVerdict(rounds).verdict, 'collapsed');
});

test('only protection signal changes: original ignores it, adaptation records it', () => {
  const before = {convId:'synthetic',assistantIds:[],errors:[],halt:[]};
  const after = {...before,halt:['synthetic']};
  assert.equal(original.signature(before),original.signature(after));
  assert.notEqual(revised.snapshotSignature(before),revised.snapshotSignature(after));
});
