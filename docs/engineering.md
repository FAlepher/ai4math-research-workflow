# Engineering practice and boundaries

Static review of the private source identified the following implementation elements:

| Source location in the original project | Observed implementation | Scope of this observation |
| --- | --- | --- |
| `extension/src/config.js` | Linear route and a branching route with separate research and integration targets; configurable thresholds and send allowlist | Configuration, not evidence of a successful live run |
| `extension/src/background.js` | Persistent browser storage, route state, branching, joining and snapshot-driven progression | Source inspection, not a reliability measurement |
| `extension/src/content.js`, `probe.js` | Periodic page-state collection and messaging | Coupled to a third-party interface |
| `extension/src/actions.js` | Browser-page action and send logic | Excluded from this public candidate |
| `extension/src/selectors.js` | Page selectors and error patterns | Subject to interface changes; excluded from this public candidate |
| `tools/brief.py` | Reads extension state and produces a compact supervision report | Static inspection only; its local output can include session metadata and is excluded |

## Design decisions and limits

* **Coordinating parallel work:** the configured branching route distributes work to two roles and collects results before a join. The join checks whether result entries are present, but one read-failure path stores an empty string. In an isolated test with simulated dependencies, a failed read led to a join call. This does not establish that the issue occurred in a live session.
* **Recognizing a new round:** the background state logic normally records a round after it has observed generation and a previously unseen assistant message. This is a conservative heuristic for a changing interface, not proof that every real round will be detected.
* **Observing delivery:** a send path checks for a matching message in the page. That is a client-side observation, not independent confirmation that the service received or retained the full message.
* **Interface dependency:** selector definitions are grouped in one file, but some page-specific selectors and assumptions also occur elsewhere. A page change can therefore require changes in multiple files.
* **Monitoring windows:** a synthetic isolated check of the original pure logic found that skipped rounds can make the timing window contain fewer relevant rounds than the streak counter reports. This can make the timing verdict inconclusive despite additional earlier eligible observations; it is not proof of a historical incident or a measure of live frequency.

The extension's manifest describes it as read-only, while its source includes write actions; this is a documentation discrepancy. The old README and protocol describe different or unimplemented designs and should not be treated as an implementation inventory. `INTRODUCTION.md` is useful context but its historical and reliability claims have not independently been verified.

The original implementation uses a third-party web interface, not an official model API. The candidate includes neither the extension nor an adapter to that interface. Its offline adaptation was written based on selected original state logic and is not a drop-in replacement. It does not claim to detect model quality, verify delivery to a service, certify proofs, or automate VWL archives. The synthetic demonstrations illustrate boundaries rather than reproducing production behavior.
