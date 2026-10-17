---
title: Fans
parent: Settings
layout: setting
section: fans
settings:
- name: NUM_M106_FANS
  file: Configuration.h
  type: int
  default: 1
  disabled: true
  comment: Set number of user-controlled fans. Disable to use all board-defined fans.
- name: FAN_SOFT_PWM
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    Use software PWM to drive the fan, as with the heaters. This uses a very low frequency which is not as annoying as with the hardware PWM. On the other hand, if this frequency is too low, you should also increment `SOFT_PWM_SCALE`.

    Use software PWM to drive the fan. This uses a very low frequency which is not as annoying as with the hardware PWM. Increase `SOFT_PWM_SCALE` if the frequency is too low.
    If experiencing resolution loss when `SOFT_PWM_SCALE` is set to a value greater than 0, `SOFT_PWM_DITHER` can be used to mitigate it. If enabled.
  comment: Use software PWM to drive the fan, as for the heaters. This uses a very low frequency which is not as annoying as with the hardware PWM. On the other hand, if this frequency is too low, you should also increment `SOFT_PWM_SCALE`.
- name: SOFT_PWM_SCALE
  file: Configuration.h
  type: int
  default: 0
  long: Incrementing this by 1 will double the software PWM frequency, affecting heaters (and the fan if `FAN_SOFT_PWM` is enabled). However, control resolution will be halved for each increment; at zero value, there are 128 effective control positions.
  comment: Incrementing this by 1 will double the software PWM frequency, affecting heaters, and the fan if `FAN_SOFT_PWM` is enabled. However, control resolution will be halved for each increment; at zero value, there are 128 effective control positions.
- name: SOFT_PWM_DITHER
  file: Configuration.h
  type: switch
  disabled: true
  long: If `SOFT_PWM_SCALE` is set to a value higher than 0, dithering can be used to mitigate the associated resolution loss. If enabled, some of the PWM cycles are stretched so on average the desired duty cycle is attained.
  comment: If `SOFT_PWM_SCALE` is set to a value higher than 0, dithering can be used to mitigate the associated resolution loss. If enabled, some of the PWM cycles are stretched so on average the desired duty cycle is attained.
- name: PART_COOLING_FAN*_PIN
  file: Configuration_adv.h
  type: enum
  comment: |-
    Part Cooling Fan Pins

    Override the default part cooling fan pins for each fan index. Allows remapping which physical fan pin is used for part cooling. By default: FAN0 -&gt; FAN0_PIN, FAN1 -&gt; `FAN1_PIN`, etc.
  members:
  - id: '0'
    name: PART_COOLING_FAN0_PIN
    default: FAN0_PIN
    disabled: true
  - id: '1'
    name: PART_COOLING_FAN1_PIN
    default: FAN1_PIN
    disabled: true
  - id: '2'
    name: PART_COOLING_FAN2_PIN
    default: FAN2_PIN
    disabled: true
  - id: '3'
    name: PART_COOLING_FAN3_PIN
    default: FAN3_PIN
    disabled: true
  - id: '4'
    name: PART_COOLING_FAN4_PIN
    default: FAN4_PIN
    disabled: true
  - id: '5'
    name: PART_COOLING_FAN5_PIN
    default: FAN5_PIN
    disabled: true
  - id: '6'
    name: PART_COOLING_FAN6_PIN
    default: FAN6_PIN
    disabled: true
  - id: '7'
    name: PART_COOLING_FAN7_PIN
    default: FAN7_PIN
    disabled: true
  - id: '8'
    name: PART_COOLING_FAN8_PIN
    default: FAN8_PIN
    disabled: true
  - id: '9'
    name: PART_COOLING_FAN9_PIN
    default: FAN9_PIN
    disabled: true
  - id: '10'
    name: PART_COOLING_FAN10_PIN
    default: FAN10_PIN
    disabled: true
  - id: '11'
    name: PART_COOLING_FAN11_PIN
    default: FAN11_PIN
    disabled: true
