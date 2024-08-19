<p align="center"><img src="https://raw.githubusercontent.com/MarlinFirmware/Marlin/bugfix-2.1.x/buildroot/share/pixmaps/logo/marlin-outrun-nf-500.png" height="250" alt="MarlinFirmware's logo" /></p>

<h1 align="center">Marlin Documentation Project</h1>

<p align="center">
    <a href="/LICENSE"><img alt="GPL-V3.0 License" src="https://img.shields.io/github/license/MarlinFirmware/MarlinDocumentation.svg"></a>
    <a href="//github.com/MarlinFirmware/MarlinDocumentation/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/marlinfirmware/marlindocumentation.svg"></a>
    <a href="//github.com/MarlinFirmware/MarlinDocumentation/releases"><img alt="Last Updated" src="https://img.shields.io/github/last-commit/marlinfirmware/marlindocumentation?label=last%20updated"></a>
    <a href="//github.com/MarlinFirmware/MarlinDocumentation/actions/workflows/jekyll-pub.yml"><img alt="Jekyll Deploy Status" src="https://github.com/MarlinFirmware/MarlinDocumentation/actions/workflows/jekyll-pub.yml/badge.svg"></a>
    <a href="//github.com/sponsors/thinkyhead"><img alt="GitHub Sponsors" src="https://img.shields.io/github/sponsors/thinkyhead?color=db61a2"></a>
    <br />
    <a href="//fosstodon.org/@marlinfirmware"><img alt="Follow MarlinFirmware on Mastodon" src="https://img.shields.io/mastodon/follow/109450200866020466?domain=https%3A%2F%2Ffosstodon.org&logoColor=%2300B&style=social"></a>
</p>

## About

