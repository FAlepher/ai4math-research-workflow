# Case study: preserving research causality

## The coordination problem

When one coordinator assigns research and integration tasks in parallel, the next research decision depends on the results that actually return. If a branch is missing, or an older response is mistaken for a new one, the coordinator can receive an apparently complete but misleading picture. The research workflow therefore values provenance, explicit uncertainty and identifying the missing step in an argument.

## The engineering response

Static inspection of the private browser extension shows mechanisms designed around parts of this problem:

1. A configured route sends work to separate research and integration roles and defines a later join.
2. Route state tracks which participants are awaited and stores results for the join.
3. The state machine uses observed generation and a new assistant message as signals for recording a new round.
4. Browser storage preserves route state across service-worker restarts; failure and stop states are represented in the implementation.

These are source-level observations, not performance results. The interface is external and can change; missed or misleading observations remain possible.

## Audit findings

The checks are not a proof that incomplete results can never be forwarded. A failed result read can be represented as an empty string in one path, while the join distinguishes an absent entry from a present one. An isolated test with simulated dependencies reproduced a join after a failed read; it did not exercise a live browser. Similarly, a matching message visible in the page is not independent proof that a remote service stored the complete message. These limitations illustrate why design intent, code behavior and observed outcomes must be reported separately.

## Offline review adaptation

The original source informed a new data-only [adaptation](../review/logic.js), which is exercised by [synthetic regression tests](../review/logic.test.js):

| Finding in original source | Offline adaptation | Scope of test |
| --- | --- | --- |
| A failed branch read could be stored as an empty result and still reach a join | `prepareJoin` requires every named role to have a successful, nonempty result | Missing, failed, empty and valid inputs; no browser or actual send |
| Timing and streak calculations could use different sets of eligible rounds | `collectSilentTail` selects eligible rounds before timing is calculated | Interleaved skipped rounds, interruption, missing data and ordinary timings |
| A change in a protection signal alone did not change the snapshot signature | `snapshotSignature` includes that field | Change detection only; no stopping behavior or first-snapshot handling |

The candidate includes standalone [original data-only excerpts](../review/original-excerpts.js) and [comparison tests](../review/comparison.test.js) for the timing-window and snapshot-signature cases. The bodies were extracted from the original source with line comments removed; a small configuration and exports were added to run them independently. Tests provide only synthetic inputs. They demonstrate the differences for these fixtures, not overall equivalence or real-world accuracy.

For a concrete timing fixture, six eligible rounds are interleaved with skipped short-input rounds, with two earlier baseline rounds. The original streak counter reports six, but the original timing calculation sees too few eligible values in its raw slice and returns `unknown`. The adaptation calculates over the selected eligible streak and returns `collapsed` for that fixture. This describes the calculation, not the quality of a model or the frequency of the issue in practice.

For the snapshot fixture, the only changed field is a synthetic protection signal. The original signature stays the same; the adapted signature changes. The test does not run a service worker or demonstrate a real protective stop.

The original join path uses browser-facing dependencies and is not included here. It was examined in a separate local experiment with mocked dependencies; the candidate's tests cover the adapted join only. The adaptation is not a proven production fix and has not been integrated into or tested with the original extension.

The separate Python demo models an explicit review and confirmation boundary using synthetic data. Its confirmation is scripted; it does not authenticate a human, validate evidence, verify message delivery or replay the extension.
