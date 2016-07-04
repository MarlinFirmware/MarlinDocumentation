---
title:        'Coding Standards'
description:  'Overview if formatting guidelines and coding standards to be used when contributing code to Marlin'

category: [ development, needs-review ]
---

Please follow these formatting guidelines and coding standards when contributing code to Marlin. Pull requests that don't follow good coding standards may be postponed for cleanup.

Coding Style
------------

### Indentation

Indentation is important for readability and maintainability of code, and provides guidance for naïve code editors (e.g., TextMate, Sublime, et. al.) to properly fold code blocks by level.

-   2 spaces. Don't use tabs at all.
-   All blocks indented, including `#if` blocks and other non-brace compiler blocks

<!-- -->

    void myFunction() {
      if (myCondition == 0) {
        #ifdef PETER_PARKER
          slingWeb(100);
        #else
          findPhoneBooth();
        #endif
      }
    }

### Bracket-style

We've chosen a bracket (i.e., *brace*) style that shows the most code lines on screen, and which causes folded code blocks to appear at the end of the line where they begin. If vertical spacing makes code more readable, add a blank line rather than using a different bracket style.

-   “One True Bracket” Style – “1TBS” – to rule them all
-   Almost all opening braces at the end of lines, including declarations:

<!-- -->

    if (...) {
      ...
    }
    else {
      ...
    }

-   Closing braces should always align with the starting column of the opening line

### Spacing

-   One space between keywords and their conditions:
    `if` `(…)`, `while` `(…)`, `do` `{…}` `while(…)` etc.
-   No space between functions and their arguments:
    `myFunction(…);`
-   Spaces between operators, most of the time:
    `myVar` `=` `aVar` `+` `bVar` `*` `cVar;`
    `myVal` `=` `(a*b` `+` `b*c);` `//` `grouping`

### Comments

-   Doxygen-style headings (documenting in .h files), C++ single-line style // for under 3 lines
-   Multi-line use asterisks in the second column

Names and Symbols
-----------------

### Capitalization

-   `your_function_name(int` `in_integer,` `float` `in_float=0.0)`
-   `MyClass`
-   `ClassMethod`
-   `classData`
-   `local_variable`
-   `global_variable`
-   `MACRO_NAME` – anything created with `#define`
-   `EnumeratedType`

### Filenames

-   use `.cpp` for C++ sources
-   use `.c` for C only sources
-   use `.h` for headers of all types

### Directories

-   Lowercase names.
-   Note that Arduino cannot (easily) compile code in a sketch subfolder

### Libraries

Whenever possible use functions supplied by avr-libc or Arduino bundled libraries. Any libraries required to compile Marlin should be included in the package so that they are guaranteed to be compatible versions.

Extended Language Features
--------------------------

Marlin is written in C/C++ and must be able to compile with the supplied Makefile and an up-to-date version of Arduino. Backward-compatibility to earlier versions of Arduino is not required, but we can deal with this on an issue-to-issue basis.

### Primitive Types

-   On AVR both `int` and `short` are 16-bits, and `long` is 32 bits.

### Memory Usage

-   DO NOT use dynamic memory allocations such as `malloc()`, `free()`, `new`, `delete`
-   *(Some exceptions may be considered, with caveats!)*

### No Extended Features

-   DO NOT use extended C++ features like:

` * Exceptions (throw / catch)`
` * Virtual functions / classes`
` * Templates`
` * Standard Template Library (STL)`

### Avoid Expensive Code

-   `millis()` can be expensive so put it in a `uint32_t` if you need it more than once.
-   Pre-calculate if possible instead of calculating on the fly

Marlin-specific Conventions
---------------------------

### Preprocessor directives

-   Use `#define` instead of `const` for configurable values (for now)
-   Don't use `#if` / `#endif` for commenting-out unused, old or broken code. We have a git repository! If it's obsolete, delete it.
-   Use `#if` `ENABLED(FEATURE_NAME)` / `#endif` to compile enabled features. (Using these macros allows features to be set externally.)
-   Use `#if` `DISABLED(FEATURE_NAME)` / `#endif` to compile disabled features. (Using these macros allows features to be set externally.)
-   Use `#define` macros to avoid repeating boilerplate code.
    Consider both readability and maintainability.

### Adding a New Feature

Since Marlin is an Arduino firmware and not a desktop application, much care has been taken to keep code size at a minimum, and to avoid using any features that may overtax the hardware, including demanding math operations. New features should try to conserve the limited resources available and allocate a fixed amount of memory (apart from `auto` variables) to do their work.

-   `#define` is used liberally, especially for configuration values
-   Use `#define` `MYFEATURE` for feature switches.
-   Feature settings have some flexibility, and can have values.
-   Test features with `#if` `ENABLED(MYFEATURE)` / `#if` `DISABLED(MYFEATURE)`. (Using these macros allows features to be set externally.)
-   Indent the code between `#if…` and `#endif` for editors that only have naive code-folding.
-   Add a comment: `#endif` `//` `MYFEATURE` — Only if the `#endif` is *far away*!

#### New Feature Example

**In Configuration.h:**

    // Enable this to make something new happen
    #define MYFEATURE
    #if ENABLED(MYFEATURE)
      #define MYFEATURE_SETTING 12.5
      #undef OVERRIDDEN_FEATURE // This won't be needed with MYFEATURE
    #endif

**In SanityCheck.h:**

    /**
     * My feature
     */
    #if ENABLED(MYFEATURE) && ENABLED(INCOMPAT_FEATURE)
      #error MYFEATURE is not compatible with INCOMPAT_FEATURE
    #endif

**In Conditionals.h:**

    /**
     * My feature
     */
    #if ENABLED(MYFEATURE)
      #undef OVERRIDDEN_FEATURE // This feature is disabled by MYFEATURE
      #undef OVERRIDDEN_SETTING // This setting will always be 1234 with MYFEATURE
      #define OVERRIDDEN_SETTING 1234
    #endif

**In Marlin\_main.cpp, for example:**

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

Useful links
------------

-   \[Atmel AVR4027: Tips and Tricks to Optimize Your C Code for 8-bit AVR Microcontrollers\](http://www.atmel.com/images/doc8453.pdf)