This repository contains the raw documentation for [Marlin 3D printer firmware](//github.com/MarlinFirmware/Marlin) which is automatically deployed to [marlinfw.org](//marlinfw.org/). This documentation is open and available on GitHub so anyone may contribute by completing, correcting, or creating articles.

## Table of Contents

- [Technical details](#technical-details)
- [How to contribute](#how-to-contribute)
  * [Coding style](#coding-style)
  * [Editorial style](#editorial-style)
  * [Work in progress](#work-in-progress)
- [Local Jekyll preview](#local-jekyll-preview)
  * [Installing buildroot on Windows](#installing-buildroot-on-windows)
  * [Installing buildroot on macOS](#installing-buildroot-on-macos)
  * [Installing buildroot on Ubuntu](#installing-buildroot-on-ubuntu)
- [Jekyll primer](#jekyll-primer)
- [Previewing content](#previewing-content)
- [License](#license)

## Technical details

The Marlin Documentation Project is built using the following technologies:

- [Ruby](//www.ruby-lang.org/)
- [RubyGems](//rubygems.org/)
- [Jekyll](//jekyllrb.com/)
- [GitHub Pages](//pages.github.com/)

## How to contribute

To work with the documentation, first [fork](//docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) this repository to your GitHub account, then clone **your MarlinDocumentation fork** locally. You should do all work within your own fork before submitting it as a [Pull Request](//docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) to the `master` branch. You can download the [GitHub Desktop app](//github.com/apps/desktop) and use GitHub's "Open in Desktop" option, or from your own desktop, open a terminal/cmd window and do:

For example, change into the root of C:\\:

```bash
cd C:\
```

Clone Marlin Documentation repository:

```bash
git clone https://github.com/MarlinFirmware/MarlinDocumentation.git
```

This will create a local `C:\MarlinDocumentation` folder linked to your fork.

To add new documentation or edit existing documentation, start by [creating a new branch](//docs.github.com/en/issues/tracking-your-work-with-issues/creating-a-branch-for-an-issue) as a copy of the `master` branch. You can do this using the GitHub web interface, from within GitHub Desktop, or from the command line.

If your new document is about "mashed potatoes" then name the new branch accordingly:

```
git checkout master -b doc-mashed_potatoes
```

Inside the `_docs` folder, add the new file `mashed-potatoes.md` and let flow all your creativity into it. When you feel your masterpiece is ready to be shared with the world, commit the changes and push them up to **your MarlinDocumentation fork**. This is done most easily from within the GitHub Desktop app, but here are the command line commands for reference:

```shell
git add mashed-potatoes.md
git commit -m "Added a new document about potatoes"
git push
```

Next, start a new Pull Request to the upstream repository ([MarlinFirmware/MarlinDocumentation](//github.com/MarlinFirmware/MarlinDocumentation)).

> [!TIP]
> Check out GitHub's documentation on [creating a new branch](//docs.github.com/en/issues/tracking-your-work-with-issues/creating-a-branch-for-an-issue), [managing branches](//docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository), and creating [Pull Requests](//docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) if you're new to contributing with git.

### Coding style

This Jekyll-based site is based on the [Markdown](//www.markdownguide.org/) language in delicious [YAML](//yaml.org/) wrapper. Be careful with this format because even small typos can cause Jekyll to reject the page. If you've installed Jekyll as described below, you can use it to build and preview the documentation and this will tell you where your errors are.

### Editorial style

Try to be neutral, concise, and straightforward. Avoid use of personal pronouns, unless avoiding them proves awkward. Provide images and give examples where needed. Check your spelling, grammar, and punctuation.

### Work in progress

You can use the `_tmp` folder for work-in-progress, and they will not be included in the site deployment.

## Local Jekyll preview

If you'd like to be able to preview your contributions before submitting them, you'll need to install Jekyll on your system. Instructions for Windows and macOS are given below:

### Installing buildroot on Windows

1. Download and install a Ruby+Devkit `3.3.4` from [RubyInstaller Download Archives](//rubyinstaller.org/downloads/archives/). Use default options for installation.

2. Run the `ridk install` step on the last stage of the installation wizard. Choose option `3` for `MSYS2 and MINGW development tool chain`. This is needed for installing gems with native extensions. You can find additional information regarding this in the [RubyInstaller Documentation](//github.com/oneclick/rubyinstaller2#using-the-installer-on-a-target-system).

> [!TIP]
> Once the `MSYS2 and MINGW development toolchain` install is complete, the installation wizard will reprompt which components should be installed. If you see a "Install MSYS2 and MINGW development toolchain succeeded" message above it, you can close the Command Prompt window and continue below.

3. Open a new Command Prompt so that changes to the `PATH` environment variable become effective, then check that everything is working:

   ```shell
   ruby -v
   ```
   If `ruby 3.3.4 (2024-07-09 revision be1089c8ec) [x64-mingw-ucrt]` is reported, then proceed to proceed to the [Jekyll primer](#jekyll-primer) section below.

### Installing buildroot on macOS

> [!NOTE]
> Ruby may come preinstalled, but macOS' "system Ruby" is outdated, unmaintained, and not recommended for general use.

1. Install [Homebrew](//brew.sh/) by launching Terminal and running the following command:

   ```shell
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install `chruby`, `ruby-install`, and `xz` with Homebrew:

   ```shell
   brew install chruby ruby-install xz
   ```

3. Install Ruby `3.3.4`:

   ```shell
   ruby-install ruby 3.3.4
   ```

   This will take a few minutes. Once the install is complete, configure your shell to automatically use `chruby`:

   ```shell
   echo "source $(brew --prefix)/opt/chruby/share/chruby/chruby.sh" >> ~/.zshrc
   echo "source $(brew --prefix)/opt/chruby/share/chruby/auto.sh" >> ~/.zshrc
   echo "chruby ruby-3.3.4" >> ~/.zshrc
   ```

4. Quit and relaunch Terminal, then check that everything is working:

   ```shell
   ruby -v
   ```

   If `ruby 3.3.4 (2024-07-09 revision be1089c8ec) [x86_64-darwin21]` is reported, proceed to the [Jekyll primer](#jekyll-primer) section below.

### Installing buildroot on Ubuntu

1. Ensure APT is up to date:

   ```shell
   sudo apt update
   ```
2. Install prerequisites:

   ```shell
   sudo apt install git curl libssl-dev libreadline-dev zlib1g-dev autoconf bison build-essential libyaml-dev libreadline-dev libncurses5-dev libffi-dev libgdbm-dev
   ```

3. Install rbenv:

   ```shell
   curl -fsSL https://github.com/rbenv/rbenv-installer/raw/HEAD/bin/rbenv-installer | bash
   echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
   echo 'eval "$(rbenv init -)"' >> ~/.bashrc
   source ~/.bashrc
   ```

4. Install Ruby 3.3.4:

   ```shell
   rbenv install 3.3.4
   rbenv global 3.3.4
   ```

4. Check Ruby version:

   ```shell
   ruby -v
   ```
   If `ruby 3.3.4 (2024-07-09 revision be1089c8ec) [x86_64-linux]` is reported, proceed to the next step.

5. Add environment variables to your `~/.bashrc` file to configure the gem installation path:

   ```shell
   echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
   echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
   echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   ```

6. Install Bundler Gem:

   ```shell
   gem install bundler
   ```

7. Proceed to the [Jekyll primer](#jekyll-primer) section below.

## Jekyll primer

Under Jekyll, we use YAML, Markdown, Liquid, and HTML to fill out the site content and layout. A `_config.yml` file defines the site structure using "collections" that correspond to site sub-folders. The site is "compiled" to produce a static HTML and Javascript file structure. The most important folders are:

- `_layouts` contains the general layouts (aka page templates).
- `_includes` has partial layouts included by others.
- `_meta` is where we keep top-level page descriptions.
- Site sub-pages: `_basics`, `_configuration`, `_development`, `_features`, `_gcode`, `_hardware`.

## Previewing content

Now that Ruby is installed, you'll be able to use Jekyll to preview your changes exactly as they will appear on the final site. Just open a new Command Prompt or Terminal window, `cd` to change the working path to **your MarlinDocumentation fork**, and execute the following commands:

```shell
bundle config set path 'vendor/bundle'
bundle install
```

> [!NOTE]
> You'll only need to execute the above commands **once** to install all the required Ruby gems, including Jekyll itself. If you get errors at this stage, you may need to update your Ruby installation, fix your Ruby environment, or resolve dependencies between the Ruby gems.

To start a web server & preview your changes, run the following command:

```shell
bundle exec jekyll serve --watch --incremental
```

With the `serve --watch --incremental` parameters, Jekyll watches local files for changes and triggers an automatic incremental build of the site on every save. It also starts a mini-web server so documentation can be previewed in a browser at [http://localhost:4000/](http://localhost:4000).

> [!TIP]
> The main Marlin repository comes with the [`mfdoc`](//github.com/MarlinFirmware/Marlin/blob/bugfix-2.1.x/buildroot/share/git/mfdoc) script containing the commands above as a shortcut to preview the documentation.

## License

This documentation is licensed under the [GPLv3 license](/LICENSE).
