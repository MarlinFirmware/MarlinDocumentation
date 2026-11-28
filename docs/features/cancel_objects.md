---
title: Cancel Objects
description: 'Skip individual objects in a multi-object print with M486: enable CANCEL_OBJECTS, label objects in your slicer, cancel from G-code or the LCD, and check that it worked.'
parent: Features
nav_order: 43
layout: article
toc: true
---

# Cancel Objects

A multi-object print can go wrong on one part. A warped piece, a failed support, or a stringy corner may
make one object worth abandoning while the rest of the plate is still good. Cancel Objects lets Marlin skip
that object for the rest of the job: the printer keeps moving on to the others, but it stops extruding and
stops travelling on the skipped object's moves. You do not have to stop the print.

This works best when your slicer marks where each object starts in the G-code. Marlin only knows about
objects that the G-code tells it about, using [`M486`](/docs/gcode/M486.html).

## Requirements

- The firmware must be built with `CANCEL_OBJECTS`. It is off by default. The option is in the `extras`
  section of [Configuration_adv.h](/docs/settings/extras.html#CANCEL_OBJECTS).
- Object markers in the G-code. Recent slicers can emit them, or you can convert the slicer's own comments to
  `M486` with a post-processing script (see the [`M486` page](/docs/gcode/M486.html) for examples).
- Up to 32 objects, numbered 0 to 31. Marlin keeps the cancel state as a 32-bit mask. An object numbered 32 or
  higher is never skipped.
- Optional: `CANCEL_OBJECTS_REPORTING` (on automatically with `CANCEL_OBJECTS`) shows the object being printed
  on the LCD status line, `Print Obj <n>`, on displays that have a status message.

## How it works

The firmware keeps three things: the number of objects, the index of the object it is printing now (the
*active* object), and a mask of which objects have been canceled. Each `M486` parameter changes one of them.

1. **Count the objects.** `M486 T<count>` sets the object count and clears the cancel list. If you leave it out,
   the count grows as the file starts each object.
2. **Mark where each object starts.** `M486 S<n>` makes object `n` the active object. Every move after that
   belongs to object `n`, until the next `S`. If object `n` was already canceled, the firmware starts skipping at
   once.
3. **Cancel.** `M486 P<n>` cancels object `n`. If `n` is the active object, skipping starts immediately. `M486 C`
   cancels whatever object is active now.
4. **Skip.** While the active object is canceled, Marlin changes its moves as follows:
   - Axis words (X, Y, Z, and the others in the move) keep the current position as the destination. The
     skipped move does not travel.
   - Extrusion (E) is dropped from the planned move.
   - Other commands still run. Temperature (`M104`, `M109`), fan (`M106`) and similar commands are not affected.
5. **Print non-objects.** `M486 S-1` marks the start of something that is not an object, such as a brim or a purge
   tower. Nothing is skipped in that section.
6. **Restore.** `M486 U<n>` removes object `n` from the canceled list. It only restores printing for moves that
   have not happened yet. Moves that were skipped stay skipped.

`M486` sends no reply, so check the result on the LCD or in the status line, as described below.

### Starting and resuming a job

The cancel list is cleared when a new job starts, not when a job stops. If a job is interrupted and resumed
with [Power-Loss Recovery](/docs/features/power_loss_recovery.html), the cancel state saved with the recovery
data is restored, so objects you canceled before the outage stay canceled. The active object is set again
from the saved state, and the status line shows it.

## Configure

Add these to `Configuration_adv.h` and build:

```cpp
#define CANCEL_OBJECTS
#define CANCEL_OBJECTS_REPORTING   // Show "Print Obj <n>" on the status line (optional)
```

`CANCEL_OBJECTS_REPORTING` is set up inside the `CANCEL_OBJECTS` block, so it comes on with the feature. To turn it
off, comment out that line.

The LCD gets a **Cancel Obj** entry in the menu that opens while a job is printing. It lists the objects that have
not been canceled, and asks for confirmation before canceling one. This entry needs an LCD with a menu. It is not
shown when `SLIM_LCD_MENUS` is enabled.

## Verify

Test on a plate with two small objects before you rely on it. The `M486` lines below are the minimum a test file
needs. Your slicer will write more.

```gcode
M486 T2        ; two objects
M486 S0        ; object 0 starts
...            ; moves for object 0
M486 S1        ; object 1 starts
...            ; moves for object 1
```

To check:

1. Start the test file and watch the status line. It should show `Print Obj 0`, then `Print Obj 1`. If it does not,
   see the table below.
2. Send `M486 P0` while object 0 is printing. Marlin should stop extruding for object 0 and move on to object 1.
3. Open the Tune menu during the print and check that **Cancel Obj** lists only the objects you have not canceled.

## If something is wrong

| Symptom | Likely cause | Fix |
|---|---|---|
| `M486` does nothing, and no status line appears | `CANCEL_OBJECTS` is not in the build, or the firmware was not reflashed | Enable `CANCEL_OBJECTS` in `Configuration_adv.h`, rebuild and flash |
| No `Print Obj` on the status line | `CANCEL_OBJECTS_REPORTING` is off, or the display has no status message | Enable reporting; a display without a status line will not show it |
| No **Cancel Obj** item in the Tune menu | `SLIM_LCD_MENUS` is on, the display has no menu, or no job is running | Disable `SLIM_LCD_MENUS`; the item only shows while printing |
| An object prints even after `M486 P<n>` | The object number is 32 or higher, so it can never be skipped | Use numbers 0 to 31 |
| An object you canceled still prints after `U` | `U` only restores moves that have not happened yet | Restart the job, or re-slice the object |
| A brim or purge tower is skipped | It has no `S-1` marker, so it belongs to an object that was canceled | Add `M486 S-1` before its moves |
| Objects print that should be skipped | The `P` numbers do not match the `S` markers, or a later `T` line cleared the cancel list | Check the start markers in the G-code and the order of `T` and `P` lines |

## Pitfalls

- **Marlin does not undo what has already printed.** An object canceled after it started stays partly printed on the
  bed, and may need to be removed by hand.
- **The list is per job.** Starting a new job clears the canceled objects, so a cancel made for one file does not
  carry over to the next one.
- **Host printing works too**, though a host can usually skip objects itself, more efficiently. The
  [`M486` page](/docs/gcode/M486.html) has the details of the command.

## See also

- [`M486`: Cancel Objects](/docs/gcode/M486.html): the full parameter list.
- [Media Printing](/docs/features/media_printing.html) and [Power-Loss Recovery](/docs/features/power_loss_recovery.html):
  the two ways a print usually runs when objects are canceled.
- [Settings: Extras](/docs/settings/extras.html#CANCEL_OBJECTS): `CANCEL_OBJECTS` and `CANCEL_OBJECTS_REPORTING`.
