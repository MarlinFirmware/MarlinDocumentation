---
title: Safety
parent: Settings
layout: setting
section: safety
settings:
- name: PREVENT_COLD_EXTRUSION
  file: Configuration.h
  type: switch
  long: |-
    ![Safety](/assets/images/config/safety.gif){: .float-right .framed }

    "Cold Extrusion" refers to any movement of the extruder before the nozzle is hot enough to melt the filament. This could damage your extruder or hotend, but it usually just results in gouged filament and/or a jammed extruder. Keep this option enabled to disable extruder motion until the hotend is at or above the specified temperature. Override this setting with [`M302`](/docs/gcode/M302.html) if needed.
  comment: |-
    Prevent extrusion if the temperature is below `EXTRUDE_MINTEMP`. Add M302 to set the minimum extrusion temperature and/or turn cold extrusion prevention on and off.

    *** IT IS HIGHLY RECOMMENDED TO LEAVE THIS OPTION ENABLED! ***
- name: EXTRUDE_MINTEMP
  file: Configuration.h
  type: int
  default: 170
  shared_comment: |-
    Prevent extrusion if the temperature is below `EXTRUDE_MINTEMP`. Add M302 to set the minimum extrusion temperature and/or turn cold extrusion prevention on and off.

    *** IT IS HIGHLY RECOMMENDED TO LEAVE THIS OPTION ENABLED! ***
- name: PREVENT_LENGTHY_EXTRUDE
  file: Configuration.h
  type: switch
  long: A lengthy extrusion may not damage your machine, but it could result in wasting costly filament. This feature is meant to prevent a typo or glitch in a [`G1`](/docs/gcode/G000-G001.html) command from extruding some enormous amount of filament. For Bowden setups, the max length should be set greater than or equal to the load/eject length.
  comment: |-
    Prevent a single extrusion longer than `EXTRUDE_MAXLENGTH`.

    Note: For Bowden Extruders make this large enough to allow load/unload.
- name: EXTRUDE_MAXLENGTH
  file: Configuration.h
  type: int
  default: 200
  shared_comment: |-
    Prevent a single extrusion longer than `EXTRUDE_MAXLENGTH`.

    Note: For Bowden Extruders make this large enough to allow load/unload.
- name: THERMAL_PROTECTION_*
  file: Configuration.h
  type: switch
  long: |-
    Thermal protection is one of the most vital safety features in Marlin, allowing the firmware to catch a bad situation and shut down heaters before it goes too far. Consider what happens when a thermistor comes loose during printing. The firmware sees a low temperature reading so it keeps the heat on. As long as the temperature reading is low, the hotend will continue to heat up indefinitely, leading to smoke, oozing, a ruined print, and possibly even fire.

    Marlin offers two levels of thermal protection:

    1. Check that the temperature is actually increasing when a heater is on. If the temperature fails to rise enough within a certain time period (by default, 2 degrees in 20 seconds), the machine will shut down with a "`Heating failed`" error. This will detect a disconnected, loose, or mis-configured thermistor, or a disconnected heater.
    2. Monitor thermal stability. If the measured temperature drifts too far from the target temperature for too long, the machine will shut down with a "`Thermal runaway`" error. This error may indicate poor contact between thermistor and hot end, poor PID tuning, or a cold environment.

    More thermal protection options are located in `Configuration_adv.h`. In most setups these can be left unchanged, but should be tuned as needed to prevent false positives.

    {: .note }
    > For false thermal runaways _not_ caused by a loose temperature sensor, try increasing `WATCH_TEMP_PERIOD` or decreasing `WATCH_TEMP_INCREASE`. Heating may be slowed in a cold environment, if a fan is blowing on the heat block, or if the heater has high resistance.
  comment: |-
    Thermal Protection provides additional protection to your printer from damage and fire. Marlin always includes safe min and max temperature ranges which protect against a broken or disconnected thermistor wire.

    The issue: If a thermistor falls out, it will report the much lower temperature of the air in the room, and the firmware will keep the heater on.

    If you get "Thermal Runaway" or "Heating failed" errors the details can be tuned in Configuration_adv.h
  members:
  - id: HOTENDS
    name: THERMAL_PROTECTION_HOTENDS
  - id: BED
    name: THERMAL_PROTECTION_BED
  - id: COOLER
    name: THERMAL_PROTECTION_COOLER
- name: THERMAL_PROTECTION_CHAMBER
  file: Configuration.h
  type: switch
  comment: Enable thermal protection for the heated chamber
- name: USE_WATCHDOG
  file: Configuration_adv.h
  type: switch
  long: The hardware watchdog should reset the micro-controller, disabling all outputs, in case the firmware gets stuck and doesn't do temperature regulation.
  comment: |-
    The watchdog hardware timer will do a reset and disable all outputs if the firmware gets too overloaded to read the temperature sensors.

    If you find that watchdog reboot causes your AVR board to hang forever, enable `WATCHDOG_RESET_MANUAL` to use a custom timer instead of WDTO.

    NOTE: This method is less reliable as it can only catch hangups while interrupts are enabled.
- name: WATCHDOG_RESET_MANUAL
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: USE_WATCHDOG
  long: If you have a watchdog reboot in an ATmega2560 the device can hang forever, as a watchdog reset will leave the watchdog on. The `WATCHDOG_RESET_MANUAL` option works around this by eschewing the hardware reset. However, **this feature is unsafe** because it only works if interrupts are disabled, and the code could hang in an interrupt routine with interrupts disabled.
- name: DISABLE_DRIVER_SAFE_POWER_PROTECT
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    Stepper Driver Anti-SNAFU Protection

    If the SAFE_POWER_PIN is defined for your board, Marlin will check that stepper drivers are properly plugged in before applying power. Disable protection if your stepper drivers don't support the feature.
---

Options that keep the printer from damaging itself or starting a fire. For how the thermal checks behave, what each error means, and how to tune them without disabling them, see [Thermal Protection](/docs/features/thermal_protection.html).