- name: USE_CONTROLLER_FAN
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: A controller fan is useful to cool down the stepper drivers and MOSFETs. When stepper drivers reach a certain temperature they'll turn off, either stuttering or stopping. With this option enabled the fan will turn on automatically whenever any steppers are enabled and turn off after a set period when all steppers are turned off.
  comment: |-
    Controller Fan

    To cool down the stepper drivers and MOSFETs.

    The fan turns on automatically whenever any driver is enabled and turns off (or reduces to idle speed) shortly after drivers are turned off.
- name: CONTROLLER_FAN_PIN
  file: Configuration_adv.h
  type: int
  default: -1
  disabled: true
  requires: USE_CONTROLLER_FAN
  comment: Set a custom pin for the controller fan
- name: CONTROLLER_FAN2_PIN
  file: Configuration_adv.h
  type: int
  default: -1
  disabled: true
  requires: USE_CONTROLLER_FAN
  comment: Set a custom pin for second controller fan
- name: CONTROLLER_FAN_USE_Z_ONLY
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: USE_CONTROLLER_FAN
  comment: With this option only the Z axis is considered
- name: CONTROLLER_FAN_IGNORE_Z
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: USE_CONTROLLER_FAN
  comment: Ignore Z stepper. Useful when stepper timeout is disabled.
- name: CONTROLLERFAN_SPEED_MIN
  file: Configuration_adv.h
  type: int
  default: 0
  units: 0-255
  requires: USE_CONTROLLER_FAN
  comment: (0-255) Minimum speed. (If set below this value the fan is turned off.)
- name: CONTROLLERFAN_SPEED_ACTIVE
  file: Configuration_adv.h
  type: int
  default: 255
  units: 0-255
  requires: USE_CONTROLLER_FAN
  comment: (0-255) Active speed, used when any motor is enabled
- name: CONTROLLERFAN_SPEED_IDLE
  file: Configuration_adv.h
  type: int
  default: 0
  units: 0-255
  requires: USE_CONTROLLER_FAN
  comment: (0-255) Idle speed, used when motors are disabled
- name: CONTROLLERFAN_IDLE_TIME
  file: Configuration_adv.h
  type: int
  default: 60
  units: seconds
  requires: USE_CONTROLLER_FAN
  comment: (seconds) Extra time to keep the fan running after disabling motors
- name: CONTROLLER_FAN_MIN_BOARD_TEMP
  file: Configuration_adv.h
  type: int
  default: 40
  units: °C
  disabled: true
  requires: USE_CONTROLLER_FAN
  comment: Use `TEMP_SENSOR_BOARD` as a trigger for enabling the controller fan
- name: CONTROLLER_FAN_MIN_SOC_TEMP
  file: Configuration_adv.h
  type: int
  default: 40
  units: °C
  disabled: true
  requires: USE_CONTROLLER_FAN
  comment: Use `TEMP_SENSOR_SOC` as a trigger for enabling the controller fan
- name: CONTROLLER_FAN_BED_HEATING
  file: Configuration_adv.h
  type: switch
  requires: USE_CONTROLLER_FAN
  comment: Turn on the fan when heating the bed
- name: CONTROLLER_FAN_EDITABLE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: USE_CONTROLLER_FAN
  comment: Enable M710 configurable settings
- name: CONTROLLER_FAN_MENU
  file: Configuration_adv.h
  type: switch
  requires: USE_CONTROLLER_FAN && CONTROLLER_FAN_EDITABLE
  comment: Enable the Controller Fan submenu
- name: FAN_KICKSTART_TIME
  file: Configuration_adv.h
  type: int
  default: 100
  units: ms
  disabled: true
  long: When PWM fans are set to low speed, they may need a higher-energy kickstart first to get moving. Once up to speed the fan can drop back to the set speed. This option specifies the kickstart duration in milliseconds. **This option doesn't work with the software PWM fan on Sanguinololu.**
  comment: |-
    Fan Kickstart

    When part cooling or controller fans first start, run at a speed that gets it spinning reliably for a short time before setting the requested speed. (Does not work on Sanguinololu with `FAN_SOFT_PWM`.)
