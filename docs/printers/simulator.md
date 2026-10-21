---
title: Marlin Simulator
description: "MarlinSimUI runs Marlin as a desktop program with simulated steppers, heaters, endstops, displays and SD card, plus a 3D view of the printer. How to build it, run it, and use it to try out a configuration."
parent: Printer Types
nav_order: 6
layout: article
toc: true
back_to_top: true
---

# Marlin Simulator

*MarlinSimUI* runs Marlin firmware as an ordinary program on your computer, with no printer attached. The
steppers, heaters, endstops, display and SD card are simulated, and a 3D view shows a printer moving as the
firmware commands it. It runs on Windows, macOS and Linux.

<video controls preload="metadata" poster="/assets/video/simulator-visualizer-poster.jpg" style="width:100%;max-width:1148px">
  <source src="/assets/video/simulator-visualizer.mp4" type="video/mp4">
  Your browser can't play this video. <a href="/assets/video/simulator-visualizer.mp4">Download it</a> instead.
</video>

*A one-minute tour: the printer model in the Viewport, the simulated touch display, and the Serial Monitor
while the firmware homes, probes the bed and moves.*

## When to use it

The Simulator is the safest place to find out what a configuration will do before it touches hardware.
It is good for:

- **Trying a configuration.** Does the menu look right? Does `G28` home in the order you expect? Where does the
  probe go during `G29`? Do the software endstops stop the nozzle where you think?
- **Learning.** Send G-code and watch the result. Nothing can crash, stall or burn.
- **Checking the shape of the machine.** The model is sized from your bed size, Z height and (for a Delta) the
  geometry you configured, so a wrong dimension is easy to see.
