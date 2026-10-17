---
title: Host Interface
description: "Connecting a host such as OctoPrint or Pronterface to Marlin: serial ports, baud rate, the ok/resend protocol, buffers, capabilities, auto-reports and prompts."
parent: Features
nav_order: 32
layout: article
toc: true
---

# Host Interface

A host is any program that talks to the printer over a serial link: OctoPrint on a Raspberry Pi, Pronterface or
Repetier-Host on a desktop, the printer panel built into a slicer, or a serial touch screen that runs its own
host software. The host streams G-code one line at a time, shows temperatures and position, and offers buttons for
pause, resume and cancel. This page explains how that conversation works, which options make it fast and reliable,
which options let a host do more than stream lines, and how to fix the connection when it misbehaves.

For a list of host programs, see [Host Software](/docs/basics/#host-software) in the Introduction.

## What you need

- A serial connection between the host and the board: the board's USB socket, or a UART on the board wired to a
  Wi-Fi module, a single-board computer or a touch screen.
- [`SERIAL_PORT`](/docs/settings/serial.html#SERIAL_PORT) (and optionally
  [`SERIAL_PORT_2`](/docs/settings/serial.html#SERIAL_PORT_2) / [`SERIAL_PORT_3`](/docs/settings/serial.html#SERIAL_PORT_3))
  set to the port the host is plugged into.
- The host set to the same speed as [`BAUDRATE`](/docs/settings/serial.html#BAUDRATE).

Everything else on this page is optional. The defaults in `Configuration.h` and `Configuration_adv.h` already
enable the keepalive, temperature auto-reporting, the capability report and host action commands with prompts.

## How host communication works

### One line, one "ok"

Marlin reads characters from every configured serial port until it sees the end of a line, then puts the line in
its command queue. When it has finished with a command, it sends `ok` back to the port the command came from. The
`ok` tells the host there is room for another line. A simple host sends one line, waits for `ok`, then sends the
next.

Not every command answers with a bare `ok`. [`M105`](/docs/gcode/M105.html), for example, replies with the
temperatures on the same line: `ok T:210.00 /210.00 B:60.00 /60.00 @:64 B@:0`.

### Line numbers and checksums

Bytes can be lost or damaged on the way, especially on long or noisy cables. To catch this, a host can number each
line and add a checksum:

```gcode
N42 G1 X10 Y20*28
```

`N42` is the line number. `*28` is the checksum: every character before the `*` combined with exclusive-or (XOR).
When a line starts with `N`, Marlin checks that:

- the number is exactly one more than the last good line,
- a `*` checksum is present,
- the checksum matches.

If any check fails, Marlin throws away whatever is waiting in the receive buffer, reports the problem with an
`Error:` line, and asks for the next line it expected:

```
Error:checksum mismatch, Last Line: 41
Resend: 42
ok
```

The host then sends line 42 again and continues from there. The other two error texts are
`Error:Line Number is not Last Line Number+1, Last Line: 41` (a line went missing) and
`Error:No Checksum with line number, Last Line: 41`. A line that repeats the last or the previous number is
ignored silently, since that happens when a resend request crosses a line already in flight.

A host resets the counter with [`M110 N<number>`](/docs/gcode/M110.html). Lines without `N` are accepted
without any check, which is what you type in a terminal. The exception is while Marlin writes a file to the SD
card with [`M28`](/docs/gcode/M028.html): then every line except `M29` must carry a number and checksum.

![A host and Marlin exchanging lines: a command, a busy message, an ok, a damaged line answered by Error, Resend and ok, the same line resent, and a host prompt answered with M876](/assets/images/features/host-protocol.svg){: .framed }

### Busy messages while a command runs

A command such as [`G28`](/docs/gcode/G028.html), [`G29`](/docs/gcode/G029.html) or
[`M109`](/docs/gcode/M109.html) can take minutes, and the `ok` only comes at the end. So that the host does not
decide the printer has stopped responding, [`HOST_KEEPALIVE_FEATURE`](/docs/settings/host.html#HOST_KEEPALIVE_FEATURE)
(on by default) makes Marlin send a status line every
[`DEFAULT_KEEPALIVE_INTERVAL`](/docs/settings/host.html#DEFAULT_KEEPALIVE_INTERVAL) seconds (default `2`) while it
cannot accept commands:

| Message | Meaning |
|---|---|
| `echo:busy: processing` | A command is still running. |
| `echo:busy: paused for user` | Marlin is waiting for a click, a host button or `M108` (a filament change, for example). |

[`M113 S<seconds>`](/docs/gcode/M113.html) changes the interval at runtime (0 to 60; `M113 S0` turns the
messages off). While Marlin waits for a heater in `M109`, `M190` and similar commands, it prints the temperature
once a second anyway. [`BUSY_WHILE_HEATING`](/docs/settings/host.html#BUSY_WHILE_HEATING) (on by default) also
sends busy messages during that wait, for hosts that expect them; with it disabled, only the temperature lines
are sent while heating.

### Message prefixes

Lines Marlin sends that are not `ok` start with a prefix that tells the host how to treat them:

- `echo:` for information: settings reports, `busy:` messages, `echo:Unknown command: "M155 S2"`.
- `Error:` for problems: line errors, thermal faults, `Error:Printer halted. kill() called!`.
- `//action:` for host action commands (see [below](#host-action-commands)).
- Reports that hosts parse by their shape: `ok T:...` temperatures, `X:... Y:... Z:... E:...` positions,
  `SD printing byte 1234/56789`.

After a halt (`Error:Printer halted. kill() called!`), Marlin waits for the reset button or a power cycle; after a
stop (`Printer stopped due to errors. Fix the error and use M999 to restart.`), [`M999`](/docs/gcode/M999.html)
resumes.

## Serial ports and baud rate

### Choosing the port

[`SERIAL_PORT`](/docs/settings/serial.html#SERIAL_PORT) (default `0`) selects the port for the host. `0` and up
are the board's hardware UARTs; `-1` is the native USB port on boards whose MCU has one, where the USB socket is
connected straight to the processor instead of through a USB-to-serial chip. A board without native USB fails to
build with `-1` ("SERIAL_PORT is set to -1, but the MOTHERBOARD has no native USB support"). The first port,
`-1` or `0`, is also the one the Arduino bootloader uses.

[`SERIAL_PORT_2`](/docs/settings/serial.html#SERIAL_PORT_2) and
[`SERIAL_PORT_3`](/docs/settings/serial.html#SERIAL_PORT_3) add more host ports, for example USB for a laptop
and a UART for a Wi-Fi module or a touch screen. Every port gets the full G-code interface. The ports must all be
different, and `SERIAL_PORT_3` needs `SERIAL_PORT_2`. On Teensy 4.1, `SERIAL_PORT_2 -2` is the Ethernet port.

Displays that speak their own protocol (DGUS, Anycubic, Malyan and similar) use `LCD_SERIAL_PORT` instead; that
port is not a host port and cannot be the same as `SERIAL_PORT` or `SERIAL_PORT_2`.

### Choosing the baud rate

[`BAUDRATE`](/docs/settings/serial.html#BAUDRATE) (default `250000`) is the speed for every port.
[`BAUDRATE_2`](/docs/settings/serial.html#BAUDRATE_2) and [`BAUDRATE_3`](/docs/settings/serial.html#BAUDRATE_3)
override it for the extra ports. The allowed values are 2400, 9600, 19200, 38400, 57600, 115200, 250000, 500000
and 1000000. The host must be set to the same value; a mismatch shows up as garbage characters or no response.

| Choice | When it fits | Trade-off |
|---|---|---|
| `250000` | Most USB connections. | The default. Some host computers or adapters do not offer it in their list. |
| `115200` | Wi-Fi modules, long UART wiring, hosts that cannot do 250000, or dropouts at 250000. | Fewer lines per second, which can starve the planner on detailed models. |
| `500000` / `1000000` | Faster uploads to the SD card over serial. | Needs a short, clean connection; errors cost more time in resends than they save. |

[`BAUD_RATE_GCODE`](/docs/settings/serial.html#BAUD_RATE_GCODE) adds [`M575`](/docs/gcode/M575.html) to change
the speed without rebuilding: `M575 B115200` (all ports) or `M575 P1 B115200` (the second port, counting from 0).
The new speed applies at once, so reconnect the host at the new rate. It is not saved and the next reset returns to
`BAUDRATE`.

## Buffers

Two buffers sit between the wire and the motion planner. The receive buffer holds raw characters as they arrive;
the command queue holds complete lines waiting to run. When the queue is full, Marlin stops reading the port and
characters pile up in the receive buffer.

| Option | Default | What it does | Raise it when | Cost |
|---|---|---|---|---|
| [`BUFSIZE`](/docs/settings/serial.html#BUFSIZE) | `4` | Number of complete lines the command queue holds. | The host can send ahead (`ADVANCED_OK`) and the print stutters on fine curves. | `MAX_CMD_SIZE` bytes of RAM per line. |
| [`MAX_CMD_SIZE`](/docs/settings/serial.html#MAX_CMD_SIZE) | `96` | Longest line Marlin accepts, in characters. | You send long `M117`/`M118` texts or long file names. | Used for every queue slot and for each port's line buffer. |
| [`RX_BUFFER_SIZE`](/docs/settings/serial.html#RX_BUFFER_SIZE) | `128` when not set | Raw receive buffer per hardware UART. | You use `SERIAL_XON_XOFF`, or `RX_BUFFER_MONITOR` reports overflows. | RAM; must be a power of 2. |
| [`TX_BUFFER_SIZE`](/docs/settings/serial.html#TX_BUFFER_SIZE) | `0` | Transmit buffer. At `0`, Marlin waits while each character goes out. | Long reports slow the printer down. The config comment suggests 32 bytes for `ADVANCED_OK` replies. | Flash and RAM; 0 or a power of 2 up to 256. |
| [`SERIAL_XON_XOFF`](/docs/settings/serial.html#SERIAL_XON_XOFF) | off | Marlin sends XOFF when the receive buffer is filling, XON when it drains. | Streaming files to SD at high speed. | Needs `RX_BUFFER_SIZE` of at least 1024, and a host that honors XON/XOFF. |

Bigger buffers only help when the host keeps them full. A host that waits for each `ok` before sending the next
line never has more than one line in flight, whatever `BUFSIZE` is. On 8-bit boards RAM is the limit; 32-bit
boards usually have room for a larger queue. `RX_BUFFER_SIZE`, `TX_BUFFER_SIZE` and `SERIAL_XON_XOFF` do
not apply to AVR boards with native USB (AT90USB).

### Telling the host how full the queue is

With [`ADVANCED_OK`](/docs/settings/serial.html#ADVANCED_OK), every `ok` carries the line number it answers and
the free space in the planner and the command queue:

```
ok N42 P15 B3
```

`P` is free planner slots, `B` is free command queue slots. A host that reads these can safely send several lines
ahead instead of waiting for each `ok`, which keeps the planner fed on detailed models. Check that your host
supports it before enabling it.

## Capability report (M115)

When a host connects, it usually sends [`M115`](/docs/gcode/M115.html) to learn what it is talking to. The first
line identifies the firmware:

```
FIRMWARE_NAME:Marlin bugfix-2.1.x (Oct 17 2026 12:00:00) SOURCE_CODE_URL:github.com/MarlinFirmware/Marlin PROTOCOL_VERSION:1.0 MACHINE_TYPE:3D Printer KINEMATICS:Cartesian EXTRUDER_COUNT:1 UUID:...
```

With [`EXTENDED_CAPABILITIES_REPORT`](/docs/settings/reporting.html#EXTENDED_CAPABILITIES_REPORT) (on by
default), a list of `Cap:NAME:1` or `Cap:NAME:0` lines follows. A host should treat a capability that is missing
as not present, so turning this report off makes a host assume the least. The ones hosts act on most:

| Capability | Turned on by |
|---|---|
| `Cap:AUTOREPORT_TEMP` | [`AUTO_REPORT_TEMPERATURES`](/docs/settings/reporting.html#AUTO_REPORT_TEMPERATURES) |
| `Cap:AUTOREPORT_POS` | [`AUTO_REPORT_POSITION`](/docs/settings/reporting.html#AUTO_REPORT_POSITION) |
| `Cap:AUTOREPORT_SD_STATUS` | [`AUTO_REPORT_SD_STATUS`](/docs/settings/lcd.html#AUTO_REPORT_SD_STATUS) |
| `Cap:EMERGENCY_PARSER` | [`EMERGENCY_PARSER`](/docs/settings/serial.html#EMERGENCY_PARSER) |
| `Cap:HOST_ACTION_COMMANDS` | [`HOST_ACTION_COMMANDS`](/docs/settings/host.html#HOST_ACTION_COMMANDS) |
| `Cap:PROMPT_SUPPORT` | [`HOST_PROMPT_SUPPORT`](/docs/settings/host.html#HOST_PROMPT_SUPPORT) |
| `Cap:BUILD_PERCENT` | [`SET_PROGRESS_PERCENT`](/docs/settings/lcd.html#SET_PROGRESS_PERCENT) |
| `Cap:SERIAL_XON_XOFF` | [`SERIAL_XON_XOFF`](/docs/settings/serial.html#SERIAL_XON_XOFF) |
| `Cap:BINARY_FILE_TRANSFER` | [`BINARY_FILE_TRANSFER`](/docs/settings/lcd.html#BINARY_FILE_TRANSFER) |
| `Cap:MEATPACK` | `MEATPACK_ON_SERIAL_PORT_n` for the port that asked |
| `Cap:SDCARD`, `Cap:SD_WRITE` | SD or USB media support (`SD_WRITE` is 0 with `SDCARD_READONLY`) |
| `Cap:EEPROM` | `EEPROM_SETTINGS` |
| `Cap:AUTOLEVEL`, `Cap:Z_PROBE`, `Cap:LEVELING_DATA` | A leveling system and a bed probe |
| `Cap:RUNOUT` | A filament runout sensor |
| `Cap:SOFTWARE_POWER` | [`PSU_CONTROL`](/docs/features/psu_control.html) |
| `Cap:TOGGLE_LIGHTS` | `CASE_LIGHT_ENABLE` |
| `Cap:ARCS` | `ARC_SUPPORT` |
| `Cap:THERMAL_PROTECTION` | All hotend, bed and chamber thermal protection options enabled |

`M115` also reports `Cap:PRINT_JOB`, `Cap:LONG_FILENAME`, `Cap:EXTENDED_M20`, `Cap:BABYSTEPPING` and others;
the [`M115`](/docs/gcode/M115.html) page lists them. Turning off
[`CAPABILITIES_REPORT`](/docs/settings/reporting.html#CAPABILITIES_REPORT) removes `M115` entirely to save about
1150 bytes of flash. Some hosts and serial touch screens rely on it, so leave it on unless you are out of space.

## Auto-reporting

A host that wants to show live temperatures can poll with `M105` every few seconds. Each poll is a command that
waits its turn in the queue and costs a line of bandwidth in both directions, and during a long command the
answer comes late. Auto-reporting turns this around: the host asks once, and Marlin sends the report on a timer
from its idle loop, even while a long command is running.

| Report | Option | Start it with | Default |
|---|---|---|---|
| Temperatures | [`AUTO_REPORT_TEMPERATURES`](/docs/settings/reporting.html#AUTO_REPORT_TEMPERATURES) (on) | [`M155 S<seconds>`](/docs/gcode/M155.html) | on, interval 0 |
| Position | [`AUTO_REPORT_POSITION`](/docs/settings/reporting.html#AUTO_REPORT_POSITION) (off) | [`M154 S<seconds>`](/docs/gcode/M154.html) | off |
| SD print progress | [`AUTO_REPORT_SD_STATUS`](/docs/settings/lcd.html#AUTO_REPORT_SD_STATUS) (off) | [`M27 S<seconds>`](/docs/gcode/M027.html) | off |

The interval is in seconds, up to 60; `S0` stops the report. Every interval starts at 0 after a reset, so nothing
is sent until the host asks. A host can only know it may ask from the `Cap:AUTOREPORT_*` lines in `M115`. Reports
go to all host ports. With [`SERIAL_OVERRUN_PROTECTION`](/docs/settings/serial.html#SERIAL_OVERRUN_PROTECTION)
(on by default), reports and busy messages hold off for a moment while Marlin prints long multi-line output.

[`AUTO_REPORT_REAL_POSITION`](/docs/settings/reporting.html#AUTO_REPORT_REAL_POSITION) makes `M154` report the
position the steppers are actually at rather than the position of the last command.

## Host action commands

With [`HOST_ACTION_COMMANDS`](/docs/settings/host.html#HOST_ACTION_COMMANDS) (on by default), Marlin tells the host
about events it should act on. Each is a line starting with `//action:`, sent to every host port:

| Line | Sent when |
|---|---|
| `//action:pause` | An SD print pauses with [`M25`](/docs/gcode/M025.html); the display's Pause item is used on a printer with no media and no `PARK_HEAD_ON_PAUSE`; or a filament runout needs the host to pause its stream. |
| `//action:paused` | Marlin parks for [`M600`](/docs/gcode/M600.html) or [`M125`](/docs/gcode/M125.html), including a change started by a runout sensor. |
| `//action:resume` | An SD print resumes with [`M24`](/docs/gcode/M024.html), or the display's Resume item is used. |
| `//action:resumed` | Marlin returns from an `M600` or `M125` park. |
| `//action:cancel` | The display's Stop/Abort item is used. |
| `//action:start` | The `HOST_START_MENU_ITEM` display item is used. |
| `//action:shutdown` | The `HOST_SHUTDOWN_MENU_ITEM` display item is used. |
| `//action:poweroff` | Marlin halts (kill), right after `Error:Printer halted. kill() called!`. |
| `//action:probe_rewipe` / `//action:probe_failed` | `G29_RETRY_AND_RECOVER` is retrying or has given up. |

The display menu items are [`HOST_START_MENU_ITEM`](/docs/settings/host.html#HOST_START_MENU_ITEM) and
[`HOST_SHUTDOWN_MENU_ITEM`](/docs/settings/host.html#HOST_SHUTDOWN_MENU_ITEM).
[`HOST_PAUSE_M76`](/docs/settings/host.html#HOST_PAUSE_M76) also sends `//action:pause` when
[`M76`](/docs/gcode/M076.html) pauses the print timer.

The texts come from `ACTION_ON_PAUSE`, `ACTION_ON_PAUSED`, `ACTION_ON_RESUME`, `ACTION_ON_RESUMED`,
`ACTION_ON_CANCEL`, `ACTION_ON_START`, `ACTION_ON_KILL`, `SHUTDOWN_ACTION`, `ACTION_ON_G29_RECOVER` and
`ACTION_ON_G29_FAILURE`. They are not in the configuration files; Marlin sets the defaults shown above unless you
define a different text in `Configuration_adv.h`. Change them only if your host expects other words.

This matters most for prints streamed from the host. The host owns the job, so only the host can stop sending
lines. Without action commands, pressing Pause on the printer's display does not stop the host from streaming.

### Host prompts

[`HOST_PROMPT_SUPPORT`](/docs/settings/host.html#HOST_PROMPT_SUPPORT) (on by default) lets Marlin show a dialog on
the host whenever it would otherwise wait for a click on the display:

```
//action:prompt_end
//action:prompt_begin Nozzle Parked
//action:prompt_button Continue
//action:prompt_show
```

The host draws the message with one button per `prompt_button` line, and answers with
[`M876 S<n>`](/docs/gcode/M876.html), where `n` is the button's position counting from 0. `//action:prompt_end`
closes any open dialog. Marlin also uses this for information boxes with a Dismiss button ("UI Pause", "UI
Aborted", "Pause").

The main user is the filament change. [Filament Change and Pause: running a change from a
host](/docs/features/filament_change.html#running-a-change-from-a-host) lists the prompts `M600` sends and what each
button does.

### Status notifications and messages

[`HOST_STATUS_NOTIFICATIONS`](/docs/settings/host.html#HOST_STATUS_NOTIFICATIONS) (on by default, requires host
prompt support) copies each status-line message to the host as `//action:notification <text>`. That includes the
text you set with [`M117`](/docs/gcode/M117.html). On a printer without a display, `M117` does nothing, but
messages Marlin sets internally are still sent as notifications.

[`M118`](/docs/gcode/M118.html) writes a line to the host console:

| Command | Host sees |
|---|---|
| `M118 Layer 10 done` | `Layer 10 done` |
| `M118 E1 Layer 10 done` | `echo:Layer 10 done` |
| `M118 A1 action:pause` | `//action:pause` (a host action command from inside your G-code) |
| `M118 P0 Hello` | `Hello` on every port (`P1`, `P2`... for one port, with more than one port configured) |

### Progress from the slicer (M73)

Marlin can only estimate progress for files printed from its own SD card. For a streamed print, or for a better
estimate, the slicer can insert [`M73`](/docs/gcode/M073.html) lines.
[`SET_PROGRESS_MANUALLY`](/docs/settings/lcd.html#SET_PROGRESS_MANUALLY) enables `M73`, with the parameters
selected by [`SET_PROGRESS_PERCENT`](/docs/settings/lcd.html#SET_PROGRESS_PERCENT) (`P`, percent),
[`SET_REMAINING_TIME`](/docs/settings/lcd.html#SET_REMAINING_TIME) (`R`, minutes left) and
[`SET_INTERACTION_TIME`](/docs/settings/lcd.html#SET_INTERACTION_TIME) (`C`, minutes until the next filament
change). At least one must be enabled. The values show on the display; with
[`M73_REPORT`](/docs/settings/lcd.html#M73_REPORT) Marlin also echoes them to the host
(`echo: M73 Progress: 25%; Time left: 456m;`), and by default only during an SD print
([`M73_REPORT_SD_ONLY`](/docs/settings/lcd.html#M73_REPORT_SD_ONLY)).

## Emergency parser

Normally a line is read from the port only when the command queue has room for it. When the queue is full,
behind a long `M109` or a paused `M600` for example, an urgent command waits in the receive buffer with everything
else. [`EMERGENCY_PARSER`](/docs/settings/serial.html#EMERGENCY_PARSER) watches the characters as they arrive and
acts on a few commands immediately, before they reach the queue:

| Command | Effect |
|---|---|
| [`M108`](/docs/gcode/M108.html) | End a wait: heating, a filament change prompt, `M0`/`M1`. |
| [`M112`](/docs/gcode/M112.html) | Emergency stop: heaters and steppers off, the printer halts. |
| [`M410`](/docs/gcode/M410.html) | Quick stop: abort all planned moves. |
| [`M876`](/docs/gcode/M876.html) | Answer a host prompt (with `HOST_PROMPT_SUPPORT`). |
| [`M524`](/docs/gcode/M524.html) | Abort the SD print (with media support). |

The parser needs a hook in the platform's serial driver, so it is not available everywhere. The build stops with
an error on ESP32, SAMD21, SAMD51, Teensy 3.x and 4.x, AVR boards with native USB (AT90USB), STM32F1 (Maple) when
native USB is the only host port and `USE_USB_COMPOSITE` is off, and HC32 when native USB is the only host port. On boards where it
builds, it is worth enabling for any printer driven from a host. A printer with
[`ADVANCED_PAUSE_FEATURE`](/docs/settings/advanced_pause.html#ADVANCED_PAUSE_FEATURE) and no display will not
build without it, host prompt answers (`M876`) reach Marlin while `M600` waits, and the host's emergency stop works
while the queue is full. `M115` reports it
as `Cap:EMERGENCY_PARSER`.

{: .note }
> Without the emergency parser, Marlin still acts on `M108`, `M112` and `M410` as soon as it reads the line, ahead
> of the commands already queued. The difference is when the line gets read: only while the queue has a free slot.
> `M876` gets no such shortcut; it waits its turn in the queue.

### Realtime reporting

[`REALTIME_REPORTING_COMMANDS`](/docs/settings/serial.html#REALTIME_REPORTING_COMMANDS) adds three Grbl-style
commands handled by the emergency parser, so they need `EMERGENCY_PARSER`: `S000` reports state and position
while moving, `P000` holds motion at once, and `R000` resumes it. These are meant for CNC and laser hosts.
[`FULL_REPORT_TO_HOST_FEATURE`](/docs/settings/serial.html#FULL_REPORT_TO_HOST_FEATURE) adds the position to the
busy messages. For ordinary position queries, [`M114`](/docs/gcode/M114.html) reports the position of the last
command without waiting for moves to finish;
[`M114_REALTIME`](/docs/settings/reporting.html#M114_REALTIME) adds `M114 R` for the position the steppers are
actually at, and [`M114_DETAIL`](/docs/settings/reporting.html#M114_DETAIL) adds `M114 D` (planner detail) and
`M114 E` (extruder step count).

## Faster transfers

**Binary file transfer.** [`BINARY_FILE_TRANSFER`](/docs/settings/lcd.html#BINARY_FILE_TRANSFER) adds a packet
protocol for uploading files to the SD card, started with `M28 B1` (Marlin replies
`echo:Switching to Binary Protocol`). The host needs to support it. It requires SD support, cannot be used with
`SDCARD_READONLY`, and cannot be combined with MeatPack.

**MeatPack.** [`MEATPACK_ON_SERIAL_PORT_1`](/docs/settings/gcode.html#MEATPACK_ON_SERIAL_PORT_1) and
[`MEATPACK_ON_SERIAL_PORT_2`](/docs/settings/gcode.html#MEATPACK_ON_SERIAL_PORT_2) let a host with the
[OctoPrint-MeatPack](https://github.com/scottmudge/OctoPrint-MeatPack) plugin compress G-code on the fly, packing
the most common characters two to a byte and dropping comments. Streamed G-code ends up roughly half the size, which
helps on boards stuck at a low baud rate where detailed curves stutter. The host turns packing on and off with
control bytes, so ordinary lines still work.

## Identity and number format

- [`CUSTOM_MACHINE_NAME`](/docs/settings/serial.html#CUSTOM_MACHINE_NAME) sets the name shown on the display and
  reported as `MACHINE_TYPE` in `M115`.
- [`CONFIGURABLE_MACHINE_NAME`](/docs/settings/serial.html#CONFIGURABLE_MACHINE_NAME) adds
  [`M550`](/docs/gcode/M550.html) to change the name at runtime. `M115` still reports the built-in name.
- [`MACHINE_UUID`](/docs/settings/serial.html#MACHINE_UUID) gives the printer a unique ID in `M115`, which some
  hosts use to tell identical printers apart. On STM32 boards without it, Marlin derives a UUID from the chip's
  unique ID.
- [`SERIAL_FLOAT_PRECISION`](/docs/settings/serial.html#SERIAL_FLOAT_PRECISION) sets the digits after the decimal
  point when Marlin prints a number to the host. When it is not set, 2 digits are used.

## Check that it works

1. Set the host to the port and the baud rate from `BAUDRATE`, and connect.
2. Look for the startup banner. Opening the port often resets the board, so it may appear on every connect:
   ```
   start
   Marlin bugfix-2.1.x
   echo: Compiled: Oct 17 2026
   ```
   The exact lines vary (the reset reason, `Last Updated`, free memory), but `start` comes first.
3. Send `M115`. You should see `FIRMWARE_NAME:Marlin` and, with the extended report, the `Cap:` lines. Check that
   the features you enabled show `:1`.
4. Send `M105`. The reply starts with `ok T:`.
5. If you use auto-reporting, send `M155 S2` and check that a temperature line arrives every 2 seconds without
   further commands.
6. Run a long command such as `G28` and watch for `echo:busy: processing` every 2 seconds, then `ok`.

## Troubleshooting

| Symptom | Likely cause | What to do |
|---|---|---|
| Garbage characters or nothing at all after connecting | Baud rate mismatch, or the wrong port selected in `SERIAL_PORT`. | Match the host to `BAUDRATE`. Check that the socket you use is the one `SERIAL_PORT` (or `SERIAL_PORT_2`) selects. |
| Frequent `Resend:` and `Error:checksum mismatch` | Damaged bytes: cable, USB hub, electrical noise from motors or heaters, or a baud rate the link cannot hold. | Use a short, shielded cable without a hub. Try `115200`. Check the grounding. |
| `Error:Line Number is not Last Line Number+1` | A line was lost, or two programs are sending on the same port. | Close the other program. If it repeats, treat it like a checksum problem. |
| Host times out during homing, leveling or heating | Keepalive off, or a host that needs busy messages while heating. | Enable `HOST_KEEPALIVE_FEATURE` and `BUSY_WHILE_HEATING`. Check that the host's timeout is longer than `DEFAULT_KEEPALIVE_INTERVAL`. |
| Printer restarts whenever the host connects | Many boards reset the processor when the USB serial port is opened. This is the board's hardware and bootloader, not a Marlin option. | Expect it, and keep the host connected through the print instead of reconnecting. |
| Short pauses on curves and detailed areas while streaming | Lines arrive slower than the printer uses them. | Raise the baud rate, enable `ADVANCED_OK` with a larger `BUFSIZE` if your host supports it, try MeatPack, or print from the SD card. |
| `echo:Unknown command: "Mxxx"` | The feature behind that command is not compiled in. | Look up the command's page for its required option and enable it. |
| Host shows no temperatures | The host is neither polling `M105` nor sending `M155`, or `AUTO_REPORT_TEMPERATURES` is off. | Enable `AUTO_REPORT_TEMPERATURES` and `EXTENDED_CAPABILITIES_REPORT`, or turn on polling in the host. |
| Host prompt never appears for `M600` | `HOST_PROMPT_SUPPORT` off, or the host does not support action prompts. | Enable it, or send `M108` from the terminal. |
| Clicking Continue on the host does nothing | No `EMERGENCY_PARSER`, so the `M876` waits in the queue behind the `M600` that is waiting for it. | Enable `EMERGENCY_PARSER` where your platform supports it. |

## Pitfalls

- **Two hosts on one printer.** Each port keeps its own line numbers, and each `ok` goes back to the port that sent
  the command, but the ports share one command queue. Busy messages, auto-reports and `//action:` lines go to every
  port. Two hosts streaming at once interleave their commands, and a print started by one is invisible to the
  other except through those messages. Let one host own the printer at a time.
- **SD prints started from the host.** When the host starts a print from the printer's SD card with `M23`/`M24`,
  it is not streaming, so it learns progress only from `M27`. Without
  [`AUTO_REPORT_SD_STATUS`](/docs/settings/lcd.html#AUTO_REPORT_SD_STATUS), it has to poll `M27`; some hosts show
  no progress at all.
- **A touch screen on a second port.** A serial touch screen that runs its own host software is a host as far as
  Marlin is concerned. Give it its own `SERIAL_PORT_n` and keep USB on another one. If only the screen's UART is
  configured, a computer plugged into USB gets no answer, and the screen's own commands share the queue with your
  host's. Displays that use `LCD_SERIAL_PORT` are not hosts and do not need a host port.
- **Connecting during a print from SD.** If opening the port resets the board, connecting a host in the middle of
  an SD print ends that print. Connect before you start.
- **Turning off the capability report.** Hosts decide what to use from `M115`. With
  `EXTENDED_CAPABILITIES_REPORT` off, a host assumes the printer has none of the optional features, even if they
  are compiled in.