- name: FAN_KICKSTART_POWER
  file: Configuration_adv.h
  type: int
  default: 180
  disabled: true
  comment: 64-255
- name: FAN_KICKSTART_LINEAR
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Set kickstart time linearly based on the speed, e.g., for 20% (51) it will be `FAN_KICKSTART_TIME` * 0.2. Useful for quick speed up to low speed. Kickstart power must be set to 255.
- name: FAN_OFF_PWM
  file: Configuration_adv.h
  type: int
  default: 1
  disabled: true
  long: Some coolers may require a non-zero "off" state.
  comment: Some coolers may require a non-zero "off" state.
- name: FAN_*_PWM
  file: Configuration_adv.h
  type: int
  long: This option can be defined to set the minimum and maximum PWM speeds (1-255) required to keep the PWM fans moving. Fan speeds set by [`M106`](/docs/gcode/M106.html) will be scaled to the reduced range above this minimum.
  comment: |-
    PWM Fan Scaling

    Define the min/max speeds for PWM fans (as set with M106).

    With these options the M106 0-255 value range is scaled to a subset to ensure that the fan has enough power to spin, or to run lower current fans with higher current. (e.g., 5V/12V fans with 12V/24V) Value 0 always turns off the fan.

    Define one or both of these to override the default 0-255 range.
  members:
  - id: MIN
    name: FAN_MIN_PWM
    default: 50
    disabled: true
  - id: MAX
    name: FAN_MAX_PWM
    default: 128
    disabled: true
- name: FAST_PWM_FAN
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: |-
    Increase the FAN PWM frequency. Removes the PWM noise but increases heating in the FET/Arduino.

    `FAST_PWM_FAN` increases the FAN PWM frequency. The frequency and scaling can be adjusted in `Configuration_adv.h`.
  comment: |-
    Fan Fast PWM

    Combinations of PWM Modes, prescale values and TOP resolutions are used internally to produce a frequency as close as possible to the desired frequency.

    `FAST_PWM_FAN_FREQUENCY`

    Set this to your desired frequency. For AVR, if left undefined this defaults to F = F_CPU/(2*255*1) i.e., F = 31.4kHz on 16MHz micro-controllers or F = 39.2kHz on 20MHz micro-controllers. For non AVR, if left undefined this defaults to F = 1Khz. This F value is only to protect the hardware from an absence of configuration and not to complete it when users are not aware that the frequency must be specifically set to support the target board.

    NOTE: Setting very low frequencies (&lt; 10 Hz) may result in unexpected timer behavior. Setting very high frequencies can damage your hardware.

    `USE_OCR2A_AS_TOP` [undefined by default]

    Boards that use TIMER2 for PWM have limitations resulting in only a few possible frequencies on TIMER2: 16MHz MCUs: [62.5kHz, 31.4kHz (default), 7.8kHz, 3.92kHz, 1.95kHz, 977Hz, 488Hz, 244Hz, 60Hz, 122Hz, 30Hz] 20MHz MCUs: [78.1kHz, 39.2kHz (default), 9.77kHz, 4.9kHz, 2.44kHz, 1.22kHz, 610Hz, 305Hz, 153Hz, 76Hz, 38Hz] A greater range can be achieved by enabling `USE_OCR2A_AS_TOP`. But note that this option blocks the use of PWM on pin OC2A. Only use this option if you don't need PWM on 0C2A. (Check your schematic.) `USE_OCR2A_AS_TOP` sacrifices duty cycle control resolution to achieve this broader range of frequencies.
- name: FAST_PWM_FAN_FREQUENCY
  file: Configuration_adv.h
  type: int
  default: 31400
  disabled: true
  requires: FAST_PWM_FAN
  long: The default frequency for `FAST_PWM_FAN` is F = F_CPU/(2*255*1). See `Configuration_adv.h` for further information.
  comment: Define here to override the defaults below
