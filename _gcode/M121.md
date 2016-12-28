---
tag: m121
title: Disable Endstops
brief: Disable endstops and keep them enabled when not homing.

experimental: false
group: control

codes:
  - M121

long: Disable endstops.

notes: After this command endstops will be kept disabled when not homing. This may have side-effects if using `ABORT_ON_ENDSTOP_HIT_FEATURE_ENABLED`.

parameters:

examples:
  -
    pre: Disable endstops
    code: M121

---
