---
title: Interface
parent: Settings
layout: setting
section: interface
settings:
- name: LCD_LANGUAGE
  file: Configuration.h
  default: en
  brief: Default language to display on the LCD.
  long: |-
    Choose your preferred language for the LCD controller here. Supported languages include:

    Code|Language||Code|Language||Code|Language
    ----|--------||----|--------||----|--------
    en|English (Default)||an|Aragonese||bg|Bulgarian
    ca|Catalan||cz|Czech||da|Danish
    de|German||el|Greek||el_CY|Greek (Cyprus)
    el_gr|Greek (Greece)||es|Spanish||eu|Basque-Euskera
    fi|Finnish||fr|French||fr_na|French (no accent)
    gl|Galician||hr|Croatian (Hrvatski)||hu|Hungarian / Magyar
    it|Italian||jp_kana|Japanese (Kana)||ko_KR|Korean
    nl|Dutch||pl|Polish||pt|Portuguese
    pt_br|Portuguese (Brazil)||ro|Romanian||ru|Russian
    sk|Slovak||sv|Swedish||tr|Turkish
    uk|Ukrainian||vi|Vietnamese||zh_CN|Simplified Chinese
    zh_TW|Traditional Chinese||||

    See `language.h` for the latest list of supported languages and their international language codes.
  comment: |-
    LCD LANGUAGE

    Select the language to display on the LCD. These languages are available:

    en, an, bg, ca, cz, da, de, el, el_CY, es, eu, fi, fr, gl, hg, hr, hu, id, it, jp_kana, ko_KR, nl, pl, pt, pt_br, ro, ru, sk, sv, tr, uk, vi, zh_CN, zh_TW
  options:
  - value: en
  - value: English
  - value: an
  - value: Aragonese
  - value: bg
  - value: Bulgarian
  - value: ca
  - value: Catalan
  - value: cz
  - value: Czech
  - value: da
  - value: Danish
  - value: de
  - value: German
  - value: el
  - value: Greek (Greece)
  - value: el_CY
  - value: Greek (Cyprus)
  - value: es
  - value: Spanish
  - value: eu
  - value: Basque-Euskera
  - value: fi
  - value: Finnish
  - value: fr
  - value: French
  - value: gl
  - value: Galician
  - value: hg
  - value: Hinglish (Hindi-Latin)
  - value: hr
  - value: Croatian
  - value: hu
  - value: Hungarian
  - value: id
  - value: Indonesian
  - value: it
  - value: Italian
  - value: jp_kana
  - value: Japanese
  - value: ko_KR
  - value: Korean (South Korea)
  - value: nl
  - value: Dutch
  - value: pl
  - value: Polish
  - value: pt
  - value: Portuguese
  - value: pt_br
  - value: Portuguese (Brazilian)
  - value: ro
  - value: Romanian
  - value: ru
  - value: Russian
  - value: sk
  - value: Slovak
  - value: sv
  - value: Swedish
  - value: tr
  - value: Turkish
  - value: uk
  - value: Ukrainian
  - value: vi
  - value: Vietnamese
  - value: zh_CN
  - value: Chinese (Simplified)
  - value: zh_TW
  - value: Chinese (Traditional)
- name: DISPLAY_CHARSET_HD44780
  file: Configuration.h
  type: enum
  default: JAPANESE
  brief: Character Display extended character set as determined by the hardware.
  long: |-
    ![LCD Character Set](/assets/images/config/lcd-charset.png){: .float-right .framed }

    This option applies only to character-based displays. Character-based displays (based on the Hitachi HD44780) provide an ASCII character set plus one of the following language extensions:

    - `JAPANESE` ... the most common
    - `WESTERN` .... with more accented characters
    - `CYRILLIC` ... for the Russian language

    To determine the language extension installed on your controller:

    - Compile and upload with `LCD_LANGUAGE` set to 'test'
    - Click the controller to view the LCD menu
    - The LCD will display Japanese, Western, or Cyrillic text

    See [LCD Language System](/docs/appendix/lcd_language.html) for in-depth info on how the Marlin display system currently works.
  comment: |-
    LCD Character Set

    Note: This option is NOT applicable to Graphical Displays.

    All character-based LCDs provide ASCII plus one of these language extensions:

    - JAPANESE ... the most common
    - WESTERN  ... with more accented characters
    - CYRILLIC ... for the Russian language

    To determine the language extension installed on your controller:

    - Compile and upload with `LCD_LANGUAGE` set to 'test'
    - Click the controller to view the LCD menu
    - The LCD will display Japanese, Western, or Cyrillic text

    - <https://marlinfw.org/docs/development/lcd_language.html>
  options:
  - value: JAPANESE
  - value: WESTERN
  - value: CYRILLIC
