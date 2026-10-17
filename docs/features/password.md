---
title: Password
description: 'Lock the printer behind a numeric password on the LCD or over serial, what the lock blocks and what it does not, and how to recover a forgotten password.'
parent: Features
nav_order: 39
layout: article
toc: true
---

# Password

The password feature puts a numeric code between a person and the printer. Use it when the machine sits in a shared
space (a classroom, a makerspace, a shop floor) and you want to stop casual use: someone walking up and starting a
print from the SD card, or changing settings from the LCD menu. When the printer is locked, Marlin refuses every
G-code command except the unlock command, and the LCD shows a **Login Required** screen until the right code is
entered.

It is a convenience lock, not a security system. The code is a short number entered digit by digit, it is stored in
plain form in the EEPROM, and anyone who can flash new firmware to the board can remove it. Treat it like a lock on a
cupboard door.

## Requirements

- [`PASSWORD_FEATURE`](/docs/settings/security.html#PASSWORD_FEATURE) enabled in `Configuration.h`. It is disabled by
  default.
- At least one way to enter the code. The firmware refuses to compile with the error *"Without
  PASSWORD_UNLOCK_GCODE, PASSWORD_CHANGE_GCODE, or a supported LCD there's no way to unlock the printer or set a
  password."* unless you have one of:
  - a display that uses the MarlinUI menus (character LCDs, 128×64 graphical LCDs, the TFT Classic UI and
    Color UI, and DWIN screens in MarlinUI mode), with menus not disabled by [`NO_LCD_MENUS`](/docs/settings/interface.html#NO_LCD_MENUS);
  - [`PASSWORD_UNLOCK_GCODE`](/docs/settings/security.html#PASSWORD_UNLOCK_GCODE) for [`M511`](/docs/gcode/M511.html);
  - [`PASSWORD_CHANGE_GCODE`](/docs/settings/security.html#PASSWORD_CHANGE_GCODE) for [`M512`](/docs/gcode/M512.html).
- [`EEPROM_SETTINGS`](/docs/settings/eeprom.html#EEPROM_SETTINGS), so the password survives a power cycle. Without it
  the build warns *"PASSWORD_FEATURE settings will be lost on power-off without EEPROM_SETTINGS."*

The LCD password screens exist only in the MarlinUI menu system. The DWIN E3V2 and ProUI interfaces, DGUS, MKS UI
and other ExtUI-based displays have no password screen, so on those printers you lock and unlock with G-code only.

## How it works

Marlin keeps three things: whether a password is set, the password value, and whether the printer is currently
locked. The first two are saved to EEPROM with the rest of the settings. The locked state is not saved; it is set at
boot (if you enable [`PASSWORD_ON_STARTUP`](/docs/settings/security.html#PASSWORD_ON_STARTUP)), by
[`M510`](/docs/gcode/M510.html), at the end of an SD print, or by a wrong entry at any password prompt.

### What the lock blocks

While the printer is locked, Marlin checks every command before it runs. Anything other than `M511` is refused and
the printer replies:

```
echo:Printer locked! (Unlock with M511 or LCD)
```

The check applies to every source of G-code: a host on USB or Wi-Fi, commands queued by the LCD menus, and commands
read from an SD card or USB drive. So while locked:

- A host can't move axes, heat, start a print or read temperatures with `M105`. It gets the message above for each
  command.
- Starting a file from the LCD fails, because the file browser queues `M23` and `M24` for you and both are refused.
- An `auto0.g` autostart file, or anything else that queues G-code, is refused.

### What the lock does not block

- **Emergency commands.** With [`EMERGENCY_PARSER`](/docs/settings/serial.html#EMERGENCY_PARSER), `M112`, `M108`
  and `M410` are acted on as they arrive on the serial line, before the lock check.
- **LCD menu items that act directly** rather than by queuing G-code, once the lock screen has been left. Before the
  first successful unlock after power-up, the **Login Required** screen has no Cancel item and does not time out to
  the status screen. After that, a later lock screen (from `M510` or the end of an SD print) times out to the status
  screen like any other menu after [`LCD_TIMEOUT_TO_STATUS`](/docs/settings/lcd.html#LCD_TIMEOUT_TO_STATUS), and the
  menus can be opened again. Items that queue G-code still fail; items that change a value directly still work.
- **Reflashing.** Anyone who can load new firmware onto the board can turn the feature off.

### The code

The password is a number with up to [`PASSWORD_LENGTH`](/docs/settings/security.html#PASSWORD_LENGTH) digits. The
example configuration uses `4`; the setting accepts 1 to 9. On the LCD you always enter exactly that many digits, so
with a length of 4 the code `0042` and the G-code value `42` are the same password. Marlin stores and reports it as a
plain number (`Password is 42`).

## Configure

The options live in `Configuration.h` in the [Security](/docs/settings/security.html) section:

```cpp
#define PASSWORD_FEATURE
#if ENABLED(PASSWORD_FEATURE)
  #define PASSWORD_LENGTH 4                 // (#) Number of digits (1-9). 3 or 4 is recommended
  #define PASSWORD_ON_STARTUP
  #define PASSWORD_UNLOCK_GCODE             // Unlock with the M511 P<password> command. Disable to prevent brute-force attack.
  #define PASSWORD_CHANGE_GCODE             // Change the password with M512 P<old> S<new>.
  //#define PASSWORD_ON_SD_PRINT_MENU       // This does not prevent G-codes from running
  //#define PASSWORD_AFTER_SD_PRINT_END
  //#define PASSWORD_AFTER_SD_PRINT_ABORT
  //#include "Configuration_Secure.h"       // External file with PASSWORD_DEFAULT_VALUE
#endif
```

| Option | Effect |
|---|---|
| [`PASSWORD_LENGTH`](/docs/settings/security.html#PASSWORD_LENGTH) | Number of digits in the code, 1 to 9. |
| [`PASSWORD_ON_STARTUP`](/docs/settings/security.html#PASSWORD_ON_STARTUP) | Lock the printer at the end of boot. Enabled in the example configuration. |
| [`PASSWORD_UNLOCK_GCODE`](/docs/settings/security.html#PASSWORD_UNLOCK_GCODE) | Add `M511` to unlock over serial. Enabled in the example configuration. Turning it off means only the LCD can unlock. |
| [`PASSWORD_CHANGE_GCODE`](/docs/settings/security.html#PASSWORD_CHANGE_GCODE) | Add `M512` to set, change or remove the password over serial. Enabled in the example configuration. |
| [`PASSWORD_ON_SD_PRINT_MENU`](/docs/settings/security.html#PASSWORD_ON_SD_PRINT_MENU) | Ask for the password when you open the media menu on the LCD (and when [`BROWSE_MEDIA_ON_INSERT`](/docs/settings/lcd.html#BROWSE_MEDIA_ON_INSERT) opens it for you). LCD only; it does not lock the printer and does not stop a host from starting a print. |
| [`PASSWORD_AFTER_SD_PRINT_END`](/docs/settings/security.html#PASSWORD_AFTER_SD_PRINT_END) | Lock the printer when an SD print finishes. |
| [`PASSWORD_AFTER_SD_PRINT_ABORT`](/docs/settings/security.html#PASSWORD_AFTER_SD_PRINT_ABORT) | Lock the printer when an SD print is aborted. |

`PASSWORD_DEFAULT_VALUE` is not in `Configuration.h`. If you define it (the commented-out `#include` suggests a
separate `Configuration_Secure.h` you keep out of version control), a password with that value is set whenever the
settings are reset to defaults. Without it, resetting to defaults removes the password.

{: .important }
> With a MarlinUI LCD, a lock does nothing until a password is set: the lock screen is skipped and the printer stays
> unlocked. Without a MarlinUI LCD (host-only printers, DWIN, ExtUI), every lock takes effect even when no password
> is set. With `PASSWORD_ON_STARTUP` enabled such a printer boots locked every time. See
> [Pitfalls](#pitfalls).

## Set, change and remove the password

### From the LCD

Open **Advanced Settings** › **Password Settings**. If a password is already set, you must enter it first; a wrong
code sends you back to **Advanced Settings** and locks the printer (see [Pitfalls](#pitfalls)). The menu has:

- **Set/Edit Password**: opens the **Edit Password** screen. Turn the knob to pick a digit from 0 to 9 on the
  **Enter Digit** line and click to accept it. The line shows which digit you are on, and the entered digits replace
  the underscores above it. **Start Over** clears what you have entered; **Cancel** leaves without changing anything.
  After the last digit the screen shows **Password is** with the new code and **Remember to Save!**
- **Remove Password**: removes the password at once. The screen shows **Password is 0** and **Remember to Save!**
- **Store Settings** (with `EEPROM_SETTINGS`): saves to EEPROM, the same as [`M500`](/docs/gcode/M500.html).

The new password, or its removal, applies immediately but is lost at the next reset unless you save it.

### With G-code

With `PASSWORD_CHANGE_GCODE` enabled, [`M512`](/docs/gcode/M512.html) sets, changes or removes the password. When a
password is set, `P` must match it; otherwise `P` is ignored.

```gcode
M512 S1234        ; Set a password when none is set   -> "Password is 1234"
M512 P1234 S9090  ; Change it                         -> "Password is 9090"
M512 P9090        ; Remove it (no S)                  -> "Password removed"
M500              ; Save to EEPROM
```

Every `M512` ends with `Remember to save!`. A wrong `P` prints `Incorrect Password` and changes nothing. A value of
`S` with more than `PASSWORD_LENGTH` digits prints `Password too long` and changes nothing. `M512` is refused while
the printer is locked, so unlock first.

## Lock and unlock

| Action | LCD | G-code |
|---|---|---|
| Lock | Automatic, from the options above | [`M510`](/docs/gcode/M510.html) |
| Unlock | Enter the code on the **Login Required** screen | [`M511 P<code>`](/docs/gcode/M511.html) (needs `PASSWORD_UNLOCK_GCODE`) |

On the **Login Required** screen you enter the digits the same way as when setting the password. When the last digit
matches, the LCD gives its completion feedback and returns to the status screen. A wrong code gives the
error feedback, prints `Incorrect Password` on serial, and starts the entry again.

`M511` only does something while the printer is locked. A correct code unlocks the printer silently (you get `ok`);
a wrong one prints `Incorrect Password`.

## Check it works

1. Set a password and save it with `M500` (or **Store Settings**).
2. Send `M510`, or reset the printer with `PASSWORD_ON_STARTUP` enabled.
3. Send `M105`. You should get `Printer locked! (Unlock with M511 or LCD)` instead of temperatures.
4. Unlock with `M511 P<code>` or on the LCD, and send `M105` again. Temperatures come back.
5. Power-cycle and confirm that the password is still required. If it isn't, the password was not saved, or
   `EEPROM_SETTINGS` is off.

## If you forget the password

What you can do depends on whether the printer is locked right now.

**The printer is unlocked** (you got in before forgetting, or `PASSWORD_ON_STARTUP` is off): send
[`M502`](/docs/gcode/M502.html) then [`M500`](/docs/gcode/M500.html), or use **Configuration** › **Restore Defaults** and
then **Store Settings** on the LCD. This resets the password to `PASSWORD_DEFAULT_VALUE` if you defined one, or removes it. It also
resets every other setting, so record your settings with [`M503`](/docs/gcode/M503.html) first. `M512` does not help
here because it needs the old password.

**The printer is locked**: `M502`, `M512` and every other command are refused, and the LCD keeps asking for the code.
The only way back is new firmware:

1. Flash a build with `PASSWORD_FEATURE` disabled, or with
   [`EEPROM_INIT_NOW`](/docs/settings/eeprom.html#EEPROM_INIT_NOW) enabled so the stored settings are discarded on
   first boot.
2. Send `M502` and `M500` to write clean settings to EEPROM.
3. Flash your normal build again, then set a new password.

You lose all saved settings, not only the password. Keeping your configuration and an `M503` dump up to date makes
this a short job.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Host shows `Printer locked! (Unlock with M511 or LCD)` for every command | The printer is locked | Unlock on the LCD or with `M511 P<code>`. |
| `M511` replies `Unknown command` | `PASSWORD_UNLOCK_GCODE` is disabled | Unlock on the LCD, or enable the option and reflash. |
| `M512` replies `Printer locked!` | `M512` is blocked while locked | Unlock first. |
| `M512` replies `Incorrect Password` | `P` doesn't match the current password | Send the current password with `P`. |
| `M512` replies `Password too long` | `S` has more digits than `PASSWORD_LENGTH` | Use a shorter code. |
| Password is gone after a power cycle | It was never saved, or `EEPROM_SETTINGS` is off | Save with `M500` or **Store Settings**; enable `EEPROM_SETTINGS`. |
| Printer locks itself while you are in the menus | A wrong code at **Password Settings** or the media menu prompt locks the printer | Enter the correct code at any prompt, or send `M511`. |
| Host-only printer boots locked although no password is set | Without a MarlinUI LCD the startup lock always applies | Unlock with `M511 P<code>` (see [Pitfalls](#pitfalls)), or disable `PASSWORD_ON_STARTUP`. |
| Printer can't be unlocked at all | No MarlinUI LCD and `PASSWORD_UNLOCK_GCODE` disabled, or forgotten password | Reflash, as in [If you forget the password](#if-you-forget-the-password). |
| Media menu asks for a password but a host still prints | `PASSWORD_ON_SD_PRINT_MENU` only guards the LCD menu | Lock the printer with `M510` or the startup / end-of-print options. |

## Pitfalls

- **The host still has control unless the printer is locked.** `PASSWORD_ON_SD_PRINT_MENU` asks for the code on the
  LCD only. A host can start, stop and control prints until the printer is actually locked.
- **Host-only and non-MarlinUI printers lock even with no password set.** On these builds the lock does not check
  whether a password exists, and `M512` can't run while locked. With the example configuration
  (`PASSWORD_ON_STARTUP` on) the printer boots locked. Unlock with `M511 P` and the last password that was set, or
  `M511 P0` if no password has ever been set and saved. Removing a password does not reset the stored number, so
  after a removal the old number still unlocks.
- **No MarlinUI LCD and no `M511` means no way out.** The build allows `PASSWORD_FEATURE` with only
  `PASSWORD_CHANGE_GCODE` on a printer without a MarlinUI LCD. Any lock on such a printer (`M510`, startup, end of
  print) can only be cleared by reflashing. Keep `PASSWORD_UNLOCK_GCODE` enabled unless you have a MarlinUI LCD.
- **A wrong code at any prompt locks the printer.** This includes the **Password Settings** prompt and the
  `PASSWORD_ON_SD_PRINT_MENU` prompt, not only the lock screen. The menu you land on still works, but G-code is
  refused until a correct code is entered.
- **The end-of-print lock blocks the end-of-print commands.** With `PASSWORD_AFTER_SD_PRINT_END`, Marlin locks the
  printer right after queuing its internal end-of-print command, which is then refused. The same applies to
  [`EVENT_GCODE_SD_ABORT`](/docs/settings/lcd.html#EVENT_GCODE_SD_ABORT) with `PASSWORD_AFTER_SD_PRINT_ABORT`. This
  only happens when a password is set (with a MarlinUI LCD) or always (without one). Put cool-down and park moves at
  the end of the G-code file itself rather than in
  [`SD_FINISHED_RELEASECOMMAND`](/docs/settings/lcd.html#SD_FINISHED_RELEASECOMMAND), and check the result on your
  machine.
- **`EEPROM_SETTINGS` off.** The password lives only in RAM. Each reset brings back `PASSWORD_DEFAULT_VALUE`, or no
  password at all.
- **`M502` clears the password.** Restoring defaults for any other reason also removes the password (or restores
  `PASSWORD_DEFAULT_VALUE`). Set it again before the next `M500` if you want to keep it.
- **Locking during a print ruins it.** `M510` sent while a file is printing makes Marlin refuse every following line
  of the file, as well as every host command. Lock between prints.
- **Brute force.** A 4-digit code has 10,000 values, and `M511` has no delay between attempts. A host script can try
  them all. Disable `PASSWORD_UNLOCK_GCODE` if that matters and you have a MarlinUI LCD.