- name: USE_OCR2A_AS_TOP
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: FAST_PWM_FAN
- name: REDUNDANT_PART_COOLING_FAN
  file: Configuration_adv.h
  type: int
  default: 1
  disabled: true
  comment: Assign more PWM fans for part cooling, synchronized with Fan 0
- name: NUM_REDUNDANT_FANS
  file: Configuration_adv.h
  type: int
  default: 1
  disabled: true
  requires: REDUNDANT_PART_COOLING_FAN
  comment: Number of sequential fans to synchronize with Fan 0
- name: '*_AUTO_FAN_PIN'
  file: Configuration_adv.h
  type: int
  long: |-
    Cooling fans are needed on 3D printers to keep components cool and prevent failure.

    Extruder auto fans turn on whenever their extruder temperatures go above `EXTRUDER_AUTO_FAN_TEMPERATURE`. Your board's pins file already specifies the recommended pins. Override those here or set to -1 to disable the fans completely.

    Multiple extruders can be assigned to the same pin in which case the fan will turn on when *any* selected extruder is above the threshold.
  comment: |-
    Extruder cooling fans

    Extruder auto fans automatically turn on when their extruders' temperatures go above `EXTRUDER_AUTO_FAN_TEMPERATURE`.

    Your board's pins file specifies the recommended pins. Override those here or set to -1 to disable completely.

    Multiple extruders can be assigned to the same pin in which case the fan will turn on when any selected extruder is above the threshold.
  members:
  - id: E0
    name: E0_AUTO_FAN_PIN
    default: -1
  - id: E1
    name: E1_AUTO_FAN_PIN
    default: -1
  - id: E2
    name: E2_AUTO_FAN_PIN
    default: -1
  - id: E3
    name: E3_AUTO_FAN_PIN
    default: -1
  - id: E4
    name: E4_AUTO_FAN_PIN
    default: -1
  - id: E5
    name: E5_AUTO_FAN_PIN
    default: -1
  - id: E6
    name: E6_AUTO_FAN_PIN
    default: -1
  - id: E7
    name: E7_AUTO_FAN_PIN
    default: -1
  - id: COOLER
    name: COOLER_AUTO_FAN_PIN
    default: -1
- name: CHAMBER_AUTO_FAN_PIN
  file: Configuration_adv.h
  type: int
  default: -1
  shared_comment: |-
    Extruder cooling fans

    Extruder auto fans automatically turn on when their extruders' temperatures go above `EXTRUDER_AUTO_FAN_TEMPERATURE`.

    Your board's pins file specifies the recommended pins. Override those here or set to -1 to disable completely.

    Multiple extruders can be assigned to the same pin in which case the fan will turn on when any selected extruder is above the threshold.
- name: EXTRUDER_AUTO_FAN_TEMPERATURE
  file: Configuration_adv.h
  type: int
  default: 50
- name: EXTRUDER_AUTO_FAN_SPEED
  file: Configuration_adv.h
  type: int
  default: 255
  comment: 255 == full speed
- name: CHAMBER_AUTO_FAN_TEMPERATURE
  file: Configuration_adv.h
  type: int
  default: 30
- name: CHAMBER_AUTO_FAN_SPEED
  file: Configuration_adv.h
  type: int
  default: 255
- name: COOLER_AUTO_FAN_TEMPERATURE
  file: Configuration_adv.h
  type: int
  default: 18
- name: COOLER_AUTO_FAN_SPEED
  file: Configuration_adv.h
  type: int
  default: 255
- name: FOURWIRES_FANS
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    Hotend Cooling Fans tachometers

    Define one or more tachometer pins to enable fan speed monitoring, and reporting of fan speeds with M123.

    NOTE: Only works with fans up to 7000 RPM.
