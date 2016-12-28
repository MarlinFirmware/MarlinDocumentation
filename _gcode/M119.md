---
tag: m119
title: Endstop States
brief: Report endstop and probe states to the host.

experimental: false
group: debug

codes:
  - M119

long:
  - Use this command to get the current state of all endstops, useful for setup and troubleshooting. Endstops are reported as either "`open`" or "`TRIGGERED`".
  - The state of the Z probe is also reported.

notes:

parameters:

examples:
  -
    pre: Get all endstop states
    code: M119

---

