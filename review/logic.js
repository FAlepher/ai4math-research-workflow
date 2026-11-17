// Isolated research prototype, based on the state logic in the private
// ai-formats extension. It does not include any page or network operations.
'use strict';

function collectSilentTail(rounds) {
  const tail = [];
  for (let i = rounds.length - 1; i >= 0; i--) {
    const round = rounds[i];
    if (round.continued || round.shortPrompt) continue;
    if (round.thinkingState !== 'none') break;
    tail.push(round);
  }
  return tail.reverse();
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function timingVerdict(rounds, ratio = 0.5, absoluteSeconds = 120) {
  const tail = collectSilentTail(rounds);
  const walls = tail.map(r => r.wallMs).filter(Number.isFinite);
  if (walls.length < 3) return {streak: tail.length, verdict: 'unknown'};
  const baseline = rounds.filter(r => !r.continued && !r.shortPrompt &&
      Number.isFinite(r.thinkingSeconds) && Number.isFinite(r.wallMs)).map(r => r.wallMs);
  const measured = median(walls);
  const verdict = baseline.length >= 2
    ? (measured < median(baseline) * ratio ? 'collapsed' : 'not')
    : (measured < absoluteSeconds * 1000 ? 'unknown' : 'not');
  return {streak: tail.length, verdict};
}

function prepareJoin(requiredRoles, results) {
  if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
    return {ok: false, reason: 'no required roles'};
  }
  for (const role of requiredRoles) {
    if (!Object.hasOwn(results, role) || results[role]?.ok !== true ||
        typeof results[role].text !== 'string' || !results[role].text.trim()) {
      return {ok: false, reason: `missing or failed result: ${role}`};
    }
  }
  return {ok: true, parts: requiredRoles.map(role => ({role, text: results[role].text}))};
}

// Extends the original content.js change signature with halt signals.
// This only classifies synthetic data; it does not stop a running extension.
function snapshotSignature(s) {
  return JSON.stringify([
    s.convId, s.ready, s.generating, s.thinkingNow, s.thinking,
    s.thinkingRaw, (s.assistantIds || []).length,
    (s.assistantIds || []).slice(-1)[0], s.lastUserId, s.awaitingReply,
    s.pausedServer, s.reconnecting, (s.errors || []).join('|'), s.challenge,
    s.halt || []
  ]);
}

module.exports = {collectSilentTail, timingVerdict, prepareJoin, snapshotSignature};
