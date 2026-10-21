---
title: Printers
parent: Appendix
nav_order: 3
has_children: true
layout: article
---

# Printers

Marlin's [example configurations](//github.com/MarlinFirmware/Configurations) cover
{{ site.data.printers | size }} manufacturers. Each page below lists that maker's printers along with
the facts in their configuration files: printer type, build volume, board, stepper drivers, probe, and display.
Every entry links to its configuration folder.

The tables are generated from the configuration files, so they describe what the example is set up for.
The machine you have may differ. For example, a printer may have been upgraded, or a later revision may use a
different board. Before building, check the configuration against your hardware.

To learn how a type of printer moves and what that means for configuration, see [Printer Types](/docs/printers/).

{: .note }
> **Missing a printer?** Submit an example configuration to the
> [Configurations repository](//github.com/MarlinFirmware/Configurations). It will show up here the
> next time the directory is rebuilt. Photos for this directory are welcome too. See the
> repository's contributing notes for licensing.
