---
layout: articles

meta:
  title:        'Introduction'
  description:  'Learn how to get started using Marlin. Find out what Marlin has to offer and how it can help your 3D printer print faster, better and cleaner.'
  categories:   [ features ]

navigation:
  show_description: true
---
Marlin is a firmware for 3D printers based on AVR microprocessors such as those used on the [Arduino](http://arduino.cc) platform, it allows full control over the 3D printer, extrusors and heated building plates either by being connected to a host PC or in a standalone mode. Marlin code resides in the PROM on the controller board, usually called firmware, and controls the input/output, voltage states, and movement of the 3D printer.

Depending on configuration options, the size of the Marlin binary image may be anywhere from 50K to over 200K.

It supports a huge number of features, such as:

* Compensation for Bed Position
    * Deployment of sensors for bed probing
    * Manually, or by Servo, or other programmable mechanisms
* [[Bed Auto Leveling]] -- Compensation for Un-level Beds
* [[Mesh Bed Leveling]]
* [[Manual Bed Leveling]]
* [[Firmware Retraction]]
* [[Thermal Runaway Protection]]
* [[EEPROM]] save and restore
* Thermistors and thermocouples
* [[LCD Controllers]] and [[SD cards]]
* [[Delta_Kinematics|Delta]], [[SCARA_Kinematics|SCARA]], and [[Cartesian_Kinematics|Cartesian]] kinematics
* USB communication
* A rich dialect of [[G-Code in Marlin|G-Code]]
* Up to 4 extruders
* Several [[Supported Hardware|specific boards]]

## Essential Resources ##

* [Marlin Development Repository on Github](https://github.com/MarlinFirmware/MarlinDev) – Marlin Development Central. Get, and contribute to, the latest development code for Marlin firmware here.
* [Marlin Release Repository on Github](https://github.com/MarlinFirmware/Marlin) – Get the latest released, or soon to be released, Marlin firmware here.