- **Testing a host or script** without a printer. The simulator has a serial socket and an HTTP interface for
  [automation](#driving-it-from-a-script).

It is not a substitute for a real printer. There is no real electronics, no interrupt timing, and no motor or
thermal behavior beyond what the simulation models, so it cannot tell you whether a driver overheats, whether
a thermistor table suits your sensor, or whether the board's pins are right. Treat it as a way to check *logic and
layout*, and still verify the machine itself as described in [Build & Install](/docs/basics/install.html).

## What you need

- A computer running Windows, macOS or Linux with a graphical desktop. The Simulator draws a window and cannot run
  headless on a server without a display.
- A Marlin source tree (`bugfix-2.1.x`) and the **Simulator** example configuration. Its `MOTHERBOARD` is
  `BOARD_SIMULATED`. See [Build with Auto Build Marlin](#build-with-auto-build-marlin) or
  [Build from the command line](#build-from-the-command-line).
- On the command line, the system libraries SDL2, SDL2_net, OpenGL and GLM. The list is at the top of
  `ini/native.ini` in the Marlin source.

## Build with Auto Build Marlin

This is the easy way. It needs [Auto Build Marlin](/docs/basics/install_abm.html) (and so Visual Studio Code), and it installs PlatformIO for you.

1. Open the Marlin folder (`bugfix-2.1.x`) in Visual Studio Code.
2. Open Auto Build Marlin and click **Download** to open the Configuration Downloader. It backs up your current
   configuration first.
3. Search for **Simulator** and select that example.
4. Click **Build** on the `simulator_…` environment for your operating system, then **Run**.

## Build from the command line

Install the libraries first. For example:

```sh
sudo apt-get install build-essential libsdl2-dev libsdl2-net-dev libglm-dev   # Debian/Ubuntu
brew install gcc@14 glm mesa sdl2 sdl2_net                                     # macOS (Homebrew)
```

On Windows, use MSYS2 with the packages named in `ini/native.ini`.

Copy the `Configuration.h` and `Configuration_adv.h` from the
[Simulator example](https://github.com/MarlinFirmware/Configurations/tree/bugfix-2.1.x/config/examples/Simulator)
into the `Marlin/` folder, then build the environment for your system and start the program:

```sh
pio run -e simulator_linux_debug
./.pio/build/simulator_linux_debug/debug/MarlinSimulator
```

The environments are `simulator_linux_debug`, `simulator_linux_release`, `simulator_macos_debug`,
`simulator_macos_release` and `simulator_windows`. The program is always named `MarlinSimulator`.

{: .note }
On macOS the system `gcc` is really Apple's Clang, which can't build Marlin. The build script looks for a real GCC from
Homebrew or MacPorts and uses it for that build only. To choose one yourself, set `CXX`, as in
`CXX=g++-15 pio run -e simulator_macos_debug`.

Marlin's `ini/native.ini` fetches MarlinSimUI as a library from GitHub. To build against a copy you have
changed, point its `lib_deps` line at your checkout:

```ini
MarlinSimUI=symlink:///path/to/MarlinSimUI
```

The Simulator saves `eeprom.dat` (the simulated EEPROM, so `M500` settings survive a restart) and `imgui.ini` (your
window layout) in the folder it is started from. Start it from the same folder each time to keep them.

## The window

The window opens maximized and is made of dockable panels. Drag a tab to rearrange them. The layout is
remembered in `imgui.ini`.

![The Simulator window: Viewport with a bedslinger model, Agent Activity panel, a simulated touch display and the Serial Monitor](/assets/images/tools/simulator-panels.jpg){: .framed }

| Panel | What it shows |
|-------|---------------|
| **Viewport** | The 3D printer model, with the **Camera**, **Printer** and **Extrusion** menus. |
| **Signal Analyser** | A tab beside the Viewport for examining the simulated signals. |
| **Display** | The simulated LCD or TFT of your configuration, which you can click like the real thing. The title shows the display type (`ST7796DeviceRender` in the picture). |
| **Serial Monitor** | One tab per serial port. Type G-code at the bottom to send it. The firmware's replies appear above. |
| **Log** | The simulator's own log, in a tab beside the Serial Monitors. |
| **Agent Activity** | Requests received by the [agent interface](#driving-it-from-a-script), when it is turned on. |

The display depends on what the configuration enables. The Simulator can show a character LCD, a graphical LCD
or a color TFT with touch (`TFT_COLOR_UI`). Pick the display in `Configuration.h` as you would for real hardware;
see [Displays](/docs/features/displays.html).

## The 3D printer

The Viewport draws a whole printer that moves with the simulation, sized from your configuration.

- **Which model.** A **Bedslinger** (i3 style) and a **Cube** (head on top, the bed moves in Z) are offered for
  most builds. A build with `DELTA` shows the **Delta**, and a `SCARA` build the **SCARA**. Choose from the
  **Printer** menu, or start the program with `--machine bedslinger|cube|delta|scara`.
- **Several hotends.** One hotend appears for each of `HOTENDS`, at its tool offset. The model follows
  [`M218`](/docs/gcode/M218.html), [`M501`](/docs/gcode/M501.html) and anything else that changes the offsets.
- **Temperature colors.** Hotends go from light blue (cold) to pink (at target), and the bed from dark blue to
  dark red. The active hotend glows.
- **Show Printer** in the **Printer** menu hides the model and leaves the bed and the print.

### Bed markings

The **Printer > Bed Markings** menu overlays the geometry the firmware is working with. These follow the
running configuration, so changing an offset with a G-code moves the marking.

| Marking | Shows |
|---------|-------|
| White circle with a cross | The 0,0 origin. |
| Yellow circle with an X | The [`Z_SAFE_HOMING`](/docs/settings/homing.html#Z_SAFE_HOMING) point. |
| White dashed outline | The probeable area, following [`M851`](/docs/gcode/M851.html). |
| Light orange dashed outline | The reach of the active tool: its software endstops, following the tool and `M218`. Darker orange when [`M211`](/docs/gcode/M211.html) has turned the endstops off. |
| Light blue grid | The bed leveling mesh. |

On a **Delta** the reach also includes the physical limit of the arms, drawn as a solid light orange rounded
triangle with its corners toward the towers. **Printer > Printable Volume** adds a translucent volume of
everywhere the tool can print, from the live `M665`, `M666` and `M218` geometry. Its top is scooped toward each
tower, where the carriages reach their endstops first.

On a **SCARA** the software endstops are drawn as a box. Solid rings show the reach of the arms and the dead
zone around the shoulder where they cross the bed, and dashed rings show the probe's own reach, since the probe hangs
from the forearm at the `M851` offset.

### Camera

The camera has two modes, chosen in **Camera > Mode**.

- **Turntable** (the default) orbits a target point. Left-drag to orbit. Right-drag, middle-drag or Shift-drag
  to pan. Use the mouse wheel or `+` and `-` to zoom, and the arrow keys to turn.
- **Fly** is a free camera.

| Key | Action |
|-----|--------|
| `1` | Front view |
| `3` | Right view |
| `7` | Top view |
| `0` | Three-quarter view |
| `F` | Follow the nozzle |
| `R` | Reset the camera |
| `P` | Show or hide the printer (either mode) |
| `M` | Show or hide the bed markings (either mode) |
| `V` | Show or hide the printable volume, on a Delta (either mode) |

## A first session

1. Start the Simulator. Wait for the Serial Monitor to show Marlin's start-up text.
2. Click in the Serial Monitor's input line, type `G28` and press Enter. Watch the Viewport as the axes home.
3. Type `M105` to read the temperatures, then `M104 S200` and watch the hotend turn from blue toward pink.
4. If your configuration has bed leveling, run [`G29`](/docs/gcode/G029.html) and watch the probe visit each point on the
   markings overlay. The status screen counts the points, as in the video ("Probing Point 8/25").
5. Use the display's menus with the mouse, to check how your configuration's menus and screens look.

If the Serial Monitor shows nothing, make sure you are looking at the tab for the port Marlin is using
([`SERIAL_PORT`](/docs/settings/serial.html#SERIAL_PORT) in the Simulator example is `0`).

## Driving it from a script

The Simulator can also be controlled without a person at the window, which is useful for tests, CI jobs and
AI agents. There are two interfaces:

- **A raw G-code socket**, a TCP port on the local machine (default `8099`, set with `--serial-port <n>` or
  `MARLIN_SIM_SERIAL_PORT`). It connects to serial stream 3, which Marlin reads only when
  [`SERIAL_PORT_2`](/docs/settings/serial.html#SERIAL_PORT_2) is `3`. That line is commented out in the Simulator
  example.
- **An HTTP/JSON agent interface**, off unless you give `--agent-port <n>` (or set `MARLIN_SIM_AGENT_PORT`). It listens
  on `127.0.0.1` only. It reports the simulated hardware next to what Marlin believes, accepts G-code, touch
  taps and camera moves, takes screenshots, and can freeze or speed up simulated time.

```sh
MarlinSimulator --agent-port 8100 --no-audio &

curl -s http://127.0.0.1:8100/ping
curl -s -X POST http://127.0.0.1:8100/gcode -d '{"command":"G28"}'
curl -s http://127.0.0.1:8100/idle                       # repeat until "idle":true
curl -s -X POST http://127.0.0.1:8100/kernel/control -d '{"realtime_scale":10}'   # 10x speed
```

{: .important }
`POST /gcode` sends to serial stream 3. Unless `SERIAL_PORT_2` is `3` in your `Configuration.h`, the commands are
accepted and then ignored.

The complete list of requests is in the
[agent interface reference](https://github.com/MarlinFirmware/MarlinSimUI/blob/cutting-edge/docs/agent-interface.md).

## Command-line options

| Option | Meaning |
|--------|---------|
| `--agent-port <n>` | Turn on the agent interface at `127.0.0.1:<n>` (or set `MARLIN_SIM_AGENT_PORT`). |
| `--serial-port <n>` | TCP port for the raw G-code socket (default 8099, or `MARLIN_SIM_SERIAL_PORT`). |
| `--no-audio` | Turn off buzzer emulation. |
| `--machine <type>` | The Viewport model: `bedslinger`, `cube`, `delta` or `scara`. A `DELTA` build accepts only `delta` and a `SCARA` build only `scara`. |
| `--help` | Show the options. |

## Troubleshooting

| Symptom | Likely cause and fix |
|---------|----------------------|
| The macOS build stops with a compiler error about `gcc`. | No real GCC is installed. Install `gcc@14` (Homebrew) or `gcc14` (MacPorts), or set `CXX`. |
| The build can't find SDL2, GLM or OpenGL. | A system library is missing. Install the list at the top of `ini/native.ini`. |
| G-code sent to the agent interface does nothing. | `SERIAL_PORT_2` is not `3` in `Configuration.h`. |
| The window layout or EEPROM contents differ from last time. | `imgui.ini` and `eeprom.dat` are read from the folder the program was started in. |
| The model is not the one you wanted. | Only some models fit each build. Delta and SCARA builds show their own printer; other builds offer the Bedslinger and the Cube. |

## Branches

MarlinSimUI lives in the [MarlinSimUI repository](https://github.com/MarlinFirmware/MarlinSimUI). The `master`
branch is stable. The `cutting-edge` branch holds newer work (the printer models, camera, agent interface) and is what
Marlin's `ini/native.ini` fetches. A third branch, `cutting-edge-more-printers`, adds a Prusa i3 demo model
(`--machine i3`).

## See also

- [Boards](/docs/appendix/boards.html), the `BOARD_SIMULATED` entry.
- [Build & Install](/docs/basics/install.html)
- [Displays](/docs/features/displays.html)
