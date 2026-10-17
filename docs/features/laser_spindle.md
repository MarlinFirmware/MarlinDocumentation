---
title: Laser and Spindle Control
description: "How Marlin drives a laser, spindle or hot wire with M3, M4 and M5: power units, standard and inline power, safety timeout, setup and test firing."
parent: Features
nav_order: 34
layout: article
toc: true
---

# Laser and Spindle Control

Marlin can drive a cutting tool instead of an extruder. With one option it turns a motion system into a **laser
engraver or cutter** (a diode module or a CO2 tube on its own power supply), a **CNC router** whose spindle Marlin
switches on, off and sets the speed of, or a **hot-wire foam cutter** whose wire is heated through the same output.
In every case the CAM program (LightBurn, LaserGRBL, a CNC post-processor) sends [`M3`](/docs/gcode/M003.html),
[`M4`](/docs/gcode/M004.html) and [`M5`](/docs/gcode/M005.html) to set the tool power, and moves to say where to cut.

This page covers safety, what the firmware needs, how Marlin turns an `S` value into an output signal, the two ways
power can be timed (standard and inline), how to configure each kind of machine, what Marlin does with each G-code a
CAM program sends, how to test-fire safely, and what to do when it misbehaves. It replaces the older
version-specific guides for [Marlin 2.0.9](/docs/configuration/2.0.9/laser_spindle.html) and
[Marlin 1.1](/docs/configuration/1.1/laser_spindle.html) for current 2.1.x firmware. Every option is listed on the
[CNC settings](/docs/settings/cnc.html) page.

## Safety first

A laser or a spindle can blind, burn, cut or start a fire faster than you can react. Read this section before you
connect the tool.

{: .warning }
> **Eyes.** Laser light, including reflections from the work and the machine, can cause permanent eye damage before
> you feel anything. Everyone in the room needs goggles rated for your laser's wavelength and power, or the machine
> needs an enclosure that blocks that wavelength. Spindles throw chips: wear eye protection and clamp the work.

{: .warning }
> **Fire and fumes.** Cutting and engraving set material alight. Never leave a job running unattended, keep an
> extinguisher within reach, and keep the bed clear of scraps. Burning material gives off smoke that is harmful to
> breathe, and some plastics (PVC and vinyl among them) release corrosive, toxic gases. Vent the fumes outdoors and
> know what a material is before you cut it.

{: .warning }
> **Software can fail.** Marlin's safeguards (the [safety timeout](#the-laser-safety-timeout), shutdown on a kill or
> an aborted SD print, the coolant flow check) only work while the firmware runs normally. A crash, a reset, a
> floating enable pin or a failed MOSFET can leave the tool on. Fit an emergency stop and an interlock that cut the
> power to the laser supply or the spindle itself, not only the control signal.

During reset, and until Marlin starts and drives `SPINDLE_LASER_ENA_PIN` to its off level, that pin floats. The
firmware source says so plainly: the enable pin needs an external pull-up or pull-down resistor to its off level, or
the tool may switch on at power-up or when a host connects over USB (which usually resets the board).

## Requirements

