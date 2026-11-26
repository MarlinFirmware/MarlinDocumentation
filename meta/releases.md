---
title: Releases
description: Marlin Releases and LTS ("Long-Term Support") Branches
layout: article
nav_exclude: true
permalink: /meta/releases.html
---

# Marlin Releases

The Marlin community is continuously fixing and improving the codebase. Once Marlin has accumulated enough changes we'll tag and release a new version to the world. Depending on our goals, the interval between releases may be more or less frequent. During long development cycles the latest development branch may be a good choice. Sometimes it can be significantly "ahead" of the latest release.

### Marlin Feature Development
Marlin maintains a single continuous development branch named `bugfix-2.1.x` where we accept all contributions. Contributors are expected to keep this branch up to date in their own forks and avoid modifying it. Instead, contributors should copy `bugfix-2.1.x` to a new branch (with a good name) in their fork and make changes to that branch. Once the branch is submitted as a "Pull Request" it acts as the hub for further development until it gets merged into the codebase.

### Marlin Releases
Marlin releases are tagged from a release branch cut from `bugfix-2.1.x`. Marlin 2.1.3 was prepared that way: the `release-2.1.3` branch carries the version commit, and the matching example configurations are on the `release-2.1.3` branch of [Configurations](//github.com/MarlinFirmware/Configurations) (binaries are on the `release-2.1.3` branch of [MarlinBuilds](//github.com/MarlinFirmware/MarlinBuilds)). Each release has release notes on the [GitHub Releases](//github.com/MarlinFirmware/Marlin/releases) page, a `Full Changelog` comparison with the previous release, and a download on the [Download](/meta/download.html) page.

**Note:** Between releases, `bugfix-2.1.x` is the place to get the newest fixes. The `2.1.x` download tracks the latest 2.1.x release with hotfixes.

### Marlin "LTS" Branches
Sometimes external libraries or the tools used to build Marlin may change and break the build, which also breaks older versions. We need a way to apply patches across several old release versions and make tagged releases for them. It can also be useful to patch old bugs. Maintaining these "LTS" branches allows users and machine vendors tied to a specific Marlin version to update their codebase with patches to keep their firmware building without impacting their customizations.

### Further Resources
- Detailed [release notes](//github.com/MarlinFirmware/Marlin/releases)
- Resources for [reporting issues](//github.com/MarlinFirmware/Marlin/issues)
- The tools needed to [join the project](//guides.github.com/activities/contributing-to-open-source/)
