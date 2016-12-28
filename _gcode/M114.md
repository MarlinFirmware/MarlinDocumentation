---
tag: m114
title: Get Current Position
brief: Report the current tool position to the host.

experimental: false
group: hosts

codes:
  - M114

long: Get the current position of the active nozzle. Includes stepper values.

notes: Hosts should respond to the output of `M114` by updating their current position.

parameters:

examples:
  -
    pre: Get the current position
    code: M114

---

