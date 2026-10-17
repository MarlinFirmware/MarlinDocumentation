---
title: Media
parent: Settings
layout: setting
section: media
settings:
- name: SDSUPPORT
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    ![SD Card](/assets/images/config/sdcard.jpg){: .float-right .framed }

    Enable to use SD printing, whether as part of an LCD controller or as a standalone SDCard slot.

    {: .note }
    > The `SDSUPPORT` option must be enabled or SD printing will not be supported. It is no longer enabled automatically for LCD controllers with built-in SDCard slot.
  comment: |-
    SD CARD

    SD Card support is disabled by default. If your controller has an SD slot, you must uncomment the following option or it won't work.
- name: SD_CHECK_AND_RETRY
  file: Configuration.h
  type: switch
  disabled: true
  requires: SDSUPPORT
  long: Use CRC checks and retries on the SD communication.
  comment: |-
    SD CARD: ENABLE CRC

    Use CRC checks and retries on the SD communication.
---

Options in the `media` section of the Marlin configuration files.

See [Media Printing](/docs/features/media_printing.html) for how these options work together.
