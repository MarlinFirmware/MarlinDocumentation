---
title: Marlin Testing
description: "How Marlin is tested: static checks, build tests, unit tests, the Simulator and real hardware. What to run before you open a Pull Request, and what the CI checks on it."
parent: Development
layout: article
nav_order: 3
toc: true
back_to_top: true
---

# Marlin Testing

Marlin runs on dozens of boards, and almost every feature can be switched on or off. Any change can break a
combination its author never tried. Testing is how the project keeps that from happening, and it is part of every
Pull Request: you run some tests before you submit, and an automatic set of checks (CI) runs more after.

This page explains each kind of test, what it can catch, how to run it on your own computer, and how to add a
test for the feature or fix you are working on.

## The kinds of testing

| Kind | Catches | Runs on |
|------|---------|---------|
| [Validation checks](#validation-checks) | Formatting, pins files, `boards.h`, unbalanced `#if`/`#endif` | Your computer and CI |
| [Build tests](#build-tests) | Code that fails to compile or link for some board or option combination | Your computer and CI |
| [Unit tests](#unit-tests) | Wrong results from logic that doesn't need hardware, such as parsing and math | Your computer and CI |
| [The Simulator](#testing-with-the-simulator) | Wrong behavior of a whole configuration: motion, menus, G-code sequences | Your computer |
| [Real hardware](#testing-on-real-hardware) | Everything the others can't: drivers, sensors, timing, noise | Your printer |

No one kind is enough. A build test proves that code *compiles*, not that it *works*. Unit tests and the
Simulator show that it works in software, but only a printer can show that it works on a printer. A good Pull
Request says which of these you used.

## Before you start

Most of the tools below are scripts in the Marlin source tree, so run them from the top folder of your checkout (the one that has
`platformio.ini`). You will need:

- [PlatformIO](//platformio.org/) with `pio` in your `PATH`. Installing [Auto Build Marlin](/docs/basics/install_abm.html) in
  Visual Studio Code also installs it.
- Python 3 and `make`. Some `make` tasks also need Node.js (`npx`) or Docker.
- A real GCC if you work on macOS, because the system `gcc` is Clang. See the note in
  [Marlin Simulator](/docs/printers/simulator.html#build-from-the-command-line).

`make help` prints every task and option described below.

{: .warning }
Test tools rewrite `Configuration.h` and `Configuration_adv.h`, and the test runner may reset your working tree with
`git reset --hard`. Commit or stash your work before you run them, and never commit the configuration changes a
test leaves behind.

## Validation checks

These are quick checks of the source itself. CI runs each one on a Pull Request that touches the files it
covers, so you can run the same check first.

| Command | Checks |
|---------|--------|
| `make validate-lines -j` | Line endings, trailing whitespace and other text formatting rules. |
| `make validate-pins -j` | Every pins file is formatted correctly. `make format-pins -j` reformats them, and `PINSPATH=dir` limits the work to one folder. |
| `make validate-boards -j` | `boards.h` follows the project's rules. |
| `make validate-conditionals` | `#if` / `#endif` structure and `#define` bodies are well formed. |
| `make validate-urls` | URLs in the source files. |

## Build tests

Marlin compiles only the code that your configuration enables, so a change that builds for one configuration
may fail for another. The **build tests** compile Marlin many times with different boards and option sets, and they
are the main defense against such failures.

### How a build test is defined

The tests are in `buildroot/tests/`. There is one folder per PlatformIO environment, such as `mega2560` or
`STM32F103RC_btt`, and each holds numbered files (`config-01.ini`, `config-02.ini`, and so on). Each file
describes one configuration as a list of changes to make to the default one:

```ini
#
# Marlin Firmware
# Test: mega2560/config-02.ini
#
# Azteeg X3 Pro | EXTRUDERS 5 | RRDFGSC | UBL | LIN_ADVANCE ...
#

[config:base]
ini_use_config  = example/AnimationExample

motherboard     = BOARD_AZTEEG_X3_PRO
extruders       = 5
auto_bed_leveling_ubl = on
```

`ini_use_config` starts from one of the [example configurations](/docs/appendix/printers/) (or from the
defaults if it is left out). Each remaining line sets an option to a value, or turns it `on`.

### Running build tests

Build the configuration you already have set up:

```sh
buildroot/bin/mfenvs          # list the PlatformIO environments for your MOTHERBOARD
buildroot/bin/mftest -a       # build the auto-detected environment
```

Apply one of the test files and build it:

```sh
buildroot/bin/mftest                         # pick a test from a menu
buildroot/bin/mftest -t mega2560 -n 2 -y     # environment, test number, build without asking
```

Useful options: `-d` starts from the default configuration, `-i` shows the changes without building, and `-s`
silences the PlatformIO output. `mftest -h` lists them all, along with shortcut names such as `mega`, `stm`
and `lin` for the `-t` option.

Run the tests the way CI does:

```sh
make tests-single-local TEST_TARGET=mega2560               # all tests of one environment
make tests-single-local TEST_TARGET=mega2560 ONLY_TEST=2   # just one of them
make tests-all-local                                       # every test that CI runs (slow)
```

There is a `-docker` version of each task for running in a container. When you finish, put your configuration
back with `buildroot/bin/restore_configs`. It discards uncommitted edits to the configuration files.

### What to build for your change

- Build at least one environment for each board family or platform you changed.
- A change to common code deserves one **AVR** build, where flash is tight, and one 32-bit build.
- For a feature, build with it both enabled and disabled.
- Be exact when you report this in the Pull Request: name the environments and tests you built.

### Adding a build test

A Pull Request that adds a feature or option should add a build test, so that CI keeps building it.

1. Choose the environment folder for a board that can build the feature.
2. Prefer adding your option to an existing `config-NN.ini` with similar features. Add a new file, using the
   next free number, only for a combination that no test covers.
3. Turn on the feature together with the options it depends on, and with its sub-options.
4. Run it with `mftest -t <env> -n <number> -y`.

Keep the number of tests small, because every test adds to the time CI takes.

## Unit tests

Unit tests run small pieces of Marlin's logic on your computer, with no printer. They are good for parsing,
math, unit conversion and state machines. They can't test anything that needs real pins or timers, such as whether an
endstop triggers. They make future changes safer: when someone changes the code later, a failing test points to the
break.

The tests are in `Marlin/tests/` (the folders `core`, `feature` and `gcode`). Each configuration they run
under is a file in `test/`, such as `test/001-default.ini`, because a test binary has to be built for each
configuration. The environment is `linux_native_test`, and the tests build with `-Werror`, so a warning is a failure.

```sh
make unit-test-all-local                               # every configuration
make unit-test-single-local UNIT_TEST_CONFIG=default   # one configuration
make unit-test-all-local-docker                        # the same, in a container
```

To add a test, put a `test_<name>.cpp` file in the right folder, using an existing test such as
`Marlin/tests/feature/test_runout.cpp` as a model. Wrap its contents in `#if ENABLED(YOUR_FEATURE)` so it builds only
when the feature is on. If no file in `test/` enables the feature, add one that uses `motherboard = BOARD_SIMULATED` and only the
options that the sanity checks require. Bug fixes should get a test too, whenever one could catch the bug coming back.
`test/README.md` in the Marlin source has more detail.

## Testing with the Simulator

The [Marlin Simulator](/docs/printers/simulator.html) (MarlinSimUI) runs the firmware as a desktop program, with
simulated steppers, heaters, endstops, display and SD card. It sits between the unit tests and a real
printer. It runs the *whole* firmware for a *whole* configuration, so it can answer questions that no unit test can:
Does `G28` home the axes in the right order? Does the menu show what I changed? Does the probe visit the
points I expect? Where does the nozzle stop at the software endstops?

### A test session

1. Build the `Simulator` example configuration, or take it as a starting point and enable your feature in it.
   Its `MOTHERBOARD` is `BOARD_SIMULATED`. Build it with Auto Build Marlin, or with
   `pio run -e simulator_linux_debug` (use `simulator_macos_debug` or `simulator_windows` on those systems).
2. Run `MarlinSimulator` and send G-code from the Serial Monitor panel. Use the display with the mouse to try the
   menus.
3. Watch the Viewport as well as the Serial Monitor. The bed markings show the probeable area, the software
   endstops, the leveling mesh and the `Z_SAFE_HOMING` point, so a wrong offset or limit is visible at once.
4. Repeat the failing steps until you can describe them exactly, then fix the code and run the same steps again.

The Simulator reproduces bugs well. If a problem appears in the Simulator, anyone can repeat it without owning your
printer, which makes for a much better bug report than "it does this on my machine."

### Scripted testing

With `--agent-port <n>`, the Simulator also accepts requests over HTTP: send G-code, wait until the machine is
idle, read the state of the simulated heaters and endstops, take a screenshot of the display or the 3D view, and
speed up or freeze simulated time. That lets a script, or an AI coding agent, run the same checks again after every
change. See [Driving it from a script](/docs/printers/simulator.html#driving-it-from-a-script).

{: .note }
`POST /gcode` reaches Marlin only if `SERIAL_PORT_2` is `3` in the configuration. The Simulator example has this line
commented out.

### What the Simulator can't tell you

There are no real electronics or interrupts in the Simulator. It cannot show that a stepper driver
is configured properly, that a thermistor table matches your sensor, that a pin is right for your board, or that
the printer will stay in sync at its top speed. Check those on hardware.

### Simulator in CI

The build test `simulator_linux_release` builds the Simulator example, and it is one of the tests CI runs on every
Pull Request. A change that breaks the Simulator build is caught the same way as any other build failure. Run it
yourself with `buildroot/bin/mftest -t simulator_linux_release -n1 -y`. This builds the firmware, but it does not start
the program, which needs a graphical desktop.

## Testing on real hardware

Whatever the other tests say, a change that affects the machine's behavior needs a test on a machine. Test with
the same board family you changed, and say what you used: board, drivers, display, kind of printer, and the
options you enabled. If you can't test on hardware (it happens, especially with boards you don't own) say that too,
so that a reviewer with the board can step in. A Pull Request with an honest "built but not run" is more useful than
one that implies more than was done.

For hardware that takes risks, such as heaters, thermal protection, motion limits or power-loss recovery:

- Test with the heaters off and the motors disconnected first, if the change allows it.
- Keep a hand on the power switch for the first real run.
- Never disable [thermal protection](/docs/features/thermal_protection.html) to make a test easier.

## What CI checks

Every Pull Request to `bugfix-2.1.x` starts a set of GitHub workflows. A red mark means that one of them failed, and
the PR can't be merged until it passes. The **Details** link shows the log. Look for the first error.

| Workflow | What it does |
|----------|--------------|
| CI - Build Tests | Compiles a matrix of boards and configurations from `buildroot/tests`, including the Simulator. It is the longest check. |
| CI - Unit Tests | Builds and runs the unit tests. |
| CI - Validate Source Files | The `validate-lines` check. |
| CI - Validate Pins Files | The `validate-pins` check, when a pins file changed. |
| CI - Validate boards.h | The `validate-boards` check, when `boards.h` changed. |
| CI - Validate Conditionals | The `validate-conditionals` check. |

Pull Requests that change only documentation or Markdown files skip the build and unit tests. Reproduce a CI
failure by running the matching command from this page, using the environment named in the failed job.

## Checklist before you open a Pull Request

- [ ] The validation checks pass.
- [ ] You built at least one environment for each platform you changed, and for a feature both enabled and disabled.
- [ ] A new feature or option has a build test, and a unit test where the logic can run without hardware.
- [ ] The change is tested in the Simulator or on hardware, and the description says which.
- [ ] You ran `buildroot/bin/restore_configs`, and no test-only edits to configuration files are in your commits.
- [ ] The description lists what you built and tested, and what you could not.

See [Contributing Code](/docs/development/getting_started_pull_requests.html) for the rest of the process.
