---
title: Host
parent: Settings
layout: setting
section: host
settings:
- name: HOST_KEEPALIVE_FEATURE
  file: Configuration.h
  type: switch
  long: When Host Keepalive is enabled Marlin will send a busy status message to the host every couple of seconds when it can't accept commands. Disable if your host doesn't like keepalive messages. Use `DEFAULT_KEEPALIVE_INTERVAL` for the default number of seconds between "busy" messages. Override with [`M113`](/docs/gcode/M113.html). Marlin 1.1.5 and up include the `BUSY_WHILE_HEATING` option for hosts that treat host keepalive as a strict busy protocol.
  comment: |-
    Host Keepalive

    When enabled Marlin will send a busy status message to the host every couple of seconds when it can't accept commands.
- name: DEFAULT_KEEPALIVE_INTERVAL
  file: Configuration.h
  type: int
  default: 2
  comment: Number of seconds between "busy" messages. Set with M113.
- name: BUSY_WHILE_HEATING
  file: Configuration.h
  type: switch
  comment: Some hosts require "busy" messages even during heating
- name: PRINTJOB_TIMER_AUTOSTART
  file: Configuration.h
  type: switch
  long: |-
    Automatically start and stop the print job timer when [`M104`](/docs/gcode/M104.html)/[`M109`](/docs/gcode/M109.html)/[`M190`](/docs/gcode/M190.html) commands are received. Also adds the following commands to control the timer:
    - [`M75`](/docs/gcode/M075.html) - Start the print job timer.
    - [`M76`](/docs/gcode/M076.html) - Pause the print job timer.
    - [`M77`](/docs/gcode/M077.html) - Stop the print job timer.
  comment: |-
    Print Job Timer

    Automatically start and stop the print job timer on M104/M109/M140/M190/M141/M191. The print job timer will only be stopped if the bed/chamber target temp is below `BED_MINTEMP`/`CHAMBER_MINTEMP`.

    - `M104` (hotend, no wait)  - high temp = none,        low temp = stop timer
    - `M109` (hotend, wait)     - high temp = start timer, low temp = stop timer
    - `M140` (bed, no wait)     - high temp = none,        low temp = stop timer
    - `M190` (bed, wait)        - high temp = start timer, low temp = none
    - `M141` (chamber, no wait) - high temp = none,        low temp = stop timer
    - `M191` (chamber, wait)    - high temp = start timer, low temp = none

    For M104/M109, high temp is anything over `EXTRUDE_MINTEMP` / 2. For M140/M190, high temp is anything over `BED_MINTEMP`. For M141/M191, high temp is anything over `CHAMBER_MINTEMP`.

    The timer can also be controlled with the following commands:

    - `M75` Start the print job timer
    - `M76` Pause the print job timer
    - `M77` Stop the print job timer
- name: HOST_ACTION_COMMANDS
  file: Configuration_adv.h
  type: switch
  long: Define host streamer action commands in compliance with the standard. See [this article](//reprap.org/wiki/G-code#Action_commands){:target="_blank"} for a description of the standard.
  comment: |-
    Host Action Commands

    Define host streamer action commands in compliance with the standard.

    - <https://reprap.org/wiki/G-code#Action_commands>

    Common commands ........ poweroff, pause, paused, resume, resumed, cancel `G29_RETRY_AND_RECOVER` .. probe_rewipe, probe_failed

    Some features add reason codes to extend these commands.

    Host Prompt Support enables Marlin to use the host for user prompts so filament runout and other processes can be managed from the host side.
- name: HOST_PAUSE_M76
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HOST_ACTION_COMMANDS
  comment: Tell the host to pause in response to M76
- name: HOST_PROMPT_SUPPORT
  file: Configuration_adv.h
  type: switch
  requires: HOST_ACTION_COMMANDS
  comment: Initiate host prompts to get user feedback
- name: HOST_STATUS_NOTIFICATIONS
  file: Configuration_adv.h
  type: switch
  requires: HOST_ACTION_COMMANDS && HOST_PROMPT_SUPPORT
  comment: Send some status messages to the host as notifications
- name: HOST_START_MENU_ITEM
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HOST_ACTION_COMMANDS
  comment: Add a menu item that tells the host to start
- name: HOST_SHUTDOWN_MENU_ITEM
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: HOST_ACTION_COMMANDS
  comment: Add a menu item that tells the host to shut down
---

Options in the `host` section of the Marlin configuration files.

See [Host Interface](/docs/features/host_interface.html) for how these options work together.
