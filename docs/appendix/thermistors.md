---
title: Thermistors
description: Temperature sensor types supported by Marlin, for the TEMP_SENSOR_* settings
layout: page
parent: Appendix
nav_order: 80
---

# Thermistors

Set each `TEMP_SENSOR_*` option to one of the values below to tell Marlin which thermistor, thermocouple, or other sensor is connected. Use `0` for a sensor that isn't present. See the [Temperature settings](/docs/settings/temperature_sensors.html#TEMP_SENSOR_N) for the individual options.

This table is generated from the list in `Configuration.h`.

| Value | Sensor |
|------:|--------|
{% for t in site.data.thermistors %}| `{{ t.value }}` | {{ t.label | replace: '|', '&#124;' }} |
{% endfor %}
