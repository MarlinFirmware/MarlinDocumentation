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
- name: MKS_WIFI_MODULE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(WIFISUPPORT, ESP3D_WIFISUPPORT)
  brief: Use the onboard MKS WiFi module.
  comment: |-
    MKS WiFi module: an ESP8266/ESP32 co-processor on its own UART, fitted to MKS Robin / Neptune / Monster boards. Unlike a plain add-on module, which just bridges a serial port, Marlin talks to this one directly to transfer files and to set the network from WIFI_SSID / WIFI_PWD below.

    Requires a board that defines WIFI_RESET_PIN and WIFI_IO1_PIN, and SDSUPPORT for file transfers.
- name: MKS_WIFI_AP_MODE
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(WIFISUPPORT, ESP3D_WIFISUPPORT) && MKS_WIFI_MODULE
  comment: |-
    WIFI_SSID / WIFI_PWD are only the defaults here. The network is stored with the rest of Marlin's settings, so M587 or the `TFT_LVGL_UI` screens can change it at runtime and M500 makes the change stick. M502 restores the values below.

    - `M587` ; Report the current network
    - `M587` S"MyNetwork" P"pass"  ; Join a network (needs `GCODE_QUOTED_STRINGS`)
    - `M587` A1                    ; Host an access point instead
- name: WEBSUPPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(WIFISUPPORT, ESP3D_WIFISUPPORT)
  block_clause: '!MKS_WIFI_MODULE'
  comment: Webserver and OTA updates. With WIFISUPPORT these are Marlin's own, implemented in HAL/ESP32/wifi/ and built only for an ESP32 build of Marlin. With an add-on WiFi module the module runs its own firmware, so neither option has any effect there. With `ESP3D_WIFISUPPORT` these enable the ESP3D web interface and ESP3D OTA updates.
- name: OTASUPPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(WIFISUPPORT, ESP3D_WIFISUPPORT)
  block_clause: '!MKS_WIFI_MODULE'
  comment: Support over-the-air firmware updates
- name: WIFI_CUSTOM_COMMAND
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(WIFISUPPORT, ESP3D_WIFISUPPORT) && ESP3D_WIFISUPPORT
  comment: Accept ESP3D '[ESP...]' commands from the host
---

Options in the `network` section of the Marlin configuration files.
