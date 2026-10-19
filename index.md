---
title:       'Home'
description: 'Marlin Firmware — open source motion control and user interface for RepRap 3D printers.'
layout:      home
nav_exclude: true
gh_edit_link: true

# Everything below is rendered by _layouts/home.html. Keep the prose in the body short:
# the landing page points into the docs, it doesn't repeat them.

hero:
  title: Marlin Firmware
  tagline: Open source motion control and UI for RepRap 3D printers
  lead: |
    Marlin is the firmware inside the printer. It reads G-code from a host or an SD card and turns it into
    smooth, precise motion, reliable temperature control and a responsive user interface, all on a single
    microcontroller. It has driven RepRap-style machines since 2011 and today runs on everything from classic
    8-bit boards to modern 32-bit ARM, ESP32 and RP2040 controllers.
  actions:
    - label: Get started
      url: /docs/basics/install.html
    - label: G-code reference
      url: /docs/gcode/index.html

stats:
  platforms: 15+     # HAL families in Marlin/src/HAL (STM32, AVR, ESP32, SAMD, RP2040, LPC, GD32, HC32, AT32, Teensy, ...)
  since: 2011

pillars_title: A complete firmware for the whole machine
pillars:
  - icon: motion
    title: Motion
    url: /docs/printers/index.html
    text: >
      A look-ahead planner with acceleration and junction control, Linear Advance, Input Shaping and Fixed-Time
      Motion for cleaner prints at higher speeds. Cartesian, CoreXY, Delta, SCARA, Polar, IDEX and belt kinematics.
  - icon: heat
    title: Heating and safety
    url: /docs/settings/temperature.html
    text: >
      PID and Model Predictive temperature control for hotends, beds and chambers. Thermal runaway protection,
      power-loss recovery and filament runout detection are built in and on by default where it matters.
  - icon: display
    title: User interface
    url: /docs/settings/lcd.html
    text: >
      Character and graphical LCDs, color TFT touch screens and DWIN displays, plus host interfaces and SD card
      printing. Menus, status screens and messages in dozens of languages.
  - icon: chip
    title: Hardware
    url: /docs/appendix/boards.html
    text: >
      Hundreds of controller boards across more than a dozen MCU families, Trinamic stepper drivers, every common
      bed probe, multiple extruders and tool changers, and lasers and spindles for CNC work.

sections_title: Find your way around
sections:
  - icon: book
    title: Introduction
    url: /docs/basics/index.html
    text: What Marlin is, how it processes G-code, and how a print job flows from slicer to steppers.
  - icon: download
    title: Build & Install
    url: /docs/basics/install.html
    text: Get Marlin onto your board, from pre-built binaries and online builds to Auto Build Marlin and PlatformIO.
  - icon: sliders
    title: Configuration
    url: /docs/configuration.html
    text: How Configuration.h and Configuration_adv.h work, with guides for probes, displays and more.
  - icon: printer
    title: Printer Types
    url: /docs/printers/index.html
    text: How each kind of machine moves, and what that means for homing, leveling and limits.
  - icon: star
    title: Features
    url: /docs/features/index.html
    text: Bed leveling, Linear Advance, Input Shaping, firmware retraction and other major features explained.
  - icon: list
    title: Settings
    url: /docs/settings/index.html
    text: Every configuration option, grouped by section, with defaults, requirements and notes.
  - icon: code
    title: G-code
    url: /docs/gcode/index.html
    text: Every command Marlin understands, with parameters, examples and the version it arrived in.
  - icon: wrench
    title: Tools
    url: /tools/index.html
    text: Calibration pattern generators for Linear Advance and Input Shaping, bitmap and color converters.
  - icon: appendix
    title: Appendix
    url: /docs/appendix/index.html
    text: Boards, controllers, thermistors, endstops, the printer directory and troubleshooting.

community:
  - icon: github
    title: GitHub
    url: //github.com/MarlinFirmware/Marlin
    text: Source code, releases and pull requests.
  - icon: bug
    title: Issues
    url: //github.com/MarlinFirmware/Marlin/issues
    text: Bug reports and feature requests.
  - icon: chat
    title: Discussions
    url: //github.com/MarlinFirmware/Marlin/discussions
    text: Questions, ideas and show-and-tell.
  - icon: discord
    title: Discord
    url: //discord.com/servers/marlin-firmware-461605380783472640
    text: Live chat with users and developers.
  - icon: share
    title: Social
    url: //fosstodon.org/@marlinfirmware
    text: Mastodon, Bluesky, X and the RepRap forums.
  - icon: heart
    title: Donate
    url: /donate.html
    text: Help fund development and hardware for testing.
---

## Built for RepRap, ready for what comes next

Marlin began in 2011 when [Erik van der Zalm](//github.com/ErikZalm) combined Sprinter and Grbl into one firmware for
RepRap and Ultimaker machines. It has been owned and maintained by the maker community ever since, and it now ships
in many of the world's desktop 3D printers.

The project's direction is simple: provide every firmware function a complete motion system and user interface needs,
with RepRap-style 3D printers as the first priority, on a modern foundation. That means 32-bit boards and current
toolchains as the main target, continued care for the 8-bit boards still in wide use, and a single code base that
you can configure for your own machine rather than a vendor's.

![How Marlin fits between the slicer and the printer: G-code arrives from a host or SD card, is queued and parsed, planned into motion blocks and finally turned into step pulses and heater power.](/assets/images/basics/marlin-pipeline.svg){: .home-figure }
