---
title: Model Predictive Temperature Control
description: Control temperatures using a physical model of the system

author: tombrazier
category: [ features ]
since: 2.0.9.4
---

<script>
MathJax = { tex: { tags: 'all' } };
</script>
<script type="text/javascript" id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
</script>

## Background

Temperature is commonly controlled with a PID algorithm. The basic premise of PID is that the further the temperature is from the set-point, the more power is applied. If you could supply PID with perfect temperature information, it could, in principle, apply perfect control. However real life temperature information comes from sensors which exhibit both latency and noise.

Model predictive control takes a different approach to PID. Instead of trying to control against the sensor output, it maintains a simulation of the system and uses the simulated hotend temperature to plan an optimal power output. The simulation has no noise and no latency, making near perfect control possible. To prevent the simulated system state diverging from the real life hotend state, the simulated temperature is continually gently dragged towards the temperature measure from the sensor. This does introduce a little noise and latency into the simulated system but the effect is far smaller than for PID.

Configure with [`M306`](/docs/gcode/M306.html).

## Advantages

- Easy to configure.
- Stable.
- Responsive.
- Controls the actual hotend temperature, rather than the sensor temperature.
- Easily models heat losses to part cooling fan and filament. No need for `PID_EXTRUSION_SCALING` and `PID_FAN_SCALING`.

## Configuration

1. Disable `PIDTEMP` and enable `MPCTEMP` in `Configuration.h`.
1. Set your heater power(s) in `MPC_HEATER_POWER`.
1. Ensure `MPC_TUNING_POS` leaves space not to crash into the bed. During tuning the printer will home and then position the hotend just above the bed. The ideal Z position is around first layer height.
1. Install the firmware and run `M306 T` to tune the active hotend. (Look out for cooled blobs on the nozzle to avoid a collision with the bed.)
1. Save MPC constants with `M500` and/or set them in Configuration.h.
1. Set a hotend temperature to give it a test.

Example output from `M306 T`:
```
MPC Autotune start for E0
Cooling to ambient
Heating to over 200C
Measuring ambient heat-loss at 209.64
MPC Autotune finished! Put the constants below into Configuration.h
MPC_BLOCK_HEAT_CAPACITY 18.42
MPC_SENSOR_RESPONSIVENESS 0.2176
MPC_AMBIENT_XFER_COEFF 0.0664
MPC_AMBIENT_XFER_COEFF_FAN255 0.0998
```

[`M306`](/docs/gcode/M306.html) can also be used to change constants at runtime.

### Manual Tuning

If `M306 T` doesn't work –e.g., with positive temperature coefficient (PTC) hotends– MPC can be configured manually.

1. Start with the part cooling fan off and hotend cold. Record the starting temperature Ts. e.g., Ts = 20°C.
1. Set the temperature to 200°C and then back to 0°C once it reaches around 200°C. Measure the curve of temperature
vs time while the hotend is heating, starting at time = 0s.
1. Measure the fastest rate Rf at which temperature increases in °C/s. e.g., Rf = 3°C/s.
1. Divide the heater power by Rf to get `MPC_BLOCK_HEAT_CAPACITY` in J/K. e.g., 40W / 3°C/s = 13.33 J/K.
1. Measure the temperature Tf and time tf of the point where temperature was increasing fastest.
1. `MPC_SENSOR_RESPONSIVENESS` is Rf / (Rf x tf + Ts - Tf). e.g., for tf = 10s and Tf = 35°C, this is 3°C/s / ( 3°C/s x 10s + 20°C - 35°C) = 0.2 K/s/K.
1. Set these values with `M306` and set the temperature to 200°C.
1. MPC should eventually settle at a stable temperature around 200°C.
1. Use `M105` to find the PWM output required to maintain 200°C. e.g., if `M105` returns `T:200.12 /200.00 B:18.38 /0.00 P:18.24 /0.00 @:41 B@:0` it is the value `41` after the first `@` so PWM = 41.
1. `MPC_AMBIENT_XFER_COEFF` is PWM / 127 * heater power / (200°C - Ts). e.g., 41 / 127 * 40 W / (200°C - 20°C) = 0.072 W/K.
1. Find `MPC_AMBIENT_XFER_COEFF_FAN255` by repeating the last three steps with the fan on full.

## Advanced Configuration

