---
title:       Using a Host with Marlin
parent:      Introduction
description: 'An overview of print hosts for Marlin — OctoPrint and Mainsail — what they are, what they need, and how to set one up for a web UI on your printer.'
nav_order:   2
layout:      article
nav_enabled: true
gh_edit_link: true
nav_stroke: false
toc: true
back_to_top: true
---

# Using a Host with Marlin

A *host* is a program that talks to your printer over a serial link and gives it a web interface. It
uploads G-code files, streams them to the printer line by line, shows live temperatures and position,
and lets you start, pause, resume and cancel prints from a browser — on your phone, tablet or computer.
Because every host speaks the same serial protocol Marlin uses, any host works with any Marlin printer,
no matter the board or the machine type.

This page is an overview of the two most common hosts for Marlin — **OctoPrint** and **Mainsail** — with
minimal setup for each and links to their own documentation. For the details of how a host and Marlin
talk to each other (serial ports, baud rate, the `ok`/resend protocol, buffers and auto-reports), see
[Host Interface](/docs/features/host_interface.html).

## What a host is and why you'd use one

A printer running Marlin is a self-contained machine: it can print from its own SD card or USB drive,
with its own LCD. A host adds a layer on top:

- **File upload** — send G-code to the printer over the network instead of copying it to a card.
- **Monitoring** — watch temperatures, position and progress from any browser.
- **Remote control** — start, pause, resume and cancel prints, and run G-code commands, without touching
  the printer.

Hosts connect to the printer over **USB serial** (or a serial port wired to a Wi-Fi module or single-board
computer). They send the same G-code Marlin already understands, so there is nothing Marlin-specific to
install on the printer side. The host runs on a separate computer — typically a Raspberry Pi — that stays
connected to the printer.

## OctoPrint

