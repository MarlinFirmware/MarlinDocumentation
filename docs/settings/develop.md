---
title: Development
parent: Settings
layout: setting
section: develop
settings:
- name: CONFIG_EXPORT
  file: Configuration_adv.h
  type: int
  default: 105
  disabled: true
  long: |-
    With this option the configuration will be exported to the build folder as part of the build process.
    - 1 = `marlin_config.json` - Dictionary containing the configuration. (Also generated for `CONFIGURATION_EMBEDDING`).
    - 2 = `config.ini` - File format for PlatformIO preprocessing.
    - 3 = `schema.json` - The entire configuration schema. (13 = pattern groups)
    - 4 = `schema.yml` - The entire configuration schema.
    - 5 = `Config.h` - Minimal configuration.

    Add 100 for some variant of the exported configuration, e.g., organized by section.
  comment: |-
    Configuration Export

    Export the configuration as part of the build. (See signature.py) Output files are saved with the build (e.g., .pio/build/mega2560).

    See `build_all_examples --ini` as an example of config.ini archiving.

    1 = marlin_config.json - Dictionary containing the configuration. This file is also generated for `CONFIGURATION_EMBEDDING`. 2 = config.ini - File format for PlatformIO preprocessing. 3 = schema.json - The entire configuration schema. (13 = pattern groups) 4 = schema.yml - The entire configuration schema. 5 = Config.h - Minimal configuration by popular demand.
  options:
  - value: '1'
    label: JSON
  - value: '2'
    label: config.ini
  - value: '3'
    label: schema.json
  - value: '4'
    label: schema.yml
  - value: '5'
    label: Config.h
- name: M100_FREE_MEMORY_WATCHER
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: |-
    Uncomment to add the [`M100`](/docs/gcode/M100.html) Free Memory Watcher for debugging purposes.

    See [`M100`](/docs/gcode/M100.html) for more details.
  comment: '- `M100` Free Memory Watcher to debug memory usage'
- name: DIRECT_PIN_CONTROL
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: '- `M42` Set pin states'
- name: PINS_DEBUGGING
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Display pin status, toggle pins, watch pins, watch endstops & toggle LED, test servo probe with [`M43`](/docs/gcode/M043.html).
  comment: '- `M43` display pin status, toggle pins, watch pins, watch endstops & toggle LED, test servo probe'
- name: I2C_SCANNER
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: '- `M265` I2C Scanner'
- name: MARLIN_TEST_BUILD
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Enable Tests that will run at startup and produce a report
- name: MARLIN_DEV_MODE
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Enable Marlin dev mode which adds some special commands.
  comment: Enable Marlin dev mode which adds some special commands
- name: BUFFER_MONITORING
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: MARLIN_DEV_MODE
  comment: |-
    D576 - Buffer Monitoring

    To help diagnose print quality issues stemming from empty command buffers.
- name: POSTMORTEM_DEBUGGING
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Captures misbehavior and outputs the CPU status and backtrace to serial. When running in the debugger it will break for debugging. This is useful to help understand a crash from a remote location.
  comment: Postmortem Debugging captures misbehavior and outputs the CPU status and backtrace to serial. When running in the debugger it will break for debugging. This is useful to help understand a crash from a remote location. Requires ~400 bytes of SRAM and 5Kb of flash.
- name: SOFT_RESET_VIA_SERIAL
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Software Reset options
- name: SOFT_RESET_ON_KILL
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Use a digital button to soft-reset the controller after KILL
- name: OPTIBOOT_RESET_REASON
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Report uncleaned reset reason from register r2 instead of MCUSR. Supported by Optiboot on AVR.
- name: MARLIN_SMALL_BUILD
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Shrink the build for smaller boards by sacrificing some serial feedback.
  comment: Shrink the build for smaller boards by sacrificing some serial feedback
---

Options in the `develop` section of the Marlin configuration files.
