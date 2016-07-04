---
title:        'Reporting Bugs'
description:  'Detailed guide about bugs and how to report them'

category: [ getting-started, development, needs-review ]
---

Please submit bug reports to the [Marlin Issue Queue] so that we can try to resolve it. Use the [New Issue] button and follow the guidelines below. Before submitting an issue, please *search first to make sure the issue is new*. You can always add comments to an existing issue, even if it is closed, then we can re-open and continue to explore it.

## Bug Reporting Guidelines

Based on Mozilla and Simon Tatham bug writing guidelines, a good bug report always...

### Is reproducible

If the developers cannot reproduce the bug or conclusively prove that it exists, they probably will not be able to fix it, and move on to the next bug.

 -   Provide step-by-step instructions for reproducing the bug for a quicker resolution.
 -   Attached or linked videos and screenshots are welcome.

### Is specific

Try and figure out exactly what causes the problem.
 -   Don't report more than one issue in the same report. You should report each issue in a different bug report.

### Describes your environment

Include information about:

  - The Marlin version (please test [the Development branch] before submitting reports)
  - Machine model and manufacturer
  - Electronics board
  - Machine components (Hotends, thermistors, thermocouples, relays, etc.)
  - Host software (if any)
  - Slicer (if relevant)
  - Printing method (SD or host)
  - `Configuration.h` and `Configuration_adv.h` files (if requested)

### Provides a good summary

You should be as precise and clear as possible when you give a summary (Title) to the bug report. Summaries like “Program hangs” or “It doesn't work” are examples of bad titles because they don't provide any indication of where or how Marlin fails.

### Includes all the bug description fields

It helps a lot when managing the bug reports that users include:

  1.  Configuration details, as above
  2.  Expected behavior
  3.  Observed behavior
  4.  Steps to reproduce
  5.  Attempted resolution (if any)
  6.  Steps to work around (if any)

### Is not anonymous

You will need to create a free Github account to report bugs. Please pay attention to the bugs you report ad follow up on your initial report. If we can't get feedback then we may not be able to resolve the problem.

## Before Submitting a Bug

In addition to following the guidelines above, we ask that you follow a thorough process of troubleshooting and research before submitting your issue.

-   Use a process of elimination to narrow down the root cause as far as possible.
-   Try changing settings related to the issue to see how they affect behavior.
-   Search the [RepRap forums] for others who may have similar issues.

  [Marlin Issue Queue]: https://github.com/MarlinFirmware/Marlin/issues
  [New Issue]: https://github.com/MarlinFirmware/Marlin/issues/new
  [the Development branch]: https://github.com/MarlinFirmware/Marlin/tree/RCBugFix
  [RepRap forums]: http://forums.reprap.org/
