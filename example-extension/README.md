# Offline extension example

This is a new, simplified extension example based on the original project's coordination idea. It uses fixed synthetic messages and local extension storage. It does not access external pages, connect to a model, send messages, or reproduce the original extension's full behavior.

## Try it

In a Chromium-based browser, open the extensions page, enable developer mode and use **Load unpacked** to select this `example-extension` directory. Open the extension popup, start a round, supply the two synthetic results and join them. Trying to join before both arrive reports the missing role. The **Clear example** button removes the stored sample state.

This example requests only the `storage` extension permission and declares no website host permissions. Its popup flow and reload were checked as a local page with mocked extension storage; it has not been verified as an installed extension. The state logic is covered by offline Node tests:

```sh
node --test example-extension/simulator.test.js
```

## Provenance

`original-popup.css` is copied from the private original extension without changes. `manifest.json`, `popup.html`, `sample.css`, `popup.js`, `simulator.js` and its tests were newly written for this offline example. The coordinator / branch / join design is based on the original workflow, but the example is not a drop-in replacement or a full copy. Additional original data-only function excerpts and comparisons are in `../review/`.
