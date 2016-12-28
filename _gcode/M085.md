---
tag: m085
title: Inactivity Shutdown
brief: Set the inactivity timeout.

experimental: false
group: control

codes:
  - M85

long:
  - Use this command to set a maximum period of time for the machine to be inactive (with no moves). If the machine is idle for longer than the set period, the firmware will shut everything down and halt the machine.

notes:

parameters:
  -
    tag: S
    optional: false
    description: Max inactive seconds
    values:
      -
        tag: seconds
        type: int

examples:

---
