// Source excerpts: original extension/src/background.js and content.js.
// Function bodies retained; standalone CFG added and line comments removed.
// Pure data logic only: no browser or network operations.
'use strict';
const CFG = {silentWallRatio: 0.5, silentWallSeconds: 120};

function medianOf(sorted) {
  const m = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[m] : (sorted[m - 1] + sorted[m]) / 2;
}

function wallVerdict(ws, streak) {
  const tail = (ws.rounds || []).slice(-streak)
    .filter((r) => !r.continued && !r.shortPrompt);
  const walls = tail.map((r) => r.wallMs).filter((w) => w !== null && w !== undefined);
  if (walls.length < 3) return "unknown";

  const base = (ws.rounds || [])
    .filter((r) => !r.continued && !r.shortPrompt &&
                   r.thinkingSeconds !== null && r.thinkingSeconds !== undefined)
    .map((r) => r.wallMs).filter((w) => w !== null && w !== undefined).sort((a, b) => a - b);

  walls.sort((a, b) => a - b);
  const med = medianOf(walls);

  if (base.length >= 2) {
    return med < medianOf(base) * (CFG.silentWallRatio || 0.5) ? "collapsed" : "not";
  }
  return med < (CFG.silentWallSeconds || 120) * 1000 ? "unknown" : "not";
}

function silentStreak(ws) {
  const rs = (ws && ws.rounds) || [];
  let n = 0;
  for (let i = rs.length - 1; i >= 0; i--) {
    const r = rs[i];
    if (r.continued || r.shortPrompt) continue;
    if (r.thinkingState !== "none") break;
    n++;
  }
  return n;
}

function signature(s) {
  return JSON.stringify([
    s.convId, s.ready, s.generating, s.thinkingNow, s.thinking,
    s.thinkingRaw, (s.assistantIds || []).length,
    (s.assistantIds || []).slice(-1)[0], s.lastUserId,
    s.awaitingReply,
    s.pausedServer, s.reconnecting,
    (s.errors || []).join("|"), s.challenge
  ]);
}

module.exports = {medianOf, wallVerdict, silentStreak, signature};
