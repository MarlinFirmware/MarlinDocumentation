---
tag: m110
title: Set Line Number
brief: Set the current line number.

experimental: false
group: hosts

codes:
  - M110

long: Hosts can use `M110` to set the current line number in a print job. Each line number sent by a host must be one higher than the previous line number, or the firmware will ignore the line and send an error requesting a resend of the missing line. This is one technique Marlin uses to keep in sync with hosts.

notes:
  - 'All these are valid: `N100 M110`, `M110 N100`, `N101 M110 N100`.'

parameters:
  -
    tag: N
    optional: false
    description: Line number
    values:
      -
        tag: line
        type: int

examples:

---

