---
title:        'Coding Standards'
description:  'Guidelines for Marlin code formatting, methodologies, and standards.'
tag: coding

author: thinkyhead
category: [ development ]
---

Please follow the formatting guidelines and coding standards below when contributing code to Marlin. Pull requests that don't follow the existing coding style closely may be postponed for cleanup. Your code reviewer should point out where changes are needed.

# Coding Style
## Indentation
Indentation is important for readability and maintainability of code, and provides guidance for naïve code editors (_e.g.,_ TextMate, Sublime, et. al.) to properly fold code blocks by level.

 - Entab lines with 2 spaces and don't use tabs. _Set your editor to use 2 Spaces! Tabs will bite you in the end._
 - All block elements should increase the indentation level, including `#if` blocks and other non-brace compiler blocks:

```cpp
void myFunction() {
  if (myCondition == 0) {
    #ifdef PETER_PARKER
      slingWeb(100);
    #else
      findPhoneBooth();
    #endif
  }
}
```

## Brace-style

Marlin uses a brace style intended to
 - show the folded code block at the end of its opening line: `{``(...)`,
 - maintain consistency and develop a single style habit, and
 - maximize the number of code lines on-screen.

If vertical spacing makes code more readable, add _one_ extra blank line rather than using a different brace style.

 - Known by the Ancients as ["One True Brace Style"](//en.wikipedia.org/wiki/Indent_style#Variant:_1TBS_.28OTBS.29)
 - Place opening braces at the end of the line: `if (a == 1) {`
 - Do the same for a declaration line: `void pizza(int slices) {`
 - Vertically align closing braces to the opening line.

Here's an example of 1TBS style applied to a faux function:
```cpp
void my_function(void) {
  if (...) {
    ...
  }
  else {
    ...
  }

  switch (val) {
    case 1: SERIAL_CHAR('Q'); break;
    case 2: SERIAL_CHAR('T'); break;
  }
}
```

## Spacing

 - One space after control keywords:<br />`if (…)`, `while (…)`, `do {…} while(…)`, `switch (…)` etc.
 - No space is needed for `sizeof()` and other "function-like" language features.
 - No space between a function and its arguments: `val = myFunction(…);`
 - No spaces around `.` or `->` operators: `the_place = state->parks[echo];`
 - No space between a cast and its target: `old_state = (int)state;`
 - Use one space around (on each side of) most binary and ternary operators:<br />`myVar = aVar + bVar * cVar;`<br />`myVal = (a * b + b * c);`

## Trailing Whitespace

Don't leave trailing whitespace at the ends of lines. Some editors will auto-indent new lines, leaving extra whitespace behind on blank lines. As a result, you end up with lines containing trailing whitespace.

Git can warn you about patches that introduce trailing whitespace, and optionally strip the trailing whitespace for you; however, if applying a series of patches, this may make later patches in the series fail by changing their context lines.

## Commenting

Comments are good, but avoid over-commenting. _Never_ try to explain _how_ your code works in a comment: it's much better to write the code so that the working is obvious, and it's a waste of time to explain badly written code.

Generally, you want your comments to explain _what_ your code does, not _how_. Keep comments inside a function body short. If a function is so complex that you need to separately comment parts of it, consider splitting it up into simpler units. Make small comments to note or warn about something particularly clever (or ugly), but avoid excess. Reserve detailed comments for the head of the function, explaining what it does, and possibly _why_ it does it.

 - Use Doxygen-style comments for functions, classes, and other defined entities, and concentrate documentation in the `.h` files.

```cpp
/**
 * This is the preferred style for multi-line comments in the
 * Marlin Firmware source code. Please use it consistently.
 *
 * This mimics Doxygen/HeaderDoc style, and once keywords are added
 * we'll be able to auto-generate code documentation and provide more
 * complete development guidance.
 */
```

- Use C++ single-line style with `//` for comments under 3 lines.

```cpp
// A short comment that takes up only a line or two
// should just use end-of-line comment style.
```

# Names and Symbols

## Filenames

Filenames for Marlin code should favor `lowercase_with_underscores.ext` format. Contributed code will follow its own standard.

 - use `.cpp` for C++ sources
 - use `.c` for C only sources
 - use `.h` for headers of all types

## Directories
 - Lowercase names.
 - Marlin 1.0.x and 1.1.x retain a flat file layout
 - Marlin 1.2.x and up adopts a hierarchical file layout

## Capitalization

For Marlin variables, data members, functions, and methods use `lowercase_with_underscores`. Use `camelCase` names only when class names and methods already uses that format. Marlin classes may use `MyClassName` format or `my_class_name`. Core classes tend to use camel-case, with general-purpose classes using underscore format.

 - `my_function_name(int in_integer, float in_float=0.0)`
 - `MyClass`, `classMethod`, `classData`
 - `local_variable`, `global_variable`, `const_value`
 - `MACRO_NAME` – anything created with `#define`
 - `EnumeratedType`

## Libraries

Whenever possible, use the functions supplied by avr-libc or Arduino bundled libraries. Any libraries required to compile Marlin should be included in the package so that they are guaranteed to be compatible versions.

# Language Features

Marlin is written in C/C++ and needs be able to compile with the supplied `Makefile` or an up-to-date version of Arduino. With Marlin 1.1 we now support building with Arduino IDE, Teensyduino, PlatformIO, `make`, and `cmake`.

Going forward, Marlin does not need to be backward-compatible with older (pre-2017) toolchains. The minimum requirement for Marlin 1.1.x is Arduino IDE 1.6.8.

- **Do not use** extended C++ features like:
    - Exceptions (throw / catch)
    - Virtual functions / classes
    - Standard Template Library (STL)

- **Do use** modern C++11 features like:
    - `constexpr` values and functions.
    - `static_assert(test,"error")` to sanity-check `float` and `constexpr` values.

## Primitive Types

- Favor bit-size types like `uint8_t` and `int32_t` over `short`, `int`, and `long`. This helps to keep behavior consistent across architectures.
- AVR recasts `double` as `float`, so both are 32 bits long. Favor `float` and avoid `double` unless the extra precision is needed on a 32-bit architecture.

## Memory Usage

 - Dynamic allocation (`malloc()`, `free()`, `new`, `delete`) is ***verboten***!
   There may be some flexibility for certain 32-bit features.
 - Avoid unconstrained recursion (_e.g.,_ calling `idle()` from `idle()`) so the stack won't explode.
 - Avoid using globals and `static` locals because SRAM is a precious resource on many boards.
 - Use `PSTR` and `PROGMEM` macros to keep strings in Program Memory.

## Minimize Repetition

When possible, use macros, small functions, and other clever techniques to avoid redundancy. For example, instead of this...
```cpp
#if ENABLED(FEATURE_ONE)
  const char blue = '1';
#else
  const char blue = '0';
#endif
```
...do this...
```cpp
const char blue =
  #if ENABLED(FEATURE_ONE)
    '1'
  #else
    '0'
  #endif
;
```
...or, better yet, use this...
```cpp
const char blue = TERN(FEATURE_ONE, '1', '0');
```

## Avoid Expensive Code

 - `millis()` can be expensive so put it in a `const millis_t var` if you need to use the value more than once. (And always use the `ELAPSED`/`PENDING` macros - see below.)
 - Pre-calculate instead of calculating on the fly, when possible.
 - Use multiplication (of the reciprocal) instead of division, when possible.
 - Most code doesn't need to be optimized for speed, so favor smaller code.

## Best-Practices for #include

- Follow best practices for `#include`.
  - Only include the headers needed to provide the definitions required by the current source file. This helps provide an accurate view of dependencies.
  - Include `Marlin.h` only when you need its externs. Don't include `Marlin.h` when just `MarlinConfig.h` (or `MarlinConfigPre.h`) will do.
  - Included headers should be arranged in the following order:
    - `MarlinConfig.h` (or `MarlinConfigPre.h`), if configuration values are needed for `#if` or other uses.
    - After the main `#if` condition, include the file's own corresponding header.
    - Next, arrange project headers to prevent hiding broken dependencies. For example, if `grape.h` depends on `orange.h`, try to include `grape.h` before `orange.h` so that if `grape.h` fails to include `orange.h` an error will be thrown.
    - Last come system and library headers, such as `<Arduino.h>`, `<inttypes.h>`, and `<u8glib.h>`.

# Marlin-specific Conventions

## Preprocessor directives

 - Use `#define` instead of `const` for configurable values
 - Don't use `#if` / `#endif` for commenting-out unused, old or broken code. We have a git repository! If it's obsolete, delete it.
 - Use `#if ENABLED(FEATURE_NAME)` / `#endif` to compile code for an enabled feature. (Using these macros allows features to be set externally.)
 - Use `#if DISABLED(FEATURE_NAME)` / `#endif` to compile code for a disabled feature. See more macros below.
 - Use `#define` macros to avoid repeating boilerplate code.<br />Consider both readability and maintainability.
 - Label `#endif` with the opening `#if` condition(s) if the block is over \~15 lines. Make the label compact. For example, `#endif // SDSUPPORT || ULTRALCD`.

## FastIO

Marlin uses FastIO macros to read and write pins.

{:.pretty-list.headless}
Macro|Description
----|-----------
`READ(PIN)`|Read the state of a digital pin. Returns either `HIGH` or `LOW`.
`WRITE(PIN, STATE)`|Set a digital pin's state to either `HIGH` or `LOW`.

## Macros

Marlin provides several shorthand macros in the `macros.h` file. Get to know them and use them. Here are some of the most common:

{:.pretty-list.headless}
Macro|Description
----|-----------
`ENABLED(OPTION)`/`DISABLED(OPTION)`| Test whether an option is on/off. These macros are required so that `make` can set options.
`EITHER(OPT1, OPT2)`| True if either of the listed options is enabled.
`BOTH(OPT1, OPT2)`| True if both of the listed options is enabled.
`ANY(...)`| True if any of the listed options is enabled.
`MANY(...)`| True only if more than one of the listed options is enabled.
`ALL(...)`| True only if all of the listed options are enabled.
`NONE(...)`| True only if none of the listed options is enabled.
`COUNT_ENABLED(OPT1, OPT2, ...)`| Count the number of options in the list that are enabled.
`COUNT(array)`| Count the number of items in an array in-place. _e.g.,_ `for (i = 0; i < COUNT(my_arr); i++)`…
`WITHIN(var,low,high)`| Check that a variable is within a given range, inclusive.
`NUMERIC(c)`| True if a character is numeric: `0123456789`
`DECIMAL(c)`| True if a character is decimal: `0123456789.`
`NUMERIC_SIGNED(c)`| True if a character is signed numeric: `0123456789+-`
`DECIMAL_SIGNED(c)`| True if a character is signed decimal: `0123456789+-.`
`NOLESS(var,min)`/`NOMORE(var,max)`| Constrain a variable to a minimum or maximum value.
`FORCE_INLINE`| Force a function or method to be compiled inline.
`STRINGIFY(DEFINE)`| Resolve a define to a quoted string. (If undefined, the name of the define.)
`ARRAY_N(N,values)`| Expand into a prepopulated array of size N (based on an option like `EXTRUDERS`).
`PIN_EXISTS(NAME)`| True if the pin is defined. **Precompiler only.** (Takes a pin name minus `_PIN`.)
`PINS_EXISTS(...)`| True if all the listed pins are defined. **Precompiler only.** (Takes pin names minus `_PIN`.)
`ANY_PIN(...)`| True if any of the listed pins is defined. **Precompiler only.** (Takes pin names minus `_PIN`.)
`NEAR_ZERO(V)`/`UNEAR_ZERO(V)`/`NEAR(V1,V2)`| Check whether a float value is very near zero or another value.
`RECIPROCAL(N)`| The reciprocal of a value, except return 0.0 (not infinity) for 0.0.
`RADIANS(d)`/`DEGREES(r)`| Convert degrees to radians and back again.
`FIXFLOAT(N)`| Add a tiny value to a float to compensate for rounding errors.
`NOOP`| A do-nothing macro to use for empty macro functions.

## Ternary Macros

Since Marlin 2.0 all the macros above except the ones marked "**Precompiler only**" can be used anywhere in code where a value would be used. This is a really handy capability and allows the code to be a lot more concise. The `ENABLED` and related macros simply emit an integer 0 or 1. A more interesting macro is `TERN` and its relatives `TERN0`, `TERN1`, `TERN_`, `IF_ENABLED`, and `IF_DISABLED`.

Macro|Description
----|-----------
`TERN(OPTION, T, F)`| If `OPTION` is enabled emit T otherwise emit F.
`TERN0(OPTION, T)`| If `OPTION` is enabled emit T otherwise emit 0 (`false`).
`TERN1(OPTION, T)`| If `OPTION` is enabled emit T otherwise emit 1 (`true`).
`TERN_(OPTION, T)`| If `OPTION` is enabled emit T otherwise emit nothing.
`IF_ENABLED(OPTION, T)`| Alias for `TERN_`.
`IF_DISABLED(OPTION, F)`| If `OPTION` is disabled emit F otherwise emit nothing.

Here are some ternary macro examples:
```cpp
millis_t ms = millis() + TERN(USE_LONG_TIMEOUT, 200, 100); // A longer timeout
bool is_ready = TERN1(HAS_READY_STATE, get_ready_state()); // Get state (or assume true)
TERN_(EEPROM_SETTINGS, settings.read()); // Read settings (or not)
```

## Time Comparison

Use the following macros when comparing two millis count values:

- `PENDING(ms,time)`: Relative to `ms`, `time` is pending.
- `ELAPSED(ms,time)`: Relative to `ms`, `time` has elapsed.

When using `ELAPSED` and `PENDING`, always compare against the _next time_ rather than the _last time_. This...
```cpp
const millis_t ms = millis();
if (ELAPSED(ms, next_event_ms)) {
  next_event_ms = ms + TIME_INTERVAL;
  ...
}
```
...will be smaller and faster than this...
```cpp
const millis_t ms = millis();
if (ELAPSED(ms, last_event_ms + TIME_INTERVAL)) {
  last_event_ms = ms;
  ...
}
```

## Serial Macros

The `serial.h` file also includes several macros to make it easier to create PROGMEM strings and print them to the serial output. Below are a few of them. See the `serial.h` file for others.

{:.pretty-list.headless}
Macro|Description
----|-----------
`SERIAL_ECHO_START()`| Send "`echo:`" to the serial output.
`SERIAL_ERROR_START()`| Print "`error:`" to the serial output.
`SERIAL_ECHO("hello")`| Print an ASCII string stored in SRAM to serial out.
`SERIAL_ECHOLN("hello")`| Print an ASCII string stored in SRAM to serial out, appending a newline.
`SERIAL_ECHOPGM("hello")`| Wrap the given ASCII string in `PSTR` and print it to serial out.
`SERIAL_ECHOLNPGM("hello")`| Wrap the given ASCII string in `PSTR` and print it to serial out, appending a newline.
`SERIAL_ECHOPAIR("Hello:",val)`| Wrap an ASCII string in `PSTR`; print it and a value to serial out.
`SERIAL_ECHOLNPAIR("Hello:",val)`| Wrap an ASCII string in `PSTR`; print it, a value, and a newline to serial out.

## Maths macros

Use the following macros in place of their normal lower-case versions. These ensure the smaller 32-bit `float` on all architectures. The initial 32-bit targets for Marlin, while significantly faster, do not have a floating-point unit either, so `float` maths is more compatible while not sacrificing performance.

- `ATAN2(y, x)`
- `FABS(x)`
- `POW(x, y)`
- `SQRT(x)`
- `CEIL(x)`
- `FLOOR(x)`
- `LROUND(x)`
- `FMOD(x, y)`
- `HYPOT(x,y)`

## Adding a New Feature

Since Marlin needs to runs on the most modest hardware, much care has been taken to keep code size small and avoid overtaxing the CPU. AVR and some 32-bit CPUs have no FPU, so it's best to avoid floating point operations whenever possible, and add-on features should also conserve SRAM. Right out of the gate, the default configuration of Marlin 1.1 uses over 2.6K of SRAM, and won't fit on an UNO.

 - `#define` is used liberally, especially for configuration values
 - Use `#define MYFEATURE` for feature switches.
 - Feature settings have some flexibility, and can have values.
 - Use `#if ENABLED(MYFEATURE)` / `#if DISABLED(MYFEATURE)` rather than `#ifdef` or `#if defined()`. The `ENABLED`/`DISABLED` macros allow features to be overridden by `make`.
 - Indent `#if…`/`#endif` blocks and their contents with the rest of the cascade. This allows editors that only have naive code-folding to fold blocks properly.
 - Add a comment: `#endif // MYFEATURE` — but only if the `#endif` is far away (lets say, over 10 lines) from the starting `#if`.

### New Feature Example
**In Configuration.h:**
```cpp
// Enable this to make something new happen
#define MYFEATURE
#if ENABLED(MYFEATURE)
  #define MYFEATURE_SETTING 12.5
  #undef OVERRIDDEN_FEATURE // This won't be needed with MYFEATURE
#endif
```
**In SanityCheck.h:**
```cpp
/**
 * My feature
 */
#if ENABLED(MYFEATURE) && ENABLED(INCOMPAT_FEATURE)
  #error MYFEATURE is not compatible with INCOMPAT_FEATURE
#endif
```
**In Conditionals.h:**
```cpp
/**
 * My feature
 */
#if ENABLED(MYFEATURE)
  #undef OVERRIDDEN_FEATURE // This feature is disabled by MYFEATURE
  #undef OVERRIDDEN_SETTING // This setting will always be 1234 with MYFEATURE
  #define OVERRIDDEN_SETTING 1234
#endif
```
**In MarlinCore.cpp, for example:**
```cpp
// My Feature, when Your Feature is disabled
#if ENABLED(MYFEATURE) && DISABLED(YOURFEATURE)
  my_feature_function(); // Run my feature, possible an inline function taking refs
  #if ENABLED(HISFEATURE)
    ...
    call_something();
    ...
  #else // !HISFEATURE
    ...
    call_something_else();
    ...
  #endif // !HISFEATURE
#endif // MYFEATURE
```
