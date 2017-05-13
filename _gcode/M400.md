---
tag: m400
title: Finish Moves
brief: Wait for all moves to finish

experimental: false
group: planner

codes:
  - M400

long: This command causes all GCode processing to pause and wait in a loop until all moves in the planner are completed.

notes:

parameters:

example:
  -
    pre: Wait for moves to finish before turning off the spindle
    code:
      - M400
      - M5    ; Without M400 this happens too soon

---