[OctoPrint](https://octoprint.org) is the established, most popular host for Marlin printers. It is a
mature open-source project with a large plugin ecosystem, and it has been the default choice for hobbyists
for years.

**What it needs:** a computer running OctoPrint, connected to the printer over USB. The easiest path is a
Raspberry Pi with the [OctoPi](https://octoprint.org/download/) image, which comes with OctoPrint and its
dependencies preinstalled. You can also install OctoPrint on an existing Linux system, or run it in a
container (see below).

**Marlin side:** nothing is required. OctoPrint works with a stock Marlin build out of the box. A few
options make it more responsive and let the printer's own controls reach the web UI:

- [`HOST_ACTION_COMMANDS`](/docs/settings/host.html#HOST_ACTION_COMMANDS) and
  [`HOST_PROMPT_SUPPORT`](/docs/settings/host.html#HOST_PROMPT_SUPPORT) — both on by default — let
  pause, resume, cancel and filament-change prompts from the printer's LCD appear in the web UI.
- [`EMERGENCY_PARSER`](/docs/settings/serial.html#EMERGENCY_PARSER) makes `M112` (emergency stop) work
  even while a print is streaming.
- [`ADVANCED_OK`](/docs/settings/serial.html#ADVANCED_OK) with a larger
  [`BUFSIZE`](/docs/settings/serial.html#BUFSIZE) lets the host keep more lines in flight, which avoids
  stutters on fine curves.

**Setup:** follow the [OctoPrint documentation](https://docs.octoprint.org/). In short: flash OctoPi to an
SD card, boot the Pi, plug in the printer, and open the web UI. OctoPrint autodetects the printer's serial
port and baud rate.

## Mainsail

[Mainsail](https://docs.mainsail.xyz) is a modern, fast web interface that is normally paired with the
Klipper firmware. With Marlin it works through a third-party bridge called
[serial2moon](https://github.com/Lukas-Heiligenbrunner/serial2moon), which stands in for Klipper: it
speaks Marlin G-code over serial and presents the Klipper API that Mainsail and its backend Moonraker
expect. No firmware change is needed.

```
Mainsail → Moonraker → serial2moon → USB serial → Marlin
```

**What it needs:** a computer running the Mainsail/Moonraker/serial2moon stack, connected to the printer
over USB. The bridge runs on a host computer (a Raspberry Pi, or any machine with Docker), not on the
printer.

**Marlin side:** nothing is required. These options are all optional; each one makes the web UI more
accurate:

- [`EMERGENCY_PARSER`](/docs/settings/serial.html#EMERGENCY_PARSER) — makes the web UI's emergency stop
  work while a print streams.
- [`ADVANCED_OK`](/docs/settings/serial.html#ADVANCED_OK) and a larger
  [`BUFSIZE`](/docs/settings/serial.html#BUFSIZE) — let the host keep more lines in flight.
- [`AUTO_REPORT_POSITION`](/docs/settings/reporting.html#AUTO_REPORT_POSITION) and
  [`AUTO_REPORT_REAL_POSITION`](/docs/settings/reporting.html#AUTO_REPORT_REAL_POSITION) — keep the
  position display current.
- [`REPORT_FAN_CHANGE`](/docs/settings/reporting.html#REPORT_FAN_CHANGE) — report fan speed changes.
- [`M114_REALTIME`](/docs/settings/reporting.html#M114_REALTIME) — report the steppers' actual position.
- [`M115_GEOMETRY_REPORT`](/docs/settings/reporting.html#M115_GEOMETRY_REPORT) — let the bridge read the
  machine's travel limits at connect.
- [`CANCEL_OBJECTS`](/docs/settings/extras.html#CANCEL_OBJECTS) — cancel individual objects in a print.
- [`SET_PROGRESS_MANUALLY`](/docs/settings/lcd.html#SET_PROGRESS_MANUALLY) — report print progress.

Do **not** enable [`AUTO_REPORT_FANS`](/docs/settings/reporting.html#AUTO_REPORT_FANS): it reports fan
*tachometer* RPM, not fan speed, and needs a tachometer pin on the fan.

**Limits to know about.** Mainsail is built around Klipper, and some of its features don't map to Marlin:

- Klipper-only features — input shaper calibration, `BED_MESH_CALIBRATE`, and Klipper macros — are
  accepted by the interface but do nothing on Marlin. Use the Marlin G-codes in the console instead.
- Mainsail labels the backend "Klipper" in its connection screens. That text is Mainsail's; serial2moon
  is what is actually behind it.
- The homed-axes display is inferred from the `G28` commands the bridge sends. Marlin does not yet report
  its own homed state.

**Setup paths:**

- **Raspberry Pi:** flash the image from the
  [serial2moon Releases](https://github.com/Lukas-Heiligenbrunner/serial2moon/releases) page, plug in the
  printer, and open `http://<pi-hostname>/`. Updates run from the `HOST_UPDATE_CHECK` / `HOST_UPDATE`
  macros.
- **Linux host with Docker:** use the `mainsail.yml` Compose file from the Marlin repository (see below).
  Mainsail is on port 8088. Settings (serial port, baud, ports) go in a `.env` file next to the Compose
  file. Docker Desktop on macOS and Windows cannot pass USB devices through to a container, so this path
  is for Linux hosts.

> **Note on the serial2moon source.** Mainsail support currently uses the
> [MarlinFirmware/serial2moon](https://github.com/MarlinFirmware/serial2moon) fork's `marlin-connector`
> branch, which carries the Marlin support (a TCP transport, printer-reported limits) that is still being
> submitted upstream to [Lukas-Heiligenbrunner/serial2moon](https://github.com/Lukas-Heiligenbrunner/serial2moon)
> as separate pull requests: Lukas-Heiligenbrunner/serial2moon#3 (TCP transport),
> Lukas-Heiligenbrunner/serial2moon#4 (real config file / klipper path),
> Lukas-Heiligenbrunner/serial2moon#5 (read limits from the printer, skip Prusa-only commands),
> Lukas-Heiligenbrunner/serial2moon#6 (RESPOND echo), and Lukas-Heiligenbrunner/serial2moon#7
> (printer.info `app` field). Once those merge, the fork's `:stable` tag can be used instead. The
> `mainsail.yml` Compose file uses the fork image by default.

## Running a host in Docker

For people who prefer containers, the Marlin repository ships Compose files for both hosts under
[`buildroot/share/hosts/`](https://github.com/MarlinFirmware/Marlin/tree/bugfix-2.1.x/buildroot/share/hosts):

- `mainsail.yml` — Mainsail + Moonraker + serial2moon, web UI at `http://localhost:8088`.
- `octoprint.yml` — OctoPrint, web UI at `http://localhost:5050`.

Both need Docker with Compose v2.24 or newer. Start one with:

```sh
docker compose -f mainsail.yml up -d     # or octoprint.yml
```

Settings go in a `.env` file next to the Compose file (all optional); the comments at the top of each
file list them. For Mainsail these include `S2M_SERIAL_PORT`, `S2M_BAUD`, `S2M_TRANSPORT` (set `tcp` to
talk to a TCP socket, e.g. the simulator, instead of USB serial), `S2M_TCP_ADDR`, `MAINSAIL_PORT`,
`MOONRAKER_PORT`, `PRINTER_NAME`, and `S2M_IMAGE`. For OctoPrint: `OCTOPRINT_PORT`, `OCTOPRINT_IMAGE`,
`SERIAL_DEVICE`, and `SIM_ADDR`. Pull updated images with `docker compose -f <file> pull` and bring the
stack back up (`docker compose -f <file> up -d`) — never while a print is running.

On first start OctoPrint takes about 30 seconds to come up, then shows its setup wizard. Its data lives
in an `octoprint` Docker volume; `docker compose -f octoprint.yml down -v` erases it.

A USB printer can only be passed through to a container on a **Linux** host — Docker Desktop on macOS
and Windows cannot pass USB through.

## Trying it without a printer

You can run either host against the [Marlin Simulator](/docs/printers/simulator.html) instead of a real
printer. The simulator exposes a raw G-code socket, and the Docker Compose files above are set up to talk
to it. Build the simulator with `SERIAL_PORT_2` enabled, or the socket silently ignores G-code; and run
one host per simulator, because its socket accepts a single client (the two Compose files default to
different ports: 8099 for Mainsail, 8199 for OctoPrint). This is a developer-oriented workflow; the
details are in the `marlin-hosts-in-docker` skill in the Marlin repository
([`buildroot/skills/marlin-hosts-in-docker/SKILL.md`](https://github.com/MarlinFirmware/Marlin/blob/bugfix-2.1.x/buildroot/skills/marlin-hosts-in-docker/SKILL.md)).

## Which should I use?

| | OctoPrint | Mainsail |
|---|---|---|
| **Maturity** | Established, most popular, large plugin ecosystem | Modern, fast, actively developed |
| **Firmware** | Native Marlin support | Built for Klipper; works with Marlin through the serial2moon bridge |
| **Setup** | OctoPi image or normal install | Raspberry Pi image or Docker |
| **Marlin config** | Nothing required | Nothing required (options above make it more accurate) |
| **Best for** | A proven, well-supported host with plugins | A lightweight, modern interface |

Both are free and open source, and both work with any Marlin printer. OctoPrint is the safer, more
established choice with the largest community and plugin library. Mainsail offers a faster, more modern
interface if you don't mind that it is built around Klipper and reaches Marlin through a bridge. Try
either one — you can switch hosts without changing anything on the printer.
