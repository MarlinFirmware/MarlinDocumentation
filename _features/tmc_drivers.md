---
title:        Trinamic drivers
description:  Using Trinamic TMC based stepper drivers.

author: teemuatlut
category: [ features ]
---

## Advantages

Trinamic ftw

## Installing the library

## Wiring

### TMC2130

SCK -> SCK
MOSI -> SDI
MISO -> SDO
CS -> CS

### TMC2208

TX -> PD_UART
RX -> 1kohm -> PD_UART

### TMC2660

### TMC2224

## FYSETC drivers

## Features and options

### R_SENSE
### HOLD_MULTIPLIER
### INTERPOLATE
### CURRENT
### MICROSTEPS
### STEALTHCHOP
### AUTOMATIC_CURRENT_CONTROL
### CURRENT_STEP
### AUTO_ADJUST_MAX
### REPORT_CURRENT_CHANGE
### HYBRID_THRESHOLD
### SENSORLESS_HOMING
### HOMING_SENSITIVITY
### TMC_DEBUG
### TMC_ADV

## GCodes
### M122
### M906
### M911
### M912
### M913
### M914
### M915

## Troubleshooting