- name: E*_FAN_TACHO_PIN
  file: Configuration_adv.h
  type: int
  comment: |-
    Hotend Cooling Fans tachometers

    Define one or more tachometer pins to enable fan speed monitoring, and reporting of fan speeds with M123.

    NOTE: Only works with fans up to 7000 RPM.
  members:
  - id: '0'
    name: E0_FAN_TACHO_PIN
    default: -1
    disabled: true
  - id: '1'
    name: E1_FAN_TACHO_PIN
    default: -1
    disabled: true
  - id: '2'
    name: E2_FAN_TACHO_PIN
    default: -1
    disabled: true
  - id: '3'
    name: E3_FAN_TACHO_PIN
    default: -1
    disabled: true
  - id: '4'
    name: E4_FAN_TACHO_PIN
    default: -1
    disabled: true
  - id: '5'
    name: E5_FAN_TACHO_PIN
    default: -1
    disabled: true
  - id: '6'
    name: E6_FAN_TACHO_PIN
    default: -1
    disabled: true
  - id: '7'
    name: E7_FAN_TACHO_PIN
    default: -1
    disabled: true
- name: E*_FAN_TACHO_PULLUP
  file: Configuration_adv.h
  type: switch
  comment: |-
    Hotend Cooling Fans tachometers

    Define one or more tachometer pins to enable fan speed monitoring, and reporting of fan speeds with M123.

    NOTE: Only works with fans up to 7000 RPM.
  members:
  - id: '0'
    name: E0_FAN_TACHO_PULLUP
    disabled: true
  - id: '1'
    name: E1_FAN_TACHO_PULLUP
    disabled: true
  - id: '2'
    name: E2_FAN_TACHO_PULLUP
    disabled: true
  - id: '3'
    name: E3_FAN_TACHO_PULLUP
    disabled: true
  - id: '4'
    name: E4_FAN_TACHO_PULLUP
    disabled: true
  - id: '5'
    name: E5_FAN_TACHO_PULLUP
    disabled: true
  - id: '6'
    name: E6_FAN_TACHO_PULLUP
    disabled: true
  - id: '7'
    name: E7_FAN_TACHO_PULLUP
    disabled: true
- name: E*_FAN_TACHO_PULLDOWN
  file: Configuration_adv.h
  type: switch
  comment: |-
    Hotend Cooling Fans tachometers

    Define one or more tachometer pins to enable fan speed monitoring, and reporting of fan speeds with M123.

    NOTE: Only works with fans up to 7000 RPM.
  members:
  - id: '0'
    name: E0_FAN_TACHO_PULLDOWN
    disabled: true
  - id: '1'
    name: E1_FAN_TACHO_PULLDOWN
    disabled: true
  - id: '2'
    name: E2_FAN_TACHO_PULLDOWN
    disabled: true
  - id: '3'
    name: E3_FAN_TACHO_PULLDOWN
    disabled: true
  - id: '4'
    name: E4_FAN_TACHO_PULLDOWN
    disabled: true
  - id: '5'
    name: E5_FAN_TACHO_PULLDOWN
    disabled: true
  - id: '6'
    name: E6_FAN_TACHO_PULLDOWN
    disabled: true
  - id: '7'
    name: E7_FAN_TACHO_PULLDOWN
    disabled: true
- name: FANMUX*_PIN
  file: Configuration_adv.h
  type: int
  long: This feature allows you to digitally multiplex the fan output. The multiplexer is automatically switched at tool-change. To enable, just assign one or more `FANMUX[012]_PIN` values for up to 2, 4, or 8 multiplexed fans.
  comment: |-
    Part-Cooling Fan Multiplexer

    This feature allows you to digitally multiplex the fan output. The multiplexer is automatically switched at tool-change. Set FANMUX[012]_PINs below for up to 2, 4, or 8 multiplexed fans.
  members:
  - id: '0'
    name: FANMUX0_PIN
    default: -1
  - id: '1'
    name: FANMUX1_PIN
    default: -1
  - id: '2'
    name: FANMUX2_PIN
    default: -1
---

Options in the `fans` section of the Marlin configuration files.