- Exactly one of [`LASER_FEATURE`](/docs/settings/cnc.html#LASER_FEATURE) or
  [`SPINDLE_FEATURE`](/docs/settings/cnc.html#SPINDLE_FEATURE), in `Configuration_adv.h`. The build stops with
  **Enable only one of SPINDLE_FEATURE or LASER_FEATURE.** if both are on.
- A way to control the tool: an enable pin (`SPINDLE_LASER_ENA_PIN`), a PWM output
  ([`SPINDLE_LASER_USE_PWM`](/docs/settings/cnc.html#SPINDLE_LASER_USE_PWM) with `SPINDLE_LASER_PWM_PIN`), or a servo
  ([`SPINDLE_SERVO`](/docs/settings/cnc.html#SPINDLE_SERVO)). Many board pin files define the spindle/laser pins
  already. On RAMPS, for example, they default to PWM on pin 6, enable on pin 4 and direction on pin 5 when fewer
  than two servos are configured. Define the pin names in `Configuration_adv.h` to override them.
- With PWM, `SPINDLE_LASER_PWM_PIN` must be a hardware PWM pin, and must not be shared with an endstop, `Z_STEP_PIN`,
  a fan, the case light or a motor-current PWM pin. The build names the conflict (for example
  **SPINDLE_LASER_PWM_PIN conflicts with FAN0_PIN.**).
- Spindle direction ([`SPINDLE_CHANGE_DIR`](/docs/settings/cnc.html#SPINDLE_CHANGE_DIR)) needs `SPINDLE_DIR_PIN` and
  is for spindles only.
- [`LASER_POWER_TRAP`](/docs/settings/cnc.html#LASER_POWER_TRAP) needs `SPINDLE_LASER_USE_PWM`.
- [`LASER_SAFETY_TIMEOUT_MS`](/docs/settings/cnc.html#LASER_SAFETY_TIMEOUT_MS) must be shorter than
  [`DEFAULT_STEPPER_TIMEOUT_SEC`](/docs/settings/motion.html#DEFAULT_STEPPER_TIMEOUT_SEC).
- `LASER_FEATURE` doesn't work with [Fixed-Time Motion](/docs/features/ft_motion.html) when standard motion is
  turned off with [`NO_STANDARD_MOTION`](/docs/settings/motion_control.html#NO_STANDARD_MOTION).
- Air assist and fume extraction need `AIR_ASSIST_PIN` and `AIR_EVACUATION_PIN`. No board pin file defines these,
  so you must set them yourself. Coolant control needs `COOLANT_MIST_PIN` and/or `COOLANT_FLOOD_PIN`.

## How power control works

### The output signal

Marlin drives up to two signals:

- **Enable.** `SPINDLE_LASER_ENA_PIN` switches the tool on or off. Its "on" level is
  [`SPINDLE_LASER_ACTIVE_STATE`](/docs/settings/cnc.html#SPINDLE_LASER_ACTIVE_STATE) (default `LOW`).
- **PWM.** With `SPINDLE_LASER_USE_PWM`, `SPINDLE_LASER_PWM_PIN` carries a duty cycle from 0 (off) to 255 (always
  on). Most laser drivers read this as power; a spindle speed controller reads it as speed.
  [`SPINDLE_LASER_PWM_INVERT`](/docs/settings/cnc.html#SPINDLE_LASER_PWM_INVERT) (default `false`) flips it for
  drivers that run slower as the duty rises.
  [`SPINDLE_LASER_FREQUENCY`](/docs/settings/cnc.html#SPINDLE_LASER_FREQUENCY) (default 2500 Hz) sets the PWM
  frequency on HALs that can change it (the configuration names AVR, ESP32 and LPC); on a laser it can also be
  changed from the LCD.

Without PWM, any power above zero turns the tool fully on. With `SPINDLE_SERVO`, the power is sent as a servo angle
instead. At startup Marlin sets the enable pin to off, the PWM output to its off level, and air assist and fume
extraction off.

### Power units

The `S` parameter of `M3`, `M4` and inline `G1` moves is read in the unit set by
[`CUTTER_POWER_UNIT`](/docs/settings/cnc.html#CUTTER_POWER_UNIT) (default `PWM255`):

| Unit | `S` range | Typical use |
|---|---|---|
| `PWM255` | 0–255 | Lasers; matches CAM programs set to a maximum S of 255 |
| `PERCENT` | 0–100 | Lasers driven by CAM set to a maximum S of 100 |
| `RPM` | `SPEED_POWER_MIN`–`SPEED_POWER_MAX` | Spindles with a known speed range |

Set the CAM program's maximum `S` to match. A program that sends `S1000` to a `PWM255` machine is clamped to
full power on every line.

The three [`SPEED_POWER_*`](/docs/settings/cnc.html#SPEED_POWER_N) values describe the tool. Their units depend on
the tool:

- **Laser:** percent. `SPEED_POWER_MIN` 0, `SPEED_POWER_MAX` 100, `SPEED_POWER_STARTUP` 80.
- **Spindle:** RPM. `SPEED_POWER_MIN` 5000, `SPEED_POWER_MAX` 30000, `SPEED_POWER_STARTUP` 25000.

Marlin clamps every `S` above zero into the MIN–MAX range, and `S0` always means off. For a laser in `PWM255`
units, `S` is clamped between the PWM values of `SPEED_POWER_MIN` and `SPEED_POWER_MAX` percent. For a spindle in
`RPM` units, `S` is clamped to 5000–30000 and converted to a duty cycle as `S ÷ SPEED_POWER_MAX`, so `S5000` gives
about 17 % duty. With [`CUTTER_POWER_RELATIVE`](/docs/settings/cnc.html#CUTTER_POWER_RELATIVE) the range is
stretched instead: `SPEED_POWER_MIN` gives 0 % duty and `SPEED_POWER_MAX` 100 %, which suits controllers such as the
SuperPID that map their whole input to a speed band.

The `O` parameter bypasses all of this: `M3 O128` sets the PWM duty directly, 0–255, without the MIN/MAX clamp.

`M3` or `M4` with neither `S` nor `O`, in standard mode, uses `SPEED_POWER_STARTUP`. For a laser that is 80 %.

### Standard mode and inline mode

![Three power-over-time strips. Standard mode: M3 waits for moves, turns on while the axes are stopped, holds the power through the G1 moves until M5. Continuous inline mode: each G1 carries its own power and G0 travel is unpowered. Inline mode with LASER_POWER_TRAP: each G1's power ramps up and down with the move's speed, never below the SPEED_POWER_MIN floor](/assets/images/features/laser-power-modes.svg){: .framed }

Marlin times the tool power in one of three modes. It starts in standard mode after every reset.

**Standard mode** is how a spindle works, and how a laser works until you ask for more. `M3` and `M4` first wait
for every queued move to finish, then set the power at once, while the machine stands still. The moves that follow
run at that power. `M5` waits for the moves to finish and turns the tool off. The wait means each `M3`/`M5` stops the
machine for a moment, and on a laser the beam is on while nothing moves, which burns a dot where the cut starts.

**Inline mode** (laser only) puts the power into each move instead. Marlin's planner stores a power level in every
queued move, and the stepper code applies it the instant that move starts, so the power changes exactly where the
move begins with no pause.

- `M3 I` selects **continuous** inline mode. The output is enabled with power 0.
- An `S` on a `G1`, or on `G2`/`G3` (with [`ARC_SUPPORT`](/docs/settings/motion.html#ARC_SUPPORT)) or `G5` (with
  Bézier curve support), sets the power for that move and every powered move after it.
- A `G0` is always unpowered, and it also resets the stored power to 0. **The first `G1` after a `G0` needs its own
  `S`**, or it runs at zero power. `G28` doesn't fire the laser in this mode.
- `M3 S<power>` without `I` while in inline mode waits for the moves to finish and sets the power for the next
  moves. With [`LASER_POWER_SYNC`](/docs/settings/cnc.html#LASER_POWER_SYNC) it doesn't wait: the new power is
  queued and takes effect when the moves ahead of it are done.
- `M5` waits for the moves, turns the output off and stays in inline mode. `M5 I` also returns to standard mode.

After the last move of a job the power of that move stays on until `M5`, the next `G0`, or the safety timeout.
End every job with `M5`.

`M4 I` selects **dynamic** inline mode. Here the power of each move comes from its feed rate alone: the `F` value in
mm/min divided by 256, so `F6000` gives a PWM value of 23 (about 9 %), and anything above `F65535` is full power. The
`S` value doesn't set the power in this mode, and the laser turns off whenever no move is running. The firmware
source marks this mode as experimental.

{: .note }
> The character LCD status line shows the cutter as `Laser: <power> On|Off <mode>`, where the mode letter is `S`
> (standard), `C` (continuous inline), `D` (dynamic) or `!` (error, after a coolant flow fault).

### The power trapezoid

A move speeds up at its start and slows down at its end, so at constant power the laser delivers more energy per
millimeter at the ends, which shows as darker or deeper spots at corners and line ends.
[`LASER_POWER_TRAP`](/docs/settings/cnc.html#LASER_POWER_TRAP) scales the power with the speed during these ramps,
in continuous inline mode:

- A move starts at a power proportional to its entry speed over its full speed, and steps up as it accelerates.
- It holds the `S` power while cruising.
- It steps down while decelerating, to a power proportional to its exit speed.
- The power never drops below a floor of `SPEED_POWER_MIN` percent. On a CO2 tube, which doesn't fire below a
  certain level, set `SPEED_POWER_MIN` to the lowest power at which your tube fires, so the ramps don't go dark.

The ramps are approximate (the PWM has only 256 steps), and arcs work poorly because their segments are too short to
ramp.

### The laser safety timeout

With `LASER_FEATURE`, [`LASER_SAFETY_TIMEOUT_MS`](/docs/settings/cnc.html#LASER_SAFETY_TIMEOUT_MS) (default
1000 ms) turns the laser off when it is on and nothing has moved for that long. The timer restarts whenever moves are
queued and on every `M3` or `M4`. It applies in every mode. In standard mode it also clears the power, so the
laser stays off until the next `M3` or `M4`; in inline mode the next powered move turns it back on.

This is a choice with a trade-off:

- A **short** timeout limits how long a stopped beam can burn into the work if the host stalls or a job ends without
  `M5`, but it also cuts off an intentional stationary burn, such as `M3` followed by a `G4` dwell to pierce
  material, when the dwell is longer than the timeout.
- A **long** timeout allows such dwells but lets a stopped beam burn for longer. Setting it to 0 turns the check
  off, which removes the protection entirely.

Spindles have no such timeout. A spindle keeps running until `M5`, a kill, or an aborted SD print.

## Configure

All options below are in `Configuration_adv.h` unless noted. Defaults are quoted from the current `bugfix-2.1.x`
source.

### Laser engraver or cutter

```cpp
#define LASER_FEATURE
#define SPINDLE_LASER_ACTIVE_STATE  LOW     // or HIGH, to match the driver's enable input
#define SPINDLE_LASER_USE_PWM
#define SPINDLE_LASER_PWM_INVERT    false
#define SPINDLE_LASER_FREQUENCY     2500    // (Hz) check the laser driver's datasheet
#define CUTTER_POWER_UNIT PWM255           // or PERCENT, to match the CAM program
```

1. Enable `LASER_FEATURE` and keep `SPINDLE_LASER_USE_PWM` on unless the laser only has an on/off input.
2. Check which pins the board uses for `SPINDLE_LASER_PWM_PIN` and `SPINDLE_LASER_ENA_PIN`, and wire the laser
   driver's PWM (often labeled TTL) and enable inputs to them. Set `SPINDLE_LASER_ACTIVE_STATE` to the level the
   enable input needs. Fan and heater connectors on most boards are switched supply-voltage outputs, not logic
   signals; check the driver's input rating before using one.
3. Pick `CUTTER_POWER_UNIT` to match the CAM program's S range, and set the same maximum in the CAM program.
4. Leave `SPEED_POWER_MIN` at 0 for a diode laser. For a CO2 tube that won't strike at low power, raise it (it is
   the floor for `LASER_POWER_TRAP` and the bottom of the clamp). `SPEED_POWER_STARTUP` is the power an `M3` with no
   `S` uses, and the power of the LCD test pulse when no power is set.
5. Enable [`GCODE_MOTION_MODES`](/docs/settings/gcode.html#GCODE_MOTION_MODES) in `Configuration_adv.h` if the CAM
   program writes lines that start with a coordinate (`X12.5 Y3 S120`) instead of a `G1`. Marlin then repeats the
   last `G0`/`G1`/`G2`/`G3`/`G5` for such lines.
6. Optional: `LASER_POWER_SYNC` for CAM output that sends `M3 S` between moves in inline mode, and `LASER_POWER_TRAP`
   for even power on short, accelerating moves.
7. Optional: air assist, fume extraction, a coolant flow meter and an ammeter
   ([see below](#air-coolant-and-fume-extraction)).

The LCD's **Laser Control** menu (main menu) holds **Laser Power**, **Toggle Laser**, **Test Pulse ms**,
**Fire Pulse**, **Frequency** (2000–65535 Hz, where the HAL can set it), and **Toggle Blower** and **Air Assist**
when those features are enabled.

### Spindle (CNC router)

```cpp
#define SPINDLE_FEATURE
#define SPINDLE_LASER_USE_PWM
#define CUTTER_POWER_UNIT RPM
//#define CUTTER_POWER_RELATIVE           // controller maps its whole input to MIN..MAX
//#define SPINDLE_CHANGE_DIR              // controller has a direction input
#define SPINDLE_INVERT_DIR          false
#define SPEED_POWER_MIN          5000    // (RPM)
#define SPEED_POWER_MAX         30000    // (RPM)
#define SPEED_POWER_STARTUP     25000    // (RPM) M3/M4 with no S
```

1. Enable `SPINDLE_FEATURE`. Use `RPM` units so the CAM program's spindle speeds go through unchanged.
2. Set `SPEED_POWER_MIN` and `SPEED_POWER_MAX` to the speed controller's range. If the controller treats 0 V as its
   lowest speed and full PWM as its highest, enable `CUTTER_POWER_RELATIVE`; if 0 V means stopped and the speed rises
   from there, leave it off.
3. For a controller with a direction input, enable `SPINDLE_CHANGE_DIR` and define `SPINDLE_DIR_PIN`. `M3` runs
   clockwise and `M4` counter-clockwise; flip [`SPINDLE_INVERT_DIR`](/docs/settings/cnc.html#SPINDLE_INVERT_DIR) if
   they're reversed. Without `SPINDLE_CHANGE_DIR`, `M3` and `M4` do the same thing.
4. Optional: [`DEFAULT_ACCELERATION_SPINDLE`](/docs/settings/cnc.html#DEFAULT_ACCELERATION_SPINDLE) (default 1000
   °/s², commented out) ramps the PWM output one step at a time instead of jumping, and `M3` doesn't return until the
   ramp is done. It can be changed from the LCD as **Spindle Accel**.

{: .important }
> In the current source, `M3` and `M5` don't wait for
> [`SPINDLE_LASER_POWERUP_DELAY`](/docs/settings/cnc.html#SPINDLE_LASER_POWERUP_DELAY) or
> [`SPINDLE_LASER_POWERDOWN_DELAY`](/docs/settings/cnc.html#SPINDLE_LASER_POWERDOWN_DELAY), and the spindle isn't
> stopped before a direction change even with
> [`SPINDLE_CHANGE_DIR_STOP`](/docs/settings/cnc.html#SPINDLE_CHANGE_DIR_STOP). Have the CAM post-processor add a
> [`G4`](/docs/gcode/G004.html) dwell after `M3` so the spindle reaches speed before the first cut, and send `M5`
> plus a dwell before switching between `M3` and `M4`.

The LCD's **Spindle Control** menu holds **Spindle Pwr**, **Toggle Spindle**, **Toggle Vacuum** (with
`AIR_EVACUATION`) and, while the spindle is off, an item showing **Spindle Forward** or **Spindle Reverse** that
switches the direction.

### Hot-wire foam cutter

[`FOAMCUTTER_XYUV`](/docs/settings/kinematics.html#FOAMCUTTER_XYUV) in `Configuration.h` sets up the four-axis
kinematics (X and Y for one end of the wire, I and J for the other) and needs the I and J axes enabled. The wire is
heated through the cutter output, so enable `LASER_FEATURE` or `SPINDLE_FEATURE` as well. On a RAMPS board with
`FOAMCUTTER_XYUV`, the cutter PWM output moves to pin 8, the MOSFET normally used for the heated bed.

Which feature to choose is a trade-off:

- `SPINDLE_FEATURE` keeps the wire hot while the machine stands still (no safety timeout), so it can preheat before
  the first move. It has no inline modes.
- `LASER_FEATURE` turns the wire off one second after motion stops (the default safety timeout), which protects the
  foam if a job stalls but cuts off any preheat dwell longer than the timeout.

### Air, coolant and fume extraction

| Feature | Commands | What Marlin does |
|---|---|---|
| [`AIR_ASSIST`](/docs/settings/cnc.html#AIR_ASSIST) | [`M8`](/docs/gcode/M007-M009.html) on, `M9` off | Waits for queued moves, then switches `AIR_ASSIST_PIN` (active level [`AIR_ASSIST_ACTIVE`](/docs/settings/cnc.html#AIR_ASSIST_ACTIVE), default `LOW`). LCD item **Air Assist**. |
| [`AIR_EVACUATION`](/docs/settings/cnc.html#AIR_EVACUATION) | [`M10`](/docs/gcode/M010-M011.html) on, `M11` off | Switches `AIR_EVACUATION_PIN` (default active `LOW`) **at once**, without waiting for queued moves. LCD item **Toggle Blower** (laser) or **Toggle Vacuum** (spindle). |
| [`COOLANT_CONTROL`](/docs/settings/cnc.html#COOLANT_CONTROL) | `M7` mist, `M8` flood, `M9` all off | Waits for queued moves, then switches `COOLANT_MIST_PIN` / `COOLANT_FLOOD_PIN`. Enable [`COOLANT_MIST`](/docs/settings/cnc.html#COOLANT_MIST) and/or [`COOLANT_FLOOD`](/docs/settings/cnc.html#COOLANT_FLOOD); the `_INVERT` options flip the levels. |

`M8` and `M9` drive both air assist and flood coolant when both are enabled. Because `M10` doesn't wait, put it
before the job's first move, not between cuts, if the timing matters.

For CO2 lasers with water cooling:

- [`LASER_COOLANT_FLOW_METER`](/docs/settings/cnc.html#LASER_COOLANT_FLOW_METER) counts pulses from a flow sensor on
  `FLOWMETER_PIN` (an interrupt-capable pin) and computes liters per minute every `FLOWMETER_INTERVAL` (1000 ms),
  using `FLOWMETER_PPL` (5880 pulses per liter).
- With [`FLOWMETER_SAFETY`](/docs/settings/cnc.html#FLOWMETER_SAFETY), a flow below
  [`FLOWMETER_MIN_LITERS_PER_MINUTE`](/docs/settings/cnc.html#FLOWMETER_MIN_LITERS_PER_MINUTE) (1.5) disables the
  laser, puts the cutter in error mode, shows **Coolant Flow Fault** on the LCD (with a beep if the laser was on),
  and refuses every G-code with `Coolant flow fault. Flowmeter safety is active. Attention required.` The check runs
  from power-up, so start the coolant before you send commands. **Flow Safety** in the LCD Temperature menu turns
  the check off and on. After the flow is restored, send `M5 I` to return the cutter to standard mode.
- A cooler with its own temperature sensor (`TEMP_SENSOR_COOLER`, which requires `LASER_FEATURE`) is set with
  [`M143`](/docs/gcode/M143.html).
- [`I2C_AMMETER`](/docs/settings/cnc.html#I2C_AMMETER) reads the laser current from an INA226 module and shows it on
  the status screen.

### Laser on a fan output

Some add-on laser modules plug into a fan connector and are driven with [`M106`](/docs/gcode/M106.html) /
[`M107`](/docs/gcode/M107.html) instead of `M3`/`M5`. Marlin normally applies fan speeds "soon after" the move they
belong to. [`LASER_SYNCHRONOUS_M106_M107`](/docs/settings/cnc.html#LASER_SYNCHRONOUS_M106_M107) queues each fan change
in the planner so it takes effect exactly between moves. It needs
[`FAN_KICKSTART_TIME`](/docs/settings/fans.html#FAN_KICKSTART_TIME) and [`FAN_MIN_PWM`](/docs/settings/fans.html#FAN_MIN_PWM)
set to 0, or the laser would fire at full power on every kickstart, or never turn off. This is separate from
`LASER_FEATURE` and has none of its safeguards. Use it only when the laser can't be wired to a cutter output.

## The G-codes a CAM program sends

| G-code | What Marlin does |
|---|---|
| [`M3`](/docs/gcode/M003.html) `S` / `O` | Standard mode: wait for moves, then tool on at `S` (in `CUTTER_POWER_UNIT`) or `O` (raw PWM 0–255); `SPEED_POWER_STARTUP` if neither is given. Spindle: clockwise. Inline mode: set the power for the next moves. |
| `M3 I` | Laser: enter continuous inline mode with power 0. |
| [`M4`](/docs/gcode/M004.html) `S` / `O` | As `M3`. Spindle with `SPINDLE_CHANGE_DIR`: counter-clockwise. |
| `M4 I` | Laser: enter dynamic inline mode (power from feed rate). |
| [`M5`](/docs/gcode/M005.html) | Wait for moves, then tool off. Inline mode stays on. |
| `M5 I` | As `M5`, and return to standard mode. |
| [`G0`](/docs/gcode/G000-G001.html) | Inline mode: an unpowered move; the stored power becomes 0. |
| [`G1`](/docs/gcode/G000-G001.html) `S` | Inline mode: a move at power `S`; later moves keep that power. An `I` on the move also enables inline output (kept for LightBurn compatibility). |
| [`G2`/`G3`](/docs/gcode/G002-G003.html), [`G5`](/docs/gcode/G005.html) `S` | As `G1`, for arcs and Bézier curves when those are enabled. |
| [`G4`](/docs/gcode/G004.html) | Dwell. In standard mode the tool stays on, until the laser safety timeout. |
| [`M7`/`M8`/`M9`](/docs/gcode/M007-M009.html) | Coolant mist / flood or air assist on, all off (after queued moves). |
| [`M10`/`M11`](/docs/gcode/M010-M011.html) | Fume extraction on / off (at once). |

A typical laser job in continuous inline mode:

```gcode
M3 I              ; continuous inline mode, power 0
M8                ; air assist on
G0 X10 Y10        ; travel, laser off
G1 X50 S180 F1500 ; cut at S180
G1 Y50            ; same power
G0 X10 Y60        ; travel; stored power is now 0
G1 X50 S120       ; the first G1 after a G0 needs its own S
M5 I              ; off, back to standard mode
M9                ; air assist off
```

A typical spindle job:

```gcode
M3 S12000         ; wait for moves, spindle on clockwise at 12000 RPM
G4 S5             ; let the spindle reach speed
G1 Z-1 F100       ; plunge
G1 X40 F600       ; cut
G0 Z5             ; retract
M5                ; spindle off
```

## Test-fire safely

Test at low power on scrap, before running a job, after any change to wiring or to the options above.

1. Put on your goggles, close the enclosure, and place scrap material under the laser at its focus height. Have
   the emergency stop within reach.
2. If you can, check the signals first with the laser's power supply off: measure the enable pin and PWM pin with a
   meter while you switch the laser on and off from the LCD. The enable pin must sit at its off level whenever the
   laser is off, including during a reset.
3. In **Laser Control**, set **Laser Power** to a low value (for example 5 % or `13` in `PWM255` units) and leave
   **Test Pulse ms** at its default of 50 ms (the range is 1–999 ms).
4. Choose **Fire Pulse**. Marlin beeps, then fires once for the pulse time at the Laser Power value. If Laser Power
   is 0 it fires at `SPEED_POWER_STARTUP` instead, which is 80 % by default, so set the power first. Fire Pulse
   switches the cutter to standard mode.
5. Look for a small mark. Raise the power in small steps until it marks reliably. If the mark gets weaker as the
   power rises, flip `SPINDLE_LASER_PWM_INVERT`.
6. Then test a move from the host, which exercises the inline path a CAM program uses:

   ```gcode
   M3 I
   G0 X10 Y10
   G1 X30 S10 F600
   G0 X10 Y15
   M5 I
   ```

   You should see a 20 mm line at low power and no mark along the `G0` travel.

Without an LCD, `M3 S13` followed by `M5` gives a short burst from the host. Even if you forget the `M5`, the safety
timeout turns the laser off after `LASER_SAFETY_TIMEOUT_MS`, but don't rely on that.

For a spindle, remove the cutter or keep the bit well clear of the work, then send `M3` at the lowest useful speed,
check the direction and the speed, and `M5`.

## Troubleshooting

| What you see | Likely cause | What to do |
|---|---|---|
| The laser flashes or the spindle twitches at power-up, at reset, or when a host connects | The enable pin floats until Marlin starts | Fit a pull resistor that holds the enable input at its off level. Check `SPINDLE_LASER_ACTIVE_STATE`. |
| The tool is on when it should be off, and off at full power | Enable level or PWM sense is inverted | Flip `SPINDLE_LASER_ACTIVE_STATE` or `SPINDLE_LASER_PWM_INVERT`. |
| Power is either off or full, nothing between | `SPINDLE_LASER_USE_PWM` is off, the driver is wired to the enable pin only, or `S` is far above the unit's range | Enable PWM and wire the driver's PWM input. Match `CUTTER_POWER_UNIT` and the CAM program's maximum S. |
| A burned dot at the start and end of each cut, and the machine pauses at each `M3`/`M5` | Standard mode: power changes while the machine stands still | Use inline mode (`M3 I` in the CAM header, `S` on each `G1`). |
| After a travel move, the next cut is blank | In inline mode a `G0` sets the stored power to 0 | Have the CAM program put an `S` on the first `G1` after each `G0`, or use `LASER_POWER_SYNC` with `M3 S`. |
| The laser turns off about a second after `M3` from the console, or during a long `G4` | The laser safety timeout | Expected. Send moves after `M3`, or raise `LASER_SAFETY_TIMEOUT_MS` with care. |
| Darker or deeper spots at corners and line ends | Constant power while the move slows down | Enable `LASER_POWER_TRAP`, or lower the acceleration. |
| Lines in the file that start with `X`/`Y` do nothing | Marlin needs a G-code on each line | Enable `GCODE_MOTION_MODES`, or set the CAM program to write `G1` on every line. |
| Every command is refused with `Coolant flow fault. Flowmeter safety is active. Attention required.` | The measured flow is below `FLOWMETER_MIN_LITERS_PER_MINUTE`, or the sensor isn't on `FLOWMETER_PIN` | Start the pump; check the sensor and `FLOWMETER_PPL`. Then `M5 I`. **Flow Safety** in the Temperature menu turns the check off for diagnosis. |
| The spindle starts cutting before it is at speed, or reverses while spinning | `M3` doesn't wait for spin-up, and direction changes don't stop the spindle | Add `G4` after `M3`; send `M5` and `G4` before switching between `M3` and `M4`. |
| Spindle speed doesn't match `S` | `SPEED_POWER_MIN`/`MAX` don't match the controller, or `CUTTER_POWER_RELATIVE` is set wrongly | Measure the speed at two `S` values and adjust the range or the relative setting. |
| Build error: **Enable only one of SPINDLE_FEATURE or LASER_FEATURE.** | Both are enabled | Keep one. |
| Build error: **SPINDLE_LASER_PWM_PIN not assigned to a PWM pin.** or **…conflicts with …** | The pin can't do hardware PWM, or another function uses it | Choose another hardware PWM pin, or disable the conflicting function. [`M43`](/docs/gcode/M043.html) with [`PINS_DEBUGGING`](/docs/settings/develop.html#PINS_DEBUGGING) lists pins. |
| Build error: **(SPINDLE\|LASER)_FEATURE requires SPINDLE_LASER_ENA_PIN, SPINDLE_LASER_USE_PWM, or SPINDLE_SERVO to control the power.** | The board defines no cutter pins | Define `SPINDLE_LASER_ENA_PIN` and/or `SPINDLE_LASER_PWM_PIN`. |
| Build error: **No auto-assignable Spindle/Laser pins available.** (RAMPS) | Two or more servos and no free AUX-2 pins | Define the cutter pins yourself. |
| Build error: **LASER_MOVE_G0_OFF is no longer required, G0 and G28 cannot apply power.** | A configuration from Marlin 2.0.9 | Remove `LASER_MOVE_G0_OFF`, `LASER_MOVE_G28_OFF` and `LASER_MOVE_POWER`. |

## Pitfalls

- An `M3` with no `S` fires a laser at `SPEED_POWER_STARTUP`, 80 % by default. Always give an `S` in hand-written
  G-code.
- Inline mode lasts until `M5 I` or a reset. A job that ends with plain `M5` leaves the next job in inline mode,
  and an LCD Fire Pulse leaves it in standard mode. Start every job with the mode it needs (`M3 I` in the CAM
  header).
- Standard mode is meant for spindles and simple on/off tools. For a laser, use inline mode, where `G0` travel is
  never powered.
- `M10`/`M11` act immediately, while `M7`/`M8`/`M9` and `M3`/`M5` wait for queued moves.
- The firmware's safeguards are not an interlock. Keep the hardware emergency stop and never leave the machine
  running alone.

## Related G-codes

- [`M3`](/docs/gcode/M003.html), [`M4`](/docs/gcode/M004.html), [`M5`](/docs/gcode/M005.html): tool on, power, mode,
  off
- [`G0`/`G1`](/docs/gcode/G000-G001.html), [`G2`/`G3`](/docs/gcode/G002-G003.html), [`G5`](/docs/gcode/G005.html):
  moves, with inline `S` power
- [`G4`](/docs/gcode/G004.html): dwell, for spindle spin-up
- [`M7`–`M9`](/docs/gcode/M007-M009.html): coolant and air assist
- [`M10`/`M11`](/docs/gcode/M010-M011.html): fume extraction
- [`M106`](/docs/gcode/M106.html), [`M107`](/docs/gcode/M107.html): fan-driven lasers with
  `LASER_SYNCHRONOUS_M106_M107`
- [`M143`](/docs/gcode/M143.html): laser cooler temperature