`MPC_FAN_0_ALL_HOTENDS` and `MPC_FAN_0_ACTIVE_HOTEND`: Marlin assumes fan _N_ cools parts printed by hotend _N_. However some multi-hotend machines have only one fan. In these cases MPC needs to know whether the cooling fan cools all hotends simultaneously or whether it cools only the active hotend. Enable the appropriate option.

`FILAMENT_HEAT_CAPACITY_PERMM`: MPC models heat loss from melting filament. Set the filament heat capacity here.

`MPC_SMOOTHING_FACTOR`, `MPC_MIN_AMBIENT_CHANGE` and `MPC_STEADYSTATE`: These may be tweaked for stability. See the algorithm description for details.

### Filament Heat Capacity

Marlin needs to know how much energy (in Joules) it takes to heat 1mm of filament by 1°C (or 1 Kelvin, which is the same thing).
This can be calculated from the specific heat capacity and the density of the material. As an example, consider ABS. A web search gives the following approximate values:

| Specific heat capacity | 2 J/g/K |
| Density | 1.07 g/ml |

(Note: the way the units are presented for specific heat capacity vary widely but usually mean the same thing. K is the same as °C. And kJ/kg is the same as J/g or 1000 J/g.)

For 1.75mm filament, 1mm of filament has a volume of 0.1 cm x π x (0.175 cm)<sup>2</sup> / 4 = 0.00241 ml.<br>
Multiply 0.00241 ml/mm by the density of 1.07 g/ml to get 0.00257 g/mm.<br>
Multiply 0.00257 g/mm by the specific heat capacity of 2 J/g/K to get 0.00515 J/K/mm.

The approximate heat capacities per mm of several popular filaments are:

| Material | Value for 1.75mm filament | Value for 2.85mm filament |
| - | - | - |
| ABS | 0.00515 J/K/mm | 0.0137 J/K/mm |
| Nylon | 0.00522 J/K/mm | 0.0138 J/K/mm |
| PETG | 0.0036 J/K/mm | 0.0094 J/K/mm |
| PLA | 0.0056 J/K/mm | 0.0149 J/K/mm |

## Tweaking MPC

The advanced configuration options may offer stability benefits to some users. However by far the most common reason for tweaking MPC is when there is a fixed offset between the set temperature and the actual temperature. The MPC algorithm will eliminate this offset over time, but the effect may return when parameters such as fan speed change. A fixed offset like this will be caused by `MPC_AMBIENT_XFER_COEFF`, `MPC_AMBIENT_XFER_COEFF_FAN255` and/or `FILAMENT_HEAT_CAPACITY_PERMM`. Slightly increasing these values will increase the temperature where MPC settles and slightly decreasing them will decrease the settling temperature.

## Marlin's MPC Algorithm

MPC models the hotend system as four thermal masses: ambient air, the filament, the heater block and the sensor. Heater power heats the modeled heater block directly. Ambient air heats or cools the heater block. Filament cools the heater block. The heater block heats or cools the sensor.

Every time the MPC algorithm runs it uses the following information to calculate a new temperature for the simulated hotend and sensor:
- The last power setting for the hotend.
- The present best-guess of the ambient temperature.
- The effect of the fan on heat-loss to the ambient air.
- The effect of filament feedrate on heat-loss to the filament. Filament is assumed to be at the same temperature as the ambient air.

Once this calculation is done, the simulated sensor temperature is compared to the measured temperature and a fraction of the difference is added to the modeled sensor and heater block temperatures. This drags the simulated system in the direction of the real system. Because only a fraction of the difference is applied, sensor noise is diminished and averages out to zero over time. Both the simulated and the real sensor exhibit the same (or very similar) latency. Consequently the effects of latency are eliminated when these values are compared to each other. So the simulated hotend is only minimally affected by sensor noise and latency. This is where the real magic of this MPC implementation lies.

`MPC_SMOOTHING_FACTOR` is the factor applied to the difference between simulated and measured sensor temperature. At its maximum value of 1, the simulated sensor temperature is continually set equal to the measured sensor temperature. A lower value will result in greater stability in MPC output power but also in decreased responsiveness. A value around 0.25 seems to work quite well.

No simulation is perfect and, anyway, real life ambient temperature changes. So MPC also maintains a best guess estimate of ambient temperature. When the simulated system is close to steady state the simulated ambient temperature is continually adjusted. Steady state is determined to be when the MPC algorithm is not driving the hotend at its limits (i.e., full or zero heater power) or when it is at its limit but temperatures are still not changing very much - which will occur at asymptotic temperature (usually when target temperature is zero and the hotend is at ambient).