- name: LCD_INFO_SCREEN_STYLE
  file: Configuration.h
  type: int
  default: 0
  brief: HD44780 character display Info Screen style (0:Classic, 1:Průša, 2:CNC)
  long: 0 for classic; 1 for Průša info screen style.
  comment: Info Screen Style (0:Classic, 1:Průša, 2:CNC)
  options:
  - value: '0'
    label: Classic
  - value: '1'
    label: Průša
  - value: '2'
    label: CNC
- name: NO_LCD_MENUS
  file: Configuration.h
  type: switch
  disabled: true
  brief: Disable all menus and only display the Status Screen.
  long: Disable all menus and only display the Status Screen with `NO_LCD_MENUS`, or just remove some extraneous menu items to recover space with `SLIM_LCD_MENUS`.
  comment: |-
    LCD Menu Items

    Disable all menus and only display the Status Screen, or just remove some extraneous menu items to recover space.
- name: SLIM_LCD_MENUS
  file: Configuration.h
  type: switch
  disabled: true
  brief: Remove some extraneous menu items to recover space.
  shared_comment: |-
    LCD Menu Items

    Disable all menus and only display the Status Screen, or just remove some extraneous menu items to recover space.
- name: ENCODER_PULSES_PER_STEP
  file: Configuration.h
  type: int
  default: 4
  disabled: true
  brief: Number of pulses the encoder sends per increment of the encoder value.
  long: |-
    ![Encoder Knob](/assets/images/config/encoder.jpg){: .float-right .framed }

    This option overrides the default number of encoder pulses needed to produce one step. Should be increased for high-resolution encoders.
  comment: |-
    ENCODER SETTINGS

    This option overrides the default number of encoder pulses needed to produce one step. Should be increased for high-resolution encoders.
- name: ENCODER_STEPS_PER_MENU_ITEM
  file: Configuration.h
  type: int
  default: 1
  disabled: true
  brief: Number of encoder value increments per menu position.
  long: Use this option to override the number of step signals required to move between next/prev menu items.
  comment: Use this option to override the number of step signals required to move between next/prev menu items.
- name: REVERSE_ENCODER_DIRECTION
  file: Configuration.h
  type: switch
  disabled: true
  brief: If clockwise turns make edited values go down, enable this option.
  long: |-
    Test your encoder's behavior first with both of the following options disabled.

    - Reversed Value Edit and Menu Nav? Enable `REVERSE_ENCODER_DIRECTION`.
    - Reversed Menu Navigation only? Enable `REVERSE_MENU_DIRECTION`.
    - Reversed Value Editing only? Enable _BOTH_ options.

    This option reverses the encoder direction everywhere. Set if CLOCKWISE causes values to DECREASE.
  comment: |-
    This option reverses the encoder direction everywhere.

    Set this option if CLOCKWISE causes values to DECREASE
- name: REVERSE_MENU_DIRECTION
  file: Configuration.h
  type: switch
  disabled: true
  brief: Change the encoder direction required to move the menu highlight up/down.
  long: This option reverses the encoder direction for navigating LCD menus. If CLOCKWISE normally moves DOWN this makes it go UP. If CLOCKWISE normally moves UP this makes it go DOWN.
  comment: |-
    This option reverses the encoder direction for navigating LCD menus.

    If CLOCKWISE normally moves DOWN this makes it go UP. If CLOCKWISE normally moves UP this makes it go DOWN.
