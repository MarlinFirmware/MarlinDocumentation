---
title:        'Coding Standards'
description:  'Guidelines for Marlin code formatting, methodologies, and standards.'
tag: contributing 1

author: thinkyhead
category: [ development ]
---

Please follow these formatting guidelines and coding standards when contributing code to Marlin. Pull requests that don't follow good coding standards will be postponed for cleanup.

## Coding Style
### Indentation
Indentation is important for readability and maintainability of code, and provides guidance for naïve code editors (e.g., TextMate, Sublime, et. al.) to properly fold code blocks by level.

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

### Brace-style
Marlin uses a brace style that maximizes the number of code lines on-screen, and which causes folded code blocks to appear at the end of the line where they begin. If vertical spacing makes code more readable, add a blank line rather than using a different bracket style.

 - "One True Bracket" Style – "1TBS" – to rule them all.
 - Place opening braces at the end of lines, including in declarations.
 - Closing braces should always align with the starting column of the opening line.

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

### Spacing

 - Use one space between keywords and their conditions:<br />`if (…)`, `while (…)`, `do {…} while(…)` etc. No space is needed for `sizeof()` and other "function-like" built-ins.
 - No spaces between functions and their arguments:<br />`myFunction(…);`
 - No spaces around `.` or `->` operators.
 - Use one space around (on each side of) most binary and ternary operators:<br />`myVar = aVar + bVar * cVar;`<br />`myVal = (a * b + b * c);`

### Trailing Whitespace

Don't leave trailing whitespace at the ends of lines. Some editors will auto-indent new lines, leaving extra whitespace behind on blank lines. As a result, you end up with lines containing trailing whitespace.

Git can warn you about patches that introduce trailing whitespace, and optionally strip the trailing whitespace for you; however, if applying a series of patches, this may make later patches in the series fail by changing their context lines.

### Commenting

Comments are good, but avoid over-commenting. _Never_ try to explain _how_ your code works in a comment: it's much better to write the code so that the working is obvious, and it's a waste of time to explain badly written code.

Generally, you want your comments to explain _what_ your code does, not _how_. Keep comments inside a function body short. If a function is so complex that you need to separately comment parts of it, consider splitting it up into simpler units. Make small comments to note or warn about something particularly clever (or ugly), but avoid excess. Reserve detailed comments for the head of the function, telling people what it does, and possibly _why_ it does it.

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

## Names and Symbols

### Filenames

Filenames for Marlin code should favor `lowercase_with_underscores.ext` format. Contributed code will follow its own standard.

 - use `.cpp` for C++ sources
 - use `.c` for C only sources
 - use `.h` for headers of all types

### Directories
 - Lowercase names.
 - Marlin 1.0.x and 1.1.x retain a flat file layout
 - Marlin 1.2.x and up adopts a hierarchical file layout

### Capitalization

For Marlin variables, data members, functions, and methods use `lowercase_with_underscores`. Use `camelCase` names only when class names and methods already uses that format. Marlin classes should use `my_class_name` format.

 - `my_function_name(int in_integer, float in_float=0.0)`
 - `MyClass`, `classMethod`, `classData`
 - `local_variable`, `global_variable`, `const_value`
 - `MACRO_NAME` – anything created with `#define`
 - `EnumeratedType`

### Libraries

Whenever possible, use the functions supplied by avr-libc or Arduino bundled libraries. Any libraries required to compile Marlin should be included in the package so that they are guaranteed to be compatible versions.

## Language Features

Marlin is written in C/C++ and needs be able to compile with the supplied `Makefile` or an up-to-date version of Arduino. With Marlin 1.1 we now support building with Arduino IDE, Teensyduino, PlatformIO, `make`, and `cmake`.

Going forward, Marlin does not need to be backward-compatible with older (pre-2017) toolchains. The minimum requirement for Marlin 1.1.x is Arduino IDE 1.6.8.

- **Do not use** extended C++ features like:
    - Exceptions (throw / catch)
    - Virtual functions / classes
    - Standard Template Library (STL)

- **Do use** modern C++11 features like:
    - `constexpr` values and functions.
    - `static_assert(test,"error")` to sanity-check `float` and `constexpr` values.

### Primitive Types

- Favor bit-size types like `uint8_t` and `int32_t` over `short`, `int`, and `long`. This helps to keep behavior consistent across architectures.
- AVR recasts `double` as `float`, so both are 32 bits long. Favor `float` and avoid `double` unless the extra precision is needed on a 32-bit architecture.

### Memory Usage

 - Dynamic allocation (`malloc()`, `free()`, `new`, `delete`) is ***verboten***!
 - Avoid unconstrained recursion so the stack won't explode.
 - Avoid using globals and `static` locals because SRAM is a precious resource.
 - Use `PSTR` and `PROGMEM` macros to keep strings in Program Memory.

### Minimize Repetition

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

### Avoid Expensive Code

 - `millis()` can be expensive so put it in a `const millis_t var` if you need to use the value more than once. (And always use the `ELAPSED`/`PENDING` macros - see below.)
 - Pre-calculate instead of calculating on the fly, when possible.
 - Use multiplication (of the reciprocal) instead of division, when possible.
 - Most code doesn't need to be optimized for speed, so favor smaller code.

## Marlin-specific Conventions

