# AI4Math Research Workflow

**Human-directed mathematical research with AI-assisted exploration, review and long-term memory.**

Mathematical research can outlast an AI conversation. For example, a researcher using GPT with limited usage allowances may need to carry research direction, evidence and past failures across conversations. This project documents a flexible workflow developed around that challenge.

The researcher has used a private browser extension to coordinate multiple AI conversations. This repository presents the research method, selected data-only excerpts from that extension, and offline audit examples. The full extension and private research archives are not included.

## Start here

**New to AI4Math?** Start with [the research method](docs/methodology.md), then see how [context and handoffs](docs/context-and-handoffs.md) support work across conversations. A [synthetic VWL record](examples/vwl-record.md) illustrates how a failed claim can be preserved.

**Reviewing the engineering?** Read the [coordination case study](docs/case-study.md), inspect the [original data-only excerpts](review/original-excerpts.js) and [offline adaptation](review/logic.js), or try the [offline example extension](example-extension/README.md).

## How the research is organized

The human researcher chooses the problem, direction and significance of results. A coordinator maintains the global view; research and integration roles explore and reconstruct proof chains. An understanding role explains forwarded outputs to the human, while a distinct archaeology role reconstructs VWL records and a compressed research history. Roles and handoffs are selected flexibly rather than following a fixed pipeline.

VWL has two complementary dimensions: chronological research freezes preserve what was known at a given time; the functional **View**, **Wealth** and **Law / No-Go** collections organize perspectives, qualified positive results and failed paths. A record or passing computation does not itself establish a mathematical proof.

## Run the examples

The offline example extension uses synthetic messages and local storage to illustrate a coordinator and two branches. It does not connect to a model or website. See its [instructions and provenance](example-extension/README.md); it is a new, simplified example, not the original extension. The original popup stylesheet is reused, while the example's state and interface code were newly written.

The JavaScript review also checks three data-only boundaries: required results before a join, consistent selection of rounds for timing, and detection of a changed protection signal. The comparison tests use original function excerpts and an adaptation written during this review.

```sh
node --test review/logic.test.js review/comparison.test.js example-extension/simulator.test.js
```

Node.js 18 or later is required. The separate Python example illustrates task states and VWL records:

```sh
python demo.py
python -m unittest discover -s tests -v
```

Python 3.11 or later is recommended. Neither example needs third-party dependencies or an API key. All test data and research examples are synthetic.

## Evidence and limits

- The JavaScript adaptation is not integrated into the original extension or tested with live browser sessions. The original join failure was checked locally with mocked dependencies; this repository tests the adapted join, not the original browser-facing path.
- The example extension is a new local simulation; its Node tests do not validate real model connections, external-page behavior or the original extension.
- The Python confirmation is scripted: it does not authenticate a human or validate evidence. Neither example certifies mathematical results or model quality.
- Private research archives remain unpublished. Two sample documents were inspected for structure, not for independent verification of their underlying proofs. No measured claim of efficiency gains or extension reliability is made.

## Files

```text
docs/       Research method, context design and engineering case study
examples/   Synthetic task handoff and VWL record
review/     Data-only source excerpts, adaptation and tests
example-extension/   Offline synthetic coordination example
workflow.py, demo.py, tests/   Synthetic Python workflow and tests
```

## Author and license

Maintained by [FAlepher](https://github.com/FAlepher). The researcher led the original extension's design, with AI assistance in coding and debugging. The offline adaptation, tests and documentation were prepared with AI assistance during this review.

All files in this repository, including the source excerpts in `review/original-excerpts.js`, are licensed under the [MIT License](LICENSE). The unpublished remainder of the original extension and private research archives are not distributed here.