`MPC_STEADYSTATE` is used to recognize the asymptotic condition. Whenever the simulated hotend temperature changes at an absolute rate less than `MPC_STEADYSTATE` between two successive runs of the algorithm, the steady state logic is applied. Since the algorithm runs frequently (6 times a second on an AVR board), even a small amount of noise can result in a fairly high instantaneous rate of change of hotend temperature. In practice 1°C/s seems to work well for `MPC_STEADYSTATE`.

When in steady state, the difference between real and simulated sensor temperatures is used to drive the changes to ambient temperature. However when the temperatures are really close `MPC_MIN_AMBIENT_CHANGE` ensures that the simulated ambient temperature converges relatively quickly. Larger values of `MPC_MIN_AMBIENT_CHANGE` will result in faster convergence but will also cause the simulated ambient temperature to flutter somewhat chaotically around the ideal value. This is not a problem because the effect of ambient temperature is fairly small and short term variations of even 10°C or more will not have a noticeable effect.

It is important to note that the simulated ambient temperature will only converge on real world ambient temperature if the ambient heat transfer coefficients are exactly accurate. In practice this will not be the case and the simulated ambient temperature therefore also acts a correction to these inaccuracies.

Finally, armed with a new set of temperatures, the MPC algorithm calculates how much power must be applied to get the heater block to target temperature in the next two seconds. This calculation takes into account the heat that is expected to be lost to ambient air and filament heating. This power value is then converted to a PWM output.

## `M306 T` Details
The tuning algorithm does the following with the target hotend:
- Move to the center and close to bed: Printing occurs close to the bed or printed model so tuning is done close to a surface to best emulate the conditions while printing.
- Cool to ambient: The tuning algorithm needs to know the approximate ambient temperature. It switches the part cooling fan on and waits until the temperature stops decreasing.
- Heat past 200°C: Three temperature measurements are needed at some point after the initial latency has taken effect. The tuning algorithm heats the hotend to over 200°C.
- Hold temperature while measuring ambient heat-loss: At this point enough is known for the MPC algorithm to engage. The tuning algorithm makes a best guess at the overshoot past 200°C which will occur and targets this temperature for about a minute while ambient heat-loss is measured without (and optionally with) the fan.
- Set MPC up to use the measured constants and report them for use in `Configuration.h`.

If the algorithm fails or is interrupted with `M108`, some or all of the MPC constants may be changed anyway and their values may not be reliable.

## Model Details & Tuning Algorithm

The simulated hotend model is not a physically-accurate representation of the hotend but it's good enough. Differences include:
- The real heating element is a separate thermal mass, somewhat thermally insulated from the heater block.
- The real heater block is cooled by the heatsink which slowly heats to some asymptotic temperature.
- The real temperature sensor heats/cools the heater block to a tiny degree.

None of these effects is significant enough to harm the functioning of MPC. So for the sake of simplicity and performance they are ignored.

The model is governed by a very simple set of differential equations:

$$ \dfrac{dT_b}{dt} = \dfrac{P + h_a . (T_a - T_b)}{C_b} $$

$$ \dfrac{dT_s}{dt} = \dfrac{h_s . (T_b - T_s)}{C_s} $$

where

$$T_b$$ = temperature of the heater block.

$$T_s$$ = temperature of the sensor.

$$T_a$$ = ambient temperature.

$$t$$ = time.

$$P$$ = heater power.

$$h_a$$ = coefficient of heat transfer from heater block to ambient. This one constant encapsulates the effect of
fan speed and filament feedrate and is calculated using `MPC_AMBIENT_XFER_COEFF`, `MPC_AMBIENT_XFER_COEFF_FAN255` and
`FILAMENT_HEAT_CAPACITY_PERMM`. Both room air and un-melted filament are assumed to be at the same ambient temperature.

$$h_s$$ = coefficient of heat transfer from heater block to sensor.

$$C_b$$ = heat capacity of the heater block (i.e., `MPC_BLOCK_HEAT_CAPACITY`).

$$C_s$$ = heat capacity of the sensor.

Since $$h_s$$ and $$C_s$$ never appear independently, they are collapsed into a single the single constant represented by `MPC_SENSOR_RESPONSIVENESS` which has the value $$\dfrac{h_s}{C_s}$$.

These differential equations are continually solved numerically by MPC. There is also a simple analytical solution which is used by `M306 T`:

$$ T_b = T_{asymp} + (T_a - T_{asymp}) . e ^ {(-\alpha_b . t)}$$

