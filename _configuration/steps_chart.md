---
title:        Motor Steps/mm Chart
description:  Get all steps/mm in one place

author: Sarf2k4
category: [ configuration ]
---
# Introduction

Getting the Steps/mm so accurate is crucial in order to get the printer able to print in high accuracy. However, it is not advisable to do "try and error" as it will waste more resources than just finding the accurate value for steps/mm setting.

This page is the steps/mm chart so every user don't have to do so much digging such as the forums or misleading search engine or insufficient information or unnecessary steps requred in order to get the answers.

There are three different sections for the steps/mm chart; XY, Z, and E.

{% alert info %}
Some of which that the steps/mm info are missing below, it means that they are yet to be found. Please provide information into github issue tracker
{% endalert %}

## XY Steps/mm

This is the X and Y axis steps/mm chart. They are usually identical and they often uses belt driven type.

Following are the chart for commonly used XY steps/mm setting

Belt Type|Pitch(mm)|Pulley Tooth Count|Steps/mm
GT2|2|20|80
GT2|2|16|100

{% alert info %}
For more settings than the above chart, kindly go into [Prusa's calculators](http://calculator.josefprusa.cz)
{% endalert %}

## Z Steps/mm

Z axis usually uses leadscrew or acme screws or threaded rods. Both leadscrew and acme screws are different in terms of their appearance and performance. In modern days of 3d printing, acme screws are preferred over the generic leadscrews.

Type|Size(Diameter)|Pitch|Start(Threads)|Lead|Other Name|Steps/mm(1/16)
Leadscrew|8mm|2mm|4|8mm|TR8x8|400
Threaded Rod|8mm|1.25mm|1|||2560

## E Steps/mm

This is the extruder section. The accuracy of this extruder steps/mm setting will ensure exact and correct dimensions for the printed parts. This will also determine whether or not the printed parts will have under or over extrusion.

Style|Outer Diameter|Hobbed Diameter|Steps/mm|Notes
MK8|10.95mm|10.50mm|93|These are the normal gear type on newer MK8
MK8|9mm|7mm||Some of the MK8 uses hobbed style gear similar to initial Prusa MK2
Prusa MK2|8mm|6mm||They are [Prusa3d's standard](https://shop.prusa3d.com/forum/original-prusa-i3-mk2-f23/why-is-the-extruder-pulley-made-of-brass--t1105-s20.html#p20314)


