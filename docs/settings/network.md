---
title: Network
parent: Settings
layout: setting
section: network
settings:
- name: MAC_ADDRESS
  file: Configuration_adv.h
  type: array
  default: '{ 0xDE, 0xAD, 0xBE, 0xEF, 0xF0, 0x0D }'
  requires: HAS_ETHERNET
  comment: Ethernet. Use M552 to enable and set the IP address.
- name: WIFISUPPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    Native ESP32 board with WiFi or add-on ESP32 WiFi-101 module

    Enable one or the other. The two are separate implementations sharing no code, and each has its own extras below.

    WIFISUPPORT covers both an add-on WiFi module wired to the controller and Marlin's own WiFi on an ESP32 build. `ESP3D_WIFISUPPORT` is ESP32 only.
- name: ESP3D_WIFISUPPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: ESP3D Library WiFi management (https://github.com/luc-github/ESP3DLib)
- name: WEBSUPPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: WIFISUPPORT
  comment: Marlin's own webserver and OTA, implemented in HAL/ESP32/wifi/ and built only for an ESP32 build of Marlin. With an add-on WiFi module the module runs its own firmware, so neither option has any effect there.
- name: OTASUPPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: WIFISUPPORT
  comment: Support over-the-air firmware updates
- name: WIFI_CUSTOM_COMMAND
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ESP3D_WIFISUPPORT
  block_clause: '!WIFISUPPORT'
  comment: ESP3D brings its own webserver and OTA, so WEBSUPPORT and OTASUPPORT don't apply here. The network is configured at runtime with '[ESP100]' / '[ESP101]' and stored on the ESP, so WIFI_SSID / WIFI_PWD don't apply either.
---

Options in the `network` section of the Marlin configuration files.
