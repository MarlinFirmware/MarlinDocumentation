<p align="center"><img src="https://raw.githubusercontent.com/MarlinFirmware/Marlin/bugfix-2.1.x/buildroot/share/pixmaps/logo/marlin-outrun-nf-500.png" height="250" alt="Marlin Firmware logo" /></p>

<h1 align="center">Marlin Documentation Project</h1>

<p align="center">
  <a href="/LICENSE" target="_blank"><img alt="GPL-V3.0 License" src="https://img.shields.io/github/license/MarlinFirmware/MarlinDocumentation.svg"></a>
  <a href="//github.com/MarlinFirmware/MarlinDocumentation/graphs/contributors" target="_blank"><img alt="Contributors" src="https://img.shields.io/github/contributors/marlinfirmware/marlindocumentation.svg"></a>
  <a href="//github.com/MarlinFirmware/MarlinDocumentation/releases" target="_blank"><img alt="Last Updated" src="https://img.shields.io/github/last-commit/marlinfirmware/marlindocumentation?label=last%20updated"></a>
  <a href="//github.com/MarlinFirmware/MarlinDocumentation/actions/workflows/jekyll-pub.yml" target="_blank"><img alt="Jekyll Deploy Status" src="https://github.com/MarlinFirmware/MarlinDocumentation/actions/workflows/jekyll-pub.yml/badge.svg"></a>
  <a href="//github.com/sponsors/thinkyhead" target="_blank"><img alt="GitHub Sponsors" src="https://img.shields.io/github/sponsors/thinkyhead?color=db61a2"></a>
  <br />
  <a href="//x.com/marlinfirmware" target="_blank"><img src="https://img.shields.io/twitter/follow/MarlinFirmware" alt="@MarlinFirmware" /></a>
  <a href="//fosstodon.org/@marlinfirmware" target="_blank"><img alt="Follow MarlinFirmware on Mastodon" src="https://img.shields.io/mastodon/follow/109450200866020466?domain=https%3A%2F%2Ffosstodon.org&logoColor=%2300B&style=social"></a>
  <a href="//bsky.app/profile/marlinfw.org" target="_blank"><img alt="Follow MarlinFirmware on Bluesky" src="https://img.shields.io/badge/-Bluesky-3686f7?style=flat&logo=icloud&logoColor=white"></a>
</p>

## About

