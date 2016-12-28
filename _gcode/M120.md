---
tag: m120
title: Enable Endstops
brief: Enable endstops and keep them enabled when not homing.

experimental: false
group: control

codes:
  - M120

long: Enable endstops.

notes: After this command endstops will be kept enabled when not homing. This may have side-effects if using `ABORT_ON_ENDSTOP_HIT_FEATURE_ENABLED`.

parameters:

examples:
  -
    pre: Enable endstops
    code: M120

---

