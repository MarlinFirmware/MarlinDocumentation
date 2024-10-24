---
title: Filament Runout Sensor
description: Detect the presence of filament in the extruder and handle filament runout.
tag: runout

author: thinkyhead
category: [ features, runout ]

code: |
  /**
   * @section filament runout sensors
   *
   * Filament Runout Sensors
   * Mechanical or opto endstops are used to check for the presence of filament.
   *
   * IMPORTANT: Runout will only trigger if Marlin is aware that a print job is running.
   * Marlin knows a print job is running when:
   *  1. Running a print job from media started with M24.
   *  2. The Print Job Timer has been started with M75.
   *  3. The heaters were turned on and PRINTJOB_TIMER_AUTOSTART is enabled.
   *
   * RAMPS-based boards use SERVO3_PIN for the first runout sensor.
   * For other boards you may need to define FIL_RUNOUT_PIN, FIL_RUNOUT2_PIN, etc.
   */
  //#define FILAMENT_RUNOUT_SENSOR
  #if ENABLED(FILAMENT_RUNOUT_SENSOR)
    #define FIL_RUNOUT_ENABLED_DEFAULT true // Enable the sensor on startup. Override with M412 followed by M500.
    #define NUM_RUNOUT_SENSORS   1          // Number of sensors, up to one per extruder. Define a FIL_RUNOUT#_PIN for each.

    #define FIL_RUNOUT_STATE     LOW        // Pin state indicating that filament is NOT present.
    #define FIL_RUNOUT_PULLUP               // Use internal pullup for filament runout pins.
    //#define FIL_RUNOUT_PULLDOWN           // Use internal pulldown for filament runout pins.
    //#define WATCH_ALL_RUNOUT_SENSORS      // Execute runout script on any triggering sensor, not only for the active extruder.
                                            // This is automatically enabled for MIXING_EXTRUDERs.

    // Override individually if the runout sensors vary
    //#define FIL_RUNOUT1_STATE LOW
    //#define FIL_RUNOUT1_PULLUP
    //#define FIL_RUNOUT1_PULLDOWN

    //#define FIL_RUNOUT2_STATE LOW
    //#define FIL_RUNOUT2_PULLUP
    //#define FIL_RUNOUT2_PULLDOWN

    //#define FIL_RUNOUT3_STATE LOW
    //#define FIL_RUNOUT3_PULLUP
    //#define FIL_RUNOUT3_PULLDOWN

    //#define FIL_RUNOUT4_STATE LOW
    //#define FIL_RUNOUT4_PULLUP
    //#define FIL_RUNOUT4_PULLDOWN

    //#define FIL_RUNOUT5_STATE LOW
    //#define FIL_RUNOUT5_PULLUP
    //#define FIL_RUNOUT5_PULLDOWN

    //#define FIL_RUNOUT6_STATE LOW
    //#define FIL_RUNOUT6_PULLUP
    //#define FIL_RUNOUT6_PULLDOWN

    //#define FIL_RUNOUT7_STATE LOW
    //#define FIL_RUNOUT7_PULLUP
    //#define FIL_RUNOUT7_PULLDOWN

    //#define FIL_RUNOUT8_STATE LOW
    //#define FIL_RUNOUT8_PULLUP
    //#define FIL_RUNOUT8_PULLDOWN

    // Commands to execute on filament runout.
    // With multiple runout sensors use the %c placeholder for the current tool in commands (e.g., "M600 T%c")
    // NOTE: After 'M412 H1' the host handles filament runout and this script does not apply.
    #define FILAMENT_RUNOUT_SCRIPT "M600"

    // After a runout is detected, continue printing this length of filament
    // before executing the runout script. Useful for a sensor at the end of
    // a feed tube. Requires 4 bytes SRAM per sensor, plus 4 bytes overhead.
    //#define FILAMENT_RUNOUT_DISTANCE_MM 25

    #ifdef FILAMENT_RUNOUT_DISTANCE_MM
      // Enable this option to use an encoder disc that toggles the runout pin
      // as the filament moves. (Be sure to set FILAMENT_RUNOUT_DISTANCE_MM
      // large enough to avoid false positives.)
      //#define FILAMENT_MOTION_SENSOR

      #if ENABLED(FILAMENT_MOTION_SENSOR)
        //#define FILAMENT_SWITCH_AND_MOTION
        #if ENABLED(FILAMENT_SWITCH_AND_MOTION)
          #define NUM_MOTION_SENSORS   1          // Number of sensors, up to one per extruder. Define a FIL_MOTION#_PIN for each.
          //#define FIL_MOTION1_PIN    -1

          // Override individually if the motion sensors vary
          //#define FIL_MOTION1_STATE LOW
          //#define FIL_MOTION1_PULLUP
          //#define FIL_MOTION1_PULLDOWN

          //#define FIL_MOTION2_STATE LOW
          //#define FIL_MOTION2_PULLUP
          //#define FIL_MOTION2_PULLDOWN

          //#define FIL_MOTION3_STATE LOW
          //#define FIL_MOTION3_PULLUP
          //#define FIL_MOTION3_PULLDOWN

          //#define FIL_MOTION4_STATE LOW
          //#define FIL_MOTION4_PULLUP
          //#define FIL_MOTION4_PULLDOWN

          //#define FIL_MOTION5_STATE LOW
          //#define FIL_MOTION5_PULLUP
          //#define FIL_MOTION5_PULLDOWN

          //#define FIL_MOTION6_STATE LOW
          //#define FIL_MOTION6_PULLUP
          //#define FIL_MOTION6_PULLDOWN

          //#define FIL_MOTION7_STATE LOW
          //#define FIL_MOTION7_PULLUP
          //#define FIL_MOTION7_PULLDOWN

          //#define FIL_MOTION8_STATE LOW
          //#define FIL_MOTION8_PULLUP
          //#define FIL_MOTION8_PULLDOWN
        #endif
      #endif
    #endif
  #endif // FILAMENT_RUNOUT_SENSOR

---