$$ T_s = T_{asymp} + (T_a - T_{asymp}) . \dfrac{\alpha_s . e ^ {(-\alpha_b . t)} - \alpha_b . e ^ {(-\alpha_s . t)}}{\alpha_s - \alpha_b}$$

where

$$T_{asymp} = T_a + P / h_a$$ is the asymptotic temperature of the hotend.

$$\alpha_b = h_a / C_b$$ is the "responsiveness" of the heater block to ambient temperature.

$$\alpha_s = h_s / C_s$$ is the "responsiveness" of the sensor to heater block temperature (i.e., `MPC_SENSOR_RESPONSIVENESS`).

and assuming $$T_s(0) = T_b(0) = T_a$$.

In a real world system, $$\alpha_s \gg \alpha_b$$. So after the initial latency effects (which will generally be the case after $$T_s > 100$$) an excellent approximation of the second equation is

$$ T_s \approx T_{asymp} + (T_a - T_{asymp}) . \dfrac{\alpha_s . e ^ {(-\alpha_b . t)}}{\alpha_s - \alpha_b} \label{approx} $$

This makes it easy to measure $$T_{asymp}$$ and, consequently, $$\alpha_b$$ (leading to a measure of $$h_a$$ and $$C_b$$) and $$\alpha_s$$.

For any $$\Delta t$$ the above equation gives

$$\dfrac{T_s(t + \Delta t) - T_{asymp}}{T_s(t) - T_{asymp}} = e ^ {(-\alpha_b . \Delta t)} \label{eqdelta} $$

By the same logic

$$\dfrac{T_s(t + 2 \Delta t) - T_{asymp}}{T_s(t + \Delta t) - T_{asymp}} = e ^ {(-\alpha_b . \Delta t)} $$

And so

$$\dfrac{T_s(t + 2 \Delta t) - T_{asymp}}{T_s(t + \Delta t) - T_{asymp}} = \dfrac{T_s(t + \Delta t) - T_{asymp}}{T_s(t) - T_{asymp}}$$

Rearranging:

$$ T_s(t + 2 \Delta t) . T_s(t) - T_{asymp} . (T_s(t + 2 \Delta t) + T_s(t)) + T_{asymp}^2 = T_s(t + \Delta t) ^ 2 - T_{asymp} . 2 . T_s(t + \Delta t) + T_{asymp}^2 $$

Or (subtracting $$T_{asymp}^2$$ from both sides):

$$ T_s(t + 2 \Delta t) . T_s(t) - T_{asymp} . (T_s(t + 2 \Delta t) + T_s(t)) = T_s(t + \Delta t) ^ 2 - T_{asymp} . 2 . T_s(t + \Delta t) $$

And:

$$ T_{asymp} = \dfrac{T_s(t + \Delta t) ^ 2 - T_s(t + 2 \Delta t) . T_s(t)}{2 . T_s(t + \Delta t) - T_s(t + 2 \Delta t) - T_s(t)} $$

Using the identity $$T_{asymp} = T_a + P / h_a$$:

$$ h_a = \dfrac{P}{T_{asymp} - T_a} $$

Equation $$\eqref{eqdelta}$$ also gives

$$ \alpha_b = \dfrac{-ln(\dfrac{T_s(t + \Delta t) - T_{asymp}}{T_s(t) - T_{asymp}})}{\Delta t} $$

And using the identity $$\alpha_b = h_a / C_b$$:

$$ C_b = \dfrac{h_a}{\alpha_b} $$

And for any known $$T_s(t)$$ equation $$\eqref{approx}$$ can be solved to give

$$ \alpha_s = \dfrac{\alpha_b . (T_s(t) - T_{asymp})}{T_s(t) - T_{asymp} - (T_a - T_{asymp}) . e^{-\alpha_b . t}} $$

`M306 T` finds a $$t$$ and $$\Delta t$$ with known sensor values for $$T_s(t)$$, $$T_s(t + \Delta t)$$ and $$T_s(t + 2 \Delta t)$$. These are used with the equations above to calculate values for `MPC_SENSOR_RESPONSIVENESS`, `MPC_AMBIENT_XFER_COEFF` and `MPC_BLOCK_HEAT_CAPACITY`. These values are then used to target a particular temperature while heat loss is measured to obtain `MPC_AMBIENT_XFER_COEFF_FAN255` and an even better estimate of `MPC_AMBIENT_XFER_COEFF`.
