# Marlin Documentation Project

This repository contains the raw documentation for [Marlin 3D printer firmware](//github.com/MarlinFirmware/Marlin) which is regularly deployed to [marlinfw.org](//marlinfw.org/). This documentation is open and available on Github so anyone may contribute by completing, correcting, or creating articles.

<div align="center"><img width="300" src="https://raw.githubusercontent.com/MarlinFirmware/Marlin/bugfix-2.1.x/buildroot/share/pixmaps/logo/marlin-outrun-nf-500.png" /></div>

## Technical details

The Marlin Documentation Project is built using the following technologies:
- [Ruby](//www.ruby-lang.org/en/downloads/)
- [RubyGems](//rubygems.org/pages/download)
- [Jekyll](//jekyllrb.com/)
- [Github pages](//pages.github.com/)

## How to contribute

To work with the documentation, first make a Fork of this repository in your own Github account, then locally clone **your MarlinDocumentation fork**. You should do all work within your own fork before submitting it as a Pull Request to the `master` branch. You can download the [GitHub Desktop app](//desktop.github.com/) and use Github's "Open in Desktop" option, or from your own desktop open a terminal/cmd window and do:
  - `cd C:\` (for example)
  - `git clone https://github.com/MarlinFirmware/MarlinDocumentation.git`

This will create a local `C:\MarlinDocumentation` folder linked to your fork.

To add new documentation or edit existing documentation, start by creating a new branch as a copy of the 'master' branch. You can do this using the Github web interface, from within Github Desktop, or from the command line.

If your new document is about "mashed potatoes" then name the new branch accordingly:
```
git checkout master -b doc-mashed_potatoes
```
Inside the `_docs` folder add the new file `mashed-potatoes.md` and let flow all your creativity into it. When you feel your masterpiece is ready to be shared with the world, commit the changes and push them up to your fork of **MarlinDocumentation**, then start a new Pull Request to the upstream repository (MarlinFirmware/MarlinDocumentation). This is done most easily from within the Github Desktop app. Please read Github's documentation on managing branches and creating Pull Requests if you're not sure how to proceed.
```
git add mashed-potatoes.md
git commit -m "Added a new document about potatoes"
git push
```

## Coding style

This Jekyll-based site is based on the Markdown language in delicious YAML wrapper. Be careful with this format because even small typos can cause Jekyll to reject the page. If you've installed Jekyll as described below, you can use it to build and preview the documentation and this will tell you where your errors are.

## Editorial style

Try to be neutral, concise, and straightforward. Avoid use of personal pronouns, unless avoiding them proves awkward. Provide images and give examples where needed. Check your spelling, grammar, and punctuation.

### Work in progress

You can use the `_tmp` folder for work-in-progress, and they will not be included in the site deployment.

## Local Jekyll Preview

If you'd like to be able to preview your contributions before submitting them, you'll need to install Jekyll on your system. Instructions are given below. As this is a non-trivial process, we recommend reading one of the following tutorials for a quick start with Jekyll:
- [Jekyll running on Windows](//jekyll-windows.juthilo.com/)
- [Jekyll running on Linux, Unix, or Mac OS X](//jekyllrb.com/docs/installation/)

### Installing buildroot on Windows

 1. Get Ruby for Windows ([32 bit](//dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-2.3.3.exe), [64bit](//dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-2.3.3-x64.exe)), execute the installer and go through the steps of the installation, make sure to check the “Add Ruby executables to your PATH” box.
 2. Get Ruby Devkit ([32 bit](//dl.bintray.com/oneclick/rubyinstaller/DevKit-mingw64-32-4.7.2-20130224-1151-sfx.exe), [64bit](//dl.bintray.com/oneclick/rubyinstaller/DevKit-mingw64-64-4.7.2-20130224-1432-sfx.exe)), the download is a self-extracting archive. When you execute the file, it'll ask you for a destination for the files. Enter a path that has no spaces in it. We recommend something simple, like ` C:\RubyDevKit\` . Click Extract and wait until the process is finished.
 3. Open your favorite command line tool and do:
  - `cd C:\RubyDevKit`
  - `ruby dk.rb init`
  - `ruby dk.rb install`
  - `gem install bundler`

### Installing buildroot on macOS

Ruby 2.3 or newer is required to use Jekyll, but macOS 10.12 only includes Ruby 2.2. For macOS 10.12 and earlier the custom `rbenv` install described below is required. Even when the OS comes with Ruby 2.3, we still find it easier to use `rbenv` and `ruby-build` to make a self-managed Ruby install.

To install [rbenv](//github.com/rbenv/rbenv) and [ruby-build](//github.com/rbenv/ruby-build#readme) we recommend using one of the popular package managers, [Homebrew](//brew.sh) or [MacPorts](//www.macports.org). (You can also download and install these tools manually.)

**Important:** Don't install Ruby 2.3 itself using Homebrew/MacPorts/etc., as this leads down a twisty rabbit hole. Either trust the built-in Ruby 2.3 or newer installation or use `rbenv` to do everything. Note that `rbenv` is incompatible with `rvm`, so if you ever installed `rvm` before you'll need to remove it before proceeding.

Once you have `rbenv` and `ruby-build` installed, follow the instructions on the [rbenv](//github.com/rbenv/rbenv) project page to:

- install a local version of Ruby (2.3 or newer),
- modify your `.bash_profile` and `.zprofile` to set your Ruby environment, and
- create a local `shims` folder with `$PATH` pointing to your Ruby.

It sounds ugly, but hopefully the instructions on the [rbenv](//github.com/rbenv/rbenv) project page are clear enough to get you that far. You'll be using `rbenv` from now on to install and manage local Ruby environments.

With your Ruby environment set up and ready to go, you can now install the `bundler` Ruby gem with:
- `gem install bundler`

## Jekyll Primer

Under Jekyll we use YAML, Markdown, Liquid, and HTML to fill out the site content and layout. A `_config.yml` file defines the site structure using "collections" that correspond to site sub-folders. The site is "compiled" to produce a static HTML and Javascript file structure. The most important folders are:

- `_layouts` contains the general layouts (aka page templates).
- `_includes` has partial layouts included by others.
- `_meta` is where we keep top-level page descriptions.
- Site sub-pages: `_basics`, `_configuration`, `_development`, `_features`, `_gcode`, `_hardware`.

### Previewing content

Now that you have Ruby installed, you'll be able to use Jekyll to preview your changes exactly as they will appear on the final site. Just open a terminal/cmd window, use `chdir` or `cd` to change the working path to your local copy of the repository, and execute the following commands:

```
bundle config set path 'vendor/bundle'
bundle install
bundle exec jekyll serve --watch --incremental
```

You'll only need to execute the `bundle install` command once to install all the required Ruby gems, including Jekyll itself. If you get errors at this stage, you may need to update your Ruby installation, fix your Ruby environment, or resolve dependencies between the Ruby gems.

With the `serve` option, Jekyll watches the local files and on every save triggers an automatic build of the site. It also runs a mini-webserver at [http://localhost:4000/](//localhost:4000/) so the documentation can be previewed in the browser right on [your own computer](//localhost:4000/).

The main Marlin repository comes with the `mfdoc` script containing the commands above as a shortcut to preview the documentation.

## Publishing changes

We've set up GitHub Actions to run Jekyll and publish to the `gh-pages` branch whenever the `deploy` branch is updated. The `deploy` branch is synchronized from the `master` branch by the project administrator on a semi-regular basis, often just after merging one or more PRs from contributors.

## License

This documentation is licensed under the [Creative Commons Attribution 4.0 International license](//creativecommons.org/licenses/by/4.0/).