- name: REVERSE_SELECT_DIRECTION
  file: Configuration.h
  type: switch
  disabled: true
  brief: Change the encoder direction required to select options on a dialog screen.
  long: This option reverses the encoder direction for Select Screen If CLOCKWISE normally moves LEFT this makes it go RIGHT. If CLOCKWISE normally moves RIGHT this makes it go LEFT.
  comment: |-
    This option reverses the encoder direction for Select Screen.

    If CLOCKWISE normally moves LEFT this makes it go RIGHT. If CLOCKWISE normally moves RIGHT this makes it go LEFT.
- name: ENCODER_NOISE_FILTER
  file: Configuration.h
  type: switch
  disabled: true
  brief: Enable to filter out noise if the encoder has a messy signal or is experiencing interference.
  comment: |-
    Encoder EMI Noise Filter

    This option increases encoder samples to filter out phantom encoder clicks caused by EMI noise.
- name: ENCODER_SAMPLES
  file: Configuration.h
  type: int
  default: 10
  requires: ENCODER_NOISE_FILTER
  brief: Number of samples to use when filtering encoder noise.
- name: INDIVIDUAL_AXIS_HOMING_MENU
  file: Configuration.h
  type: switch
  disabled: true
  brief: Add individual axis homing items (Home X, Home Y, and Home Z) to the LCD menu.
  long: Add individual axis homing items (Home X, Home Y, and Home Z) to the LCD menu.
  comment: |-
    Individual Axis Homing

    Add individual axis homing items (Home X, Home Y, and Home Z) to the LCD menu.
- name: INDIVIDUAL_AXIS_HOMING_SUBMENU
  file: Configuration.h
  type: switch
  disabled: true
  brief: Put axis homing items in a sub-menu.
  shared_comment: |-
    Individual Axis Homing

    Add individual axis homing items (Home X, Home Y, and Home Z) to the LCD menu.
- name: SPEAKER
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    ![Piezo](/assets/images/config/piezo.png){: .float-right .framed }

    By default Marlin assumes you have a buzzer with a fixed frequency. If you have a speaker that can produce tones, enable it here.
  comment: |-
    SPEAKER/BUZZER

    If you have a speaker that can produce tones, enable it here. By default Marlin assumes you have a buzzer with a fixed frequency.
- name: LCD_FEEDBACK_FREQUENCY_DURATION_MS
  file: Configuration.h
  type: int
  default: 2
  disabled: true
  long: The duration and frequency for the UI feedback sound. Set these to 0 to disable audio feedback in the LCD menus. Test audio output with the G-code `M300 S<frequency Hz> P<duration ms>`
  comment: |-
    The duration and frequency for the UI feedback sound. Set these to 0 to disable audio feedback in the LCD menus.

    Note: Test audio output with the G-Code:

    - `M300` S&lt;frequency Hz&gt; P&lt;duration ms&gt;
- name: LCD_FEEDBACK_FREQUENCY_HZ
  file: Configuration.h
  type: int
  default: 5000
  disabled: true
  shared_comment: |-
    The duration and frequency for the UI feedback sound. Set these to 0 to disable audio feedback in the LCD menus.

    Note: Test audio output with the G-Code:

    - `M300` S&lt;frequency Hz&gt; P&lt;duration ms&gt;
- name: TONE_QUEUE_LENGTH
  file: Configuration.h
  type: int
  default: 4
  disabled: true
  comment: Tone queue size, used to keep beeps from blocking execution. Default is 4, or override here. Costs 4 bytes of SRAM per entry.
- name: STARTUP_TUNE
  file: Configuration.h
  type: int[]
  default: '{ 698, 300, 0, 50, 523, 50, 0, 25, 494, 50, 0, 25, 523, 100, 0, 50, 554, 300, 0, 100, 523, 300 }'
  disabled: true
  comment: A sequence of tones to play at startup, in pairs of tone (Hz), duration (ms). Silence in-between tones.
---

Options in the `interface` section of the Marlin configuration files.
