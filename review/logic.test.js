'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {timingVerdict, prepareJoin, snapshotSignature} = require('./logic');

const base = () => ({thinkingState:'done', thinkingSeconds:100, wallMs:100000});
const silent = () => ({thinkingState:'none', thinkingSeconds:null, wallMs:10000});
const skip = () => ({...silent(), shortPrompt:true});

test('interleaved skipped rounds do not hide the relevant streak', () => {
  const rounds = [base(), base()];
  for (let i = 0; i < 6; i++) rounds.push(silent(), skip(), skip());
  assert.deepEqual(timingVerdict(rounds), {streak:6, verdict:'collapsed'});
});

test('interrupted eligible rounds end the streak', () => {
  const rounds = [base(), base(), silent(), {thinkingState:'stopped'}, silent(), skip()];
  assert.deepEqual(timingVerdict(rounds), {streak:1, verdict:'unknown'});
});

test('missing measurements or baseline stay uncertain for short rounds', () => {
  assert.equal(timingVerdict([silent(), {...silent(),wallMs:null}, silent()]).verdict,'unknown');
  assert.equal(timingVerdict([silent(), silent(), silent()]).verdict,'unknown');
});

test('a stable baseline and ordinary timings yield not', () => {
  const normal = () => ({...silent(), wallMs:80000});
  assert.equal(timingVerdict([base(),base(),normal(),normal(),normal()]).verdict,'not');
});

test('join requires a successful nonempty result for each role', () => {
  const research = {ok:true,text:'Research result'};
  for (const audit of [undefined,{ok:false,text:'old result'},{ok:true,text:'  '}]) {
    assert.equal(prepareJoin(['research','audit'],{research,audit}).ok,false);
  }
  const joined = prepareJoin(['research','audit'],{research,audit:{ok:true,text:'Audit result'}});
  assert.deepEqual(joined.parts.map(p=>p.role),['research','audit']);
  assert.equal(prepareJoin([],{}).ok,false);
});

test('a change in a protection signal changes the snapshot signature', () => {
  const snapshot = {convId:'synthetic', assistantIds:[], errors:[], halt:[]};
  assert.notEqual(snapshotSignature(snapshot), snapshotSignature({...snapshot, halt:['synthetic']}));
  assert.equal(snapshotSignature(snapshot), snapshotSignature({...snapshot, halt:[]}));
});
