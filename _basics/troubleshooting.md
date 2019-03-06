---
title:        Troubleshooting Tips
description:  Getting past common configuration problems

author: thinkyhead
category: [ articles, getting-started ]
---

{% alert warning %}
  This is a brand new page in need of content. Please contribute!
{% endalert %}

### EEPROM

After flashing a new version of Marlin, the existing EEPROM contents may no longer conform to the updated EEPROM layout. As a result, you may see an error like one of these:

```
Error:EEPROM datasize error.
```
```
EEPROM CRC mismatch - (stored) 4235 != 6244 (calculated)!
```

**Troubleshooting Procedure**

- If using Octoprint, turn off the option to disconnect on "Error" messages before proceeding.
- Do `M502` and `M500` and then reboot the machine. This procedure will initialize the EEPROM to your configured "factory" settings.
- If you still see checksum or data-size errors, add the following option to your `Configuration.h`, flash, and reboot.
  ```cpp
  #define DEBUG_EEPROM_READWRITE
  ```
  This option makes Marlin check the EEPROM data during `M501` (read) and `M500` (write) and report mismatched fields. Please report these errors to the Marlin project, because a mismatched field may indicate a bug in the code.


### Sanity Check Errors

The `SanityCheck.h` file tries to make sure that old settings are updated, that incompatible options are prevented, and that settings have reasonable values. Be sure to read and follow the direction provided by these checks.

### Build Too Large

A Marlin build can range in size from under 60K to over 200K with a generous complement of features enabled. All features try to use as little SRAM as possible, but some settings may use a lot of SRAM. As a guide and starting-point, be sure to use the example configuration included with Marlin that best matches your specific machine model.