This repository contains the raw documentation for [Marlin 3D printer firmware](//github.com/MarlinFirmware/Marlin) which is automatically deployed to [marlinfw.org](//marlinfw.org/). This documentation is open and available on GitHub so anyone may contribute by completing, correcting, or creating articles.

## Table of Contents

- [Technical details](#technical-details)
- [How to contribute](#how-to-contribute)
- [Local Jekyll preview](#local-jekyll-preview)
  - [Installing Ruby on Windows](#installing-ruby-on-windows)
  - [Installing Ruby on macOS](#installing-ruby-on-macos)
  - [Installing Ruby on Ubuntu](#installing-ruby-on-ubuntu)
  - [Set up Marlin Documentation project](#set-up-marlin-documentation-project)
  - [Jekyll basics](#jekyll-basics)
  - [Previewing content](#previewing-content)
  - [License](#license)

## Technical details

The Marlin Documentation Project is built using the following technologies:

- [Ruby](//www.ruby-lang.org/)
- [RubyGems](//rubygems.org/)
- [Jekyll](//jekyllrb.com/)
- [GitHub Pages](//pages.github.com/)

## How to contribute

Fork this repository, create a branch, edit or add pages, run the checks, and open a Pull Request against
`master`. Before you start, read:

- [`AGENTS.md`](AGENTS.md): the repo map, how the site is organized, and the checks every change must pass.
- [Documentation Style Guide](docs/development/style_guide.md): voice, page structure, images, callouts, links.
- [`_tools/README.md`](_tools/README.md): the generators (Settings, G-code index, printer directory) and checks.
- [`skills/`](skills/README.md): step-by-step procedures for common tasks (new page, diagram, G-code page,
  settings regeneration), usable by people and by coding agents.

Reference sections (`docs/settings/`, the G-code index, the printer directory) are generated; edit the
human-owned fields or the page body, not the generated entries. Run `_tools/install_hooks.sh` once per clone so
the site checks run before every commit.

## Local Jekyll preview

If you'd like to be able to preview your contributions before submitting them, you'll need to install Jekyll on your system. Instructions for Windows and macOS are given below:

### Installing Ruby on Windows

1. Download and install a Ruby+Devkit `3.3.4` from [RubyInstaller Download Archives](//rubyinstaller.org/downloads/archives/). Use default options for installation.

2. Run the `ridk install` step on the last stage of the installation wizard. Choose option `3` for `MSYS2 and MINGW development tool chain`. This is needed for installing gems with native extensions. You can find additional information regarding this in the [RubyInstaller Documentation](//github.com/oneclick/rubyinstaller2#using-the-installer-on-a-target-system).

> [!TIP]
> Once the `MSYS2 and MINGW development toolchain` install is complete, the installation wizard will reprompt which components should be installed. If you see a "Install MSYS2 and MINGW development toolchain succeeded" message above it, you can close the Command Prompt window and continue below.

3. Open a new Command Prompt so that changes to the `PATH` environment variable become effective, then check that everything is working:

   ```sh
   ruby -v
   ```
   If `ruby 3.3.4 (2024-07-09 revision be1089c8ec)` is reported, then proceed to [Set up the Marlin Documentation project](#set-up-marlin-documentation-project).

### Installing Ruby on macOS

> [!NOTE]
> Ruby may come preinstalled, but macOS' "system Ruby" is outdated, unmaintained, and not recommended for general use.
>
> There are many popular package managers for macOS, but we'll cover installation with [Homebrew](//brew.sh/) & [MacPorts](//www.macports.org/).

1. Install a package manager. You **do not** need to install both:

   - Install Homebrew by launching Terminal and running the following command:

      ```sh
      /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
      ```

   - Install MacPorts by downloading & installing the correct package for your version of macOS from the [Installing MacPorts](//www.macports.org/install.php) page.

     - Either Xcode or Command Line Tools for Xcode are required to install packages with MacPorts. You **do not** need to install both. These are available for free on [Apple's Developer Program website](//developer.apple.com/download/). An Apple Developer Program membership is not required, but you will need to sign in with your Apple ID.

2. Install `chruby` and `ruby-install`:

   - Homebrew:

     ```sh
     brew install chruby ruby-install
     ```

   - MacPorts:

     ```sh
     sudo port install chruby ruby-install
     ```

3. Install Ruby `3.3.4`:

   ```sh
   ruby-install ruby 3.3.4
   ```

   The configure, build, and install process will take a few minutes.

4. Configure your shell to automatically use `chruby`:

   - Homebrew:

     ```sh
     echo "" >> ~/.zshrc
     echo "# Ruby Configuration" >> ~/.zshrc
     echo "source $(brew --prefix)/opt/chruby/share/chruby/chruby.sh" >> ~/.zshrc
     echo "source $(brew --prefix)/opt/chruby/share/chruby/auto.sh" >> ~/.zshrc
     echo "chruby ruby-3.3.4" >> ~/.zshrc
     ```

   - MacPorts:

     ```sh
     echo "" >> ~/.zshrc
     echo "# Ruby Configuration" >> ~/.zshrc
     echo "source ${prefix}/opt/local/share/chruby/chruby.sh" >> ~/.zshrc
     echo "source ${prefix}/opt/local/share/chruby/auto.sh" >> ~/.zshrc
     echo "chruby ruby-3.3.4" >> ~/.zshrc
     ```

5. Quit and relaunch Terminal, then check that everything is working:

   ```sh
   ruby -v
   ```
   It should report `ruby 3.3.4 (2024-07-09 revision be1089c8ec)`. If not, repeat the above steps.

> [!NOTE]
> When using `ruby-install` you'll find your Ruby installations in `~/.rubies/` and you can switch between them with `chruby`. New instances of `zsh` in Terminal will default to 3.3.4 due to the changes made to `~/.zshrc`.

6. Proceed to [Set up the Marlin Documentation project](#set-up-marlin-documentation-project). (Note that `bundler` is already included.)

### Installing Ruby on Ubuntu

1. Ensure APT is up to date:

   ```sh
   sudo apt update
   ```

2. Install prerequisites:

   ```sh
   sudo apt install git curl libssl-dev libreadline-dev zlib1g-dev autoconf bison build-essential libyaml-dev libreadline-dev libncurses5-dev libffi-dev libgdbm-dev
   ```

3. Install rbenv:

   ```sh
   curl -fsSL https://github.com/rbenv/rbenv-installer/raw/HEAD/bin/rbenv-installer | bash
   echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
   echo 'eval "$(rbenv init -)"' >> ~/.bashrc
   source ~/.bashrc
   ```

4. Install Ruby 3.3.4:

   ```sh
   rbenv install 3.3.4
   rbenv global 3.3.4
   ```

> [!NOTE]
> When using `rbenv` you'll find your Ruby installations in `~/.rbenv/versions/` and you can switch between them with `rbenv global <version>`.

5. Check Ruby version:

   ```sh
   ruby -v
   ```
   It should report `ruby 3.3.4 (2024-07-09 revision be1089c8ec)`. If not, repeat the above steps.

6. Add environment variables to your `~/.bashrc` file to configure the gem installation path:

   ```sh
   echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
   echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
   echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   ```

7. Install Bundler Gem:

   ```sh
   gem install bundler
   ```

8. Proceed to **Set up Marlin Documentation project**.

### Set up Marlin Documentation project

Once Ruby is installed, set up the Marlin Documentation project with Bundler. Open Command Prompt or Terminal and `cd` to the working path of **your Marlin Documentation fork**. Execute the following commands:

```sh
rm -f Gemfile.lock
bundle config set path 'vendor/bundle'
bundle install
```

> [!NOTE]
> You only need to execute the above commands **once** to complete the install. If you see errors at this stage you may need to update your Ruby installation, fix your Ruby environment, or resolve dependencies between the Ruby gems.

### Jekyll basics

Jekyll uses a combination of YAML, Markdown, Liquid, and HTML to define the site content and layout. A `_config.yml` file defines a site structure with "collections" corresponding to sub-folders. The website is "compiled" to produce static HTML and Javascript. The most important folders in the site are:

- `_layouts` contains the page templates (home, article, setting, gcode, tool).
- `_includes` has partials included by the layouts.
- `docs/<section>/` holds the pages; each section has an `index.md` and child pages linked by `parent:`.
- `_tools/` holds the generators and the checks. See `AGENTS.md` for the full map.

### Previewing content

To start a mini web server and preview your changes, run the following command:

```sh
bundle exec jekyll serve --watch --incremental
```

With the `serve --watch --incremental` parameters, Jekyll watches local files for changes and triggers an automatic incremental build of the site on every save. It also starts a mini-web server so documentation can be previewed in a browser at [http://localhost:4000/](http://localhost:4000).

> [!TIP]
> The main Marlin repository comes with the [`mfdoc`](//github.com/MarlinFirmware/Marlin/blob/bugfix-2.1.x/buildroot/share/git/mfdoc) script containing the commands above as a shortcut to preview the documentation.

## License

This documentation is licensed under the [GPLv3 license](/LICENSE).
