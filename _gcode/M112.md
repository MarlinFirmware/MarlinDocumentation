---
tag: m112
title: Emergency Stop
brief: Shut everything down and halt the machine.

experimental: false
group: safety

codes:
  - M112

long: Used for emergency stopping, `M112` shuts down the machine, turns off all the steppers and heaters, and if possible, turns off the power supply. A reset is required to return to operational mode.

notes: '`M112` is the fastest way to shut down the machine using a host, but it may need to wait for a space to open up in the command queue. Enable `EMERGENCY_PARSER` for an instantaneous `M112` command.'

parameters:

examples:
  -
    pre: Shut down now!
    code: M112

---