### Preprocessor directives

 - Use `#define` instead of `const` for configurable values (for now)
 - Don't use `#if` / `#endif` for commenting-out unused, old or broken code. We have a git repository! If it's obsolete, delete it.
 - Use `#if ENABLED(FEATURE_NAME)` / `#endif` to compile enabled features. (Using these macros allows features to be set externally.)
 - Use `#if DISABLED(FEATURE_NAME)` / `#endif` to compile disabled features. (Using these macros allows features to be set externally.)
 - Use `#define` macros to avoid repeating boilerplate code.<br />Consider both readability and maintainability.
 - Label `#endif` with the opening `#if` condition(s) if the block is over ~15 lines. Make the label compact. For example, `#endif // SDSUPPORT || ULTRALCD`.

### Macros

Marlin provides several shorthand macros in the `macros.h` file. Get to know them and use them. Here are some of the most common:

- `ENABLED(OPTION)`/`DISABLED(OPTION)`: Test whether an option is on/off. Precompiler only.
- `COUNT(array)`: Count the number of items in an array in-place. e.g., `for (i = 0; i < COUNT(my_arr); i++)`…
- `WITHIN(var,low,high)`: Check that a variable is within a given range, inclusive.
- `NUMERIC(c)`: Check whether a character is `0123456789`.
- `DECIMAL(c)`: Check whether a character is `.0123456789`.
- `NUMERIC_SIGNED(c)`: Check whether a character is `+-0123456789`.
- `DECIMAL_SIGNED(c)`: Check whether a character is `+-.0123456789`.
- `NOLESS(var,min)`: Constrain a variable to a minimum value.
- `NOMORE(var,max)`: Constrain a variable to a maximum value.
- `FORCE_INLINE`: Force a function or method to be compiled inline (almost like a macro).
- `STRINGIFY(DEFINE)`: Resolve a define to a quoted string. (If undefined, the name of the define.)
- `ARRAY_N(N,values)`: Expand into a prepopulated array of size N (based on an option like `EXTRUDERS`).
- `PIN_EXISTS(NAME)`: True if the pin is defined. Precompiler only. (Takes the name minus `_PIN`.)
- `NEAR_ZERO(V)`/`UNEAR_ZERO(V)`/`NEAR(V1,V2)`: Check whether a float value is very near zero or another value.
- `RECIPROCAL(N)`: The reciprocal of a value, except return 0.0 (not infinity) for 0.0.
- `RADIANS(d)`/`DEGREES(r)`: Convert degrees to radians and back again.
- `FIXFLOAT(N)`: Add a tiny value to a float to compensate for rounding errors.
- `NOOP`: A do-nothing macro to use for empty macro functions.

### Time Comparison

Use the following macros when comparing two millis count values:

- `PENDING(ms,time)`: The `time` is pending, compared to `ms`.
- `ELAPSED(ms,time)`: The `time` has elapsed, compared to `ms`.

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

### Serial Macros

The `serial.h` file also includes several macros to make it easier to create PROGMEM strings and print them to the serial output. Below are a few of them. See the `serial.h` file for others.

- `SERIAL_PROTOCOL("hello")`: Print an ASCII string stored in SRAM to serial out.
- `SERIAL_PROTOCOLLN("hello")`: Print an ASCII string stored in SRAM to serial out, appending a newline.
- `SERIAL_PROTOCOLPGM("hello")`: Wrap the given ASCII string in `PSTR` and print it to serial out.
- `SERIAL_PROTOCOLLNPGM("hello")`: Wrap the given ASCII string in `PSTR` and print it to serial out, appending a newline.
- `SERIAL_PROTOCOLPAIR("Hello:",val)`: Wrap an ASCII string in `PSTR`; print it and a value to serial out.
- `SERIAL_PROTOCOLLNPAIR("Hello:",val)`: Wrap an ASCII string in `PSTR`; print it, a value, and a newline to serial out.
- `SERIAL_ECHO_START()`: Send "`echo:`" to the serial output.
- `SERIAL_ECHO(S)`, `SERIAL_ECHOLN(S)`, `SERIAL_ECHOPGM(S)`, etc., just like the `PROTOCOL_*` macros above.
- `SERIAL_ERROR_START()`: Print "`error:`" to the serial output.
- `SERIAL_ERROR(S)`, `SERIAL_ERRORLN(S)`, `SERIAL_ERRORPGM(S)`, etc.

### Adding a New Feature

Since Marlin needs to runs on the most modest hardware, much care has been taken to keep code size small and avoid overtaxing the CPU. AVR and some 32-bit CPUs have no FPU, so it's best to avoid floating point operations whenever possible, and add-on features should also conserve SRAM. Right out of the gate, the default configuration of Marlin 1.1 uses over 2.6K of SRAM, and won't fit on an UNO.

 - `#define` is used liberally, especially for configuration values
 - Use `#define MYFEATURE` for feature switches.
 - Feature settings have some flexibility, and can have values.
 - Test features with `#if ENABLED(MYFEATURE)` / `#if DISABLED(MYFEATURE)`. (Using these macros allows features to be set externally.)
 - Indent the code between `#if…` and `#endif` for editors that only have naive code-folding.
 - Add a comment: `#endif // MYFEATURE` — Only if the `#endif` is ''far away''!

#### New Feature Example
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
**In Marlin_main.cpp, for example:**
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
