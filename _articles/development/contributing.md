---
title:        'Contributing'
description:  'Quick overview how you can contribute and help the Marlin Firmware project'

category: [ development, needs-review ]
---

There are many ways that RepRap enthusiasts, owners and builders of 3D printers, and sprightly startups can contribute to Marlin.

-   **Report Issues**
    The [Marlin Issue Queue] is the place to get help and make suggestions. The only way that bugs get fixed in Marlin is if we know about them, so don't hesitate to let us know if you have any problems.
    -   ***Please follow our [Bug Reporting Guidelines] when submitting bugs.***
-   **Become a Marlin Tester**
    To get the code tested as widely as possible we rely on volunteers with a wide variety of hardware configurations to test Marlin and help us to certify it as bug-free. If you'd like to help us test the latest code, please [tell us about your machine!]
-   **Contribute Code**
    If you have reasonable skills with C++, Python, perl, or object-oriented Javascript then you have what it takes to write code for Marlin. The main codebase is written entirely in Embedded C++. Slicers and hosts that work with Marlin are typically coded in Python or perl.
-   **Write Documentation**
    This wiki is now the central location for all Marlin documentation, and we are just getting started in writing it. If every Marlin user volunteers just a few minutes each day to help with the wiki, the documentation will soon be complete.

Developer Notes
===============

Becoming a Developer
--------------------

To get involved with the latest \*\*cutting-edge development and testing on Version 1.2 and beyond\*\*, make a fork of the [Marlin Development tree] and then go to the [Marlin Development Wiki] for guidance on the new file layout, obtaining the hardware support package, and integrating Marlin with Arduino &gt;= 1.6.7.

Release versions of Marlin periodically exhibit bugs. While you can report a bug in the Issue Queue, if you have any coding skills you also have the option to contribute a patch based on your own fork. Minor releases will be made periodically integrating the best patches.

Release Candidates
------------------

Occasionally we take the development branch and create a Release Candidate for public testing on the way to a formal version release. We start tagging `RC` releases for the new version, such as “1.1.0-RC1”, “1.1.0-RC2”, and so on. Under this scheme the branch “RC” always points to the latest tagged release candidate.

The branch “RCBugFix” starts out with the latest “RC”, but any patches that pass inspection will be merged into it over time. (So "[RCBugFix]" is effectively the latest well-heeled code during a release cycle.)

Sooner or later all the patches that survive in “RCBugFix” graduate to “RC” and we tag a new release candidate. Once we have a release candidate that holds up against aggressive testing by the community we move on to a full release.

  [Marlin Issue Queue]: https://github.com/MarlinFirmware/Marlin/issues
  [Bug Reporting Guidelines]: reporting-bugs.html
  [tell us about your machine!]: https://github.com/MarlinFirmware/Marlin/issues/1209
  [Marlin Development tree]: https://github.com/MarlinFirmware/MarlinDev
  [Marlin Development Wiki]: https://github.com/MarlinFirmware/MarlinDev/wiki
  [RCBugFix]: https://github.com/MarlinFirmware/Marlin/tree/RCBugFix
