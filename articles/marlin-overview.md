---
layout: articles

meta:
  title:        'Introduction'
  description:  'Learn how to get started using Marlin. Find out what Marlin has to offer and how it can help your 3D printer print faster, better and cleaner.'
  categories:   [ features ]

navigation:
  show_description: false
---
Marlin is a highly optimized firmware for 3D printers based on AVR microprocessor (such as those used on the [Arduino](http://arduino.cc) platform) with movement driven by stepper motors.

Through the use of a programmer tool, Marlin is flashed directly onto the PROM on your 3D printer's controller board, and will thereafter run standalone. Marlin controls the input/output, voltage states, and movement of the 3D printer, taking buffered command streams from SD cards and host controllers.

Marlin aims to be adaptable to as many boards and as many configurations as possible, with a very lean default profile. Depending on configuration options, the size of the Marlin binary image may be as low as 50K or over 200K.

## Official Releases ##
- Current Release: Marlin [version 1.0.2-1](https://github.com/MarlinFirmware/Marlin/releases/tag/1.0.2-1)
- Upcoming Release: Marlin [version 1.1.0](https://github.com/MarlinFirmware/Marlin/releases)

## Features ##

A huge number of features are included, such as:

* A rich dialect of [[G-Code in Marlin|G-Code]]
* USB communication with messages for hosts
* A growing list of [[Supported Hardware|specific boards]]. Over 40 now supported.
* More than 20 languages supported, including Japanese and Russian
* Support for [[LCD Controllers]] and [[SD cards]]
* In addition to [[Cartesian_Kinematics|Cartesian]] kinematics Marlin also supports [[Delta_Kinematics|Delta]], [[SCARA_Kinematics|SCARA]], [[CoreXY]], and [[CoreXZ]]
* Support for up to 4 extruders
* Support for [[Thermistors]] and [[thermocouples]]
* [[Thermal Runaway Protection]]
* [[EEPROM]] save and restore
* Support using switches or sensors as proximity probes
 * Probes on servo arms
 * Probes that can be picked up and dropped
 * Probes that can be enabled/disabled
* Bed Tilt Compensation, for better results printing on a non-level bed
 * [[Mesh Bed Leveling]], with save to EEPROM
 * [[Manual Bed Leveling]], step-by-step using an LCD controller
 * [[Bed Auto Leveling]], which requires some kind of Z Probe
* [[Firmware Retraction]], to allow retraction tuning without re-slicing
* [[Acceleration]] and [[Jerk]] tuning, for better corners and surface finish
* Support for [[Dual X Carriage]] setups
* Support for [[Filament Runout Sensor]] and [[Filament Width Sensor]]
* ...and

## Development ##
For information related to **cutting-edge development and testing on Version 1.2 and beyond**, head over to the [Marlin Development Wiki](https://github.com/MarlinFirmware/MarlinDev/wiki). There you can find guidance on the new file layout, obtaining the hardware support package, and how to integrate Marlin with Arduino >= 1.6.7.

For information related to **patching current releases and release candidates (beta releases)** see [[Reporting Bugs]] and [[Contributing]] here in this wiki.


