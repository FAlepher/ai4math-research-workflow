# Context and handoffs under limited usage allowances

The researcher's workflow separates maintaining continuity from doing a focused task. It is designed for sustained GPT-assisted research under limited usage allowances. Roles and handoffs are chosen flexibly; none of the paths below is required for every round.

## Continuity and active roles

* **Coordinator:** keeps a view of the research direction and current bottlenecks; context and handoff prompts help a new conversation recover that view.
* **Archaeology:** examines and reconstructs historical VWL records and develops a compressed view of the research history. Context and handoffs support continuity across its own conversations.
* **Research, integration and understanding:** active roles can be opened as needed. A clear task and selected project memory, Wealth records and directional prompts can be supplied when relevant, rather than repeatedly providing the entire archive. Integration may need proof dependencies and source material; understanding needs enough of the original result and its scope to explain it faithfully.
* **Lightweight questions:** the researcher may address these directly in Chat without initiating the full set of roles.

A clear statement does not ensure all necessary context is present. A definition may be version-specific, a Wealth result may have additional assumptions, or a known No-Go may rule out a proposed approach. When relevant information is missing, the working role can mark the gap and request it from the researcher or the appropriate role. These are methodological aims, not a claim that a software router retrieves materials automatically.

## Illustrative task packet

The following is synthetic: it demonstrates how a focused task could be framed and is not a historical research record or a mandatory template.

```text
Role: Research
Question: Is every positive integer greater than one prime?
Deliverable: Give a proof or a checked counterexample.
Definitions: A prime integer is greater than one and has exactly two positive divisors.
Relevant project records: None supplied for this example.
Known limitations: No historical archive has been checked.
If context is missing: State the missing definition, dependency or source and request it.
```

If a real task relies on project-specific notation or an earlier theorem, the packet should identify the relevant definition, source and applicable assumptions. A related failure record can also be supplied when known. Passing a reference does not certify its mathematical correctness; a proof or counterexample still needs appropriate verification.

## What is and is not established

Selective context is intended to reduce repeated loading and repeated exploration. The project currently has no controlled comparison of usage, time or research outcomes, so it makes no numerical efficiency claim. It also does not establish that every task can succeed with little context, or that role separation provides independent verification.
