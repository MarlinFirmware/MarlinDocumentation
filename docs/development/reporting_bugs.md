---
title: Reporting Bugs
description: "How to report a Marlin bug so it can be fixed: what to check first, what the bug report form asks for, and what to do afterward."
parent: Development
layout: article
nav_order: 6
nav_enabled: true
nav_stroke: false
toc: true
back_to_top: true
---

# Reporting Bugs

A good bug report is the fastest way to a fix. Marlin's developers are volunteers who rarely own your printer, so
the report has to carry everything needed to *see the bug for themselves*. If they can't reproduce a bug, they
usually can't fix it.

Bug reports go to the [Marlin Issue Queue](//github.com/MarlinFirmware/Marlin/issues) on GitHub. You need a free
[GitHub account](//github.com/join) and should watch your report afterward, because questions about it will
come there.

## Is it a bug?

The Issue Queue is for faults in the firmware. These belong elsewhere:

- **Questions and help with setup.** Ask in the [Discord](//discord.com/servers/marlin-firmware-461605380783472640), a
  [Facebook group](//www.facebook.com/groups/1049718498464482/) or the
  [RepRap forum](//forums.reprap.org/list.php?415). Start with [Troubleshooting](/docs/appendix/troubleshooting.html).
- **A feature Marlin doesn't have.** See [Requesting Features](feature_request.html).
- **A configuration that won't build because of an `#error`.** The message usually says what to change. Read it
  first, and see the [obsolete options](/docs/appendix/obsolete_options.html) list if it names an old option.

If you aren't sure, ask first. A question that turns out to be a bug can be reported afterward.

## Before you report

1. **Update.** Try the latest code on the [`bugfix-2.1.x` branch](//github.com/MarlinFirmware/Marlin/archive/bugfix-2.1.x.zip). Your bug may
   be fixed already. The report form asks whether you have done this.
2. **Search the Issue Queue**, including closed issues. If someone reported the same bug, add what you know to that
   issue. If a *closed* issue looks like your problem, open a new one and link to the old one by number (for example, `#8888`), because bugs
   do come back.
3. **Narrow it down.** Does it still happen with fewer options enabled? Did it start after an update, and if so,
   does an older version work? Knowing the last version that worked is an enormous help.
4. **Make it repeatable.** Find the steps, or the G-code, that make it happen every time. If it only happens
   sometimes, say how often and under what conditions.

## What the form asks for

Use the **New Issue** button and choose **Report a bug**. The form fills in the title prefix and label for you. Answer every section.

| Section | What to write |
|---------|---------------|
| **Did you test the latest `bugfix-2.1.x` code?** | Choose *Yes*. If you chose *No*, test it now. |
| **Bug Description** | What you were trying to do and what went wrong. Clear and concise, with details. |
| **Bug Timeline** | New or old? When did it start? |
| **Expected behavior** | What you thought would happen. |
| **Actual behavior** | What happened instead. |
| **Steps to Reproduce** | Numbered steps that someone else can follow, or G-code that triggers the problem. |
| **Version of Marlin Firmware** | The text on the LCD's About menu, or the `FIRMWARE_NAME` field of the [`M115`](/docs/gcode/M115.html) reply. |
| **Printer model, Electronics, LCD/Controller, Other add-ons** | The hardware involved. Something you leave out may be the cause. |
| **Bed Leveling, Slicer, Host Software** | Choose from the lists. These are common sources of trouble, so be accurate. |
| **Configuration files** | A ZIP of your `Configuration.h` and `Configuration_adv.h`. The form makes you tick a box to say you included it. |
| **Additional information & file uploads** | Logs, screenshots, photos, video, and workarounds you found. |

Drag the ZIP file into the box to attach it.

{: .important }
Always attach your configuration files. Many bugs only appear with one combination of options, and the
developers can't build your firmware without them. If you changed pins or other files, attach those too.

### Write a good title

The title starts with `[BUG]` and then a summary. Make it specific. "Z homing ignores `Z_SAFE_HOMING` when `HOME_AFTER_DEACTIVATE` is on"
tells a developer where to look. "It doesn't work" and "Program hangs" don't.

### One bug per report

Report each problem in its own issue. A report with several bugs can't be assigned or closed until all of them are
fixed.

### Add logs where they help

- Paste text in a code block (put <code>```</code> on a line before and after it), not as a screenshot.
- For anything involving probing or leveling, turn on `DEBUG_LEVELING_FEATURE` and send the output of
  [`M111 S32`](/docs/gcode/M111.html) along with the commands that trigger the problem.
- For a printer that stops, the last lines the host received say more than a description of what you think happened.
- For motion or display problems, a short video helps.

## Reproduce it in the Simulator

If your bug is about logic rather than hardware (menus, motion limits, G-code behavior, leveling), try it in the
[Marlin Simulator](/docs/printers/simulator.html) with the same configuration. A bug that appears there can be
repeated by anyone without your printer, which gets it fixed sooner. Say in the report if you reproduced it
there, and attach the configuration you used. If it only happens on your printer, that is also useful to know,
because it points to hardware or wiring.

## After you report

- Watch the issue and answer questions promptly. A report without feedback can't be resolved and is eventually closed as stale.
- Test fixes when someone asks. A fix for your bug is a Pull Request, and you may be asked to try it. See
  [Marlin Testing](testing.html).
- Say when your problem is solved or turned out not to be a bug. That helps those who search later.
- Remember that everyone, including you, follows the project's
  [Code of Conduct](//github.com/MarlinFirmware/Marlin/blob/bugfix-2.1.x/.github/code_of_conduct.md).

If you know C++ and want to fix the bug yourself, see [Contributing Code](getting_started_pull_requests.html).

## Links

- [Issue Queue](//github.com/MarlinFirmware/Marlin/issues)
- [Report a bug](//github.com/MarlinFirmware/Marlin/issues/new?labels=Bug%3A+Potential+%3F&template=bug_report.yml&title=%5BBUG%5D+%28bug+summary%29)
- [`bugfix-2.1.x` branch](//github.com/MarlinFirmware/Marlin/tree/bugfix-2.1.x)
- [MarlinFirmware on Discord](//discord.com/servers/marlin-firmware-461605380783472640)
- [Marlin Firmware](//www.facebook.com/groups/1049718498464482/) and [Marlin Firmware for 3D Printers](//www.facebook.com/groups/3Dtechtalk/) Facebook groups
- [Marlin Forum](//forums.reprap.org/list.php?415) at RepRap.org
