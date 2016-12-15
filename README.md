# Marlin Documentation Project

[![Build Status](https://travis-ci.org/MarlinFirmware/MarlinDocumentation.svg?branch=master)](https://travis-ci.org/MarlinFirmware/MarlinDocumentation)

The aim of this project is to provide clear and concise documentation for [Marlin 3D printer firmware](https://github.com/MarlinFirmware/Marlin). This documentation is made open and available on Github so anyone is welcome to contribute by either completing, correcting or creating new articles. Please see the chapter "[Most wanted contributions](#most-wanted-contributions)" for a current list of contributions needed for the documentation project.

![Marlin logo](assets/images/logo/marlin/small.png)

Be safe, have fun and build anything.

## Technical details

The Marlin Documentation Project is built using the following technologies:
- [Ruby](https://www.ruby-lang.org/en/downloads/)
- [RubyGems](https://rubygems.org/pages/download)
- [Jekyll](https://jekyllrb.com/)
- [Github pages](https://pages.github.com/)

## How to contribute

To work with the documentation, you must first make a Fork of this repository under your own Github account, then locally clone a copy of **your** MarlinDocumentation fork. You should do all your work within your own fork before submitting it to us. You can use Github's "Open in Desktop" option, or from your own desktop open a terminal/cmd window and do:
  - `cd C:\` (for example)
  - `git clone https://github.com/MarlinFirmware/MarlinDocumentation.git`

This will create a local `C:\MarlinDocumentation` folder linked to your fork.

To add a new document to the project, start by creating a new branch as a copy of the 'master' branch. You can do this using the Github web interface, from within Github Desktop, or from the command line.

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

The preferred format for new document contribution is Markdown language. With this format you must be careful, because small typos can cause Jekyll to reject the page. If you've installed Jekyll as described below, your local auto-building Jekyll server will tell you where your errors are.

## Editorial style

Try to be neutral, concise, and straightforward. Avoid use of personal pronouns, unless avoiding them proves awkward. Provide images and give examples where needed. Check your spelling, grammar, and punctuation.

## Most wanted contributions

1. Transfer all documents from the old Marlin wiki into this new system.
1. Transfer descriptions of the options in Configuration.h and Configuration_adv.h to the new system.
1. Create "Getting Started" guides to ease the Marlin learning curve for new users.
1. Documentation of GCodes with notes specific to Marlin.

## Going Deeper

If you'd like to be able to preview your contributions before submitting them, you'll need to install Jekyll on your system. Instructions are given below. As this is a non-trivial process, we recommend reading one of the following tutorials for a quick start with Jekyll:
- [Jekyll running on Windows](http://jekyll-windows.juthilo.com/)
- [Jekyll running on Linux, Unix, or Mac OS X](https://jekyllrb.com/docs/installation/)

## Installing buildroot on Windows

 1. Get Ruby for Windows ([32 bit](http://dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-2.2.2.exe), [64bit](http://dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-2.2.2-x64.exe)), execute the installer and go through the steps of the installation, make sure to check the “Add Ruby executables to your PATH” box.
 2. Get Ruby Devkit ([32 bit](http://dl.bintray.com/oneclick/rubyinstaller/DevKit-mingw64-32-4.7.2-20130224-1151-sfx.exe), [64bit](http://dl.bintray.com/oneclick/rubyinstaller/DevKit-mingw64-64-4.7.2-20130224-1432-sfx.exe)), the download is a self-extracting archive. When you execute the file, it’ll ask you for a destination for the files. Enter a path that has no spaces in it. We recommend something simple, like ` C:\RubyDevKit\` . Click Extract and wait until the process is finished.
 3. Open your favorite command line tool and do:
  - `cd C:\RubyDevKit`
  - `ruby dk.rb init`
  - `ruby dk.rb install`
  - `gem install bundler`

## Installing buildroot on macOS

Apple includes a version of Ruby with macOS, but it's too old to use with Jekyll. You'll need Ruby 2.3 or newer to proceed. You can use one of the package managers, [Homebrew](http://brew.sh) or [MacPorts](https://www.macports.org) to install [rbenv](https://github.com/rbenv/rbenv) and [ruby-build](https://github.com/rbenv/ruby-build#readme), which will then allow you to install Ruby 2.3. You may also install these manually without a package manager.

Don't install Ruby 2.3 itself using Homebrew or MacPorts, as this leads down a twisty rabbit hole. Just use `rbenv`. Note that `rbenv` is incompatible with `rvm`, so make sure to also remove any custom `rvm` you've installed before proceeding.

Once you have `rbenv` and `ruby-build` installed, follow the instructions on the [rbenv](https://github.com/rbenv/rbenv) project page to:

- install a newer version of Ruby (2.3 or newer),
- modify your `.bash_profile` with code to set your Ruby environment, and
- create a local `shims` folder with `$PATH` pointing to your Ruby.

It sounds ugly, but hopefully the instructions on the [rbenv](https://github.com/rbenv/rbenv) project page are clear enough to get you that far.

With your Ruby environment set up and ready to go, you can now install the `bundler` Ruby gem with:
- `gem install bundler`

## Previewing content

Now that you have Jekyll installed, you can preview your changes exactly as they will appear on the final site. Just open a terminal/cmd window, use `chdir` or `cd` to change the working path to your local copy of the repository, and execute the following commands:

```
bundle install --path vendor/bundle
bundle exec jekyll serve --watch
```

You'll only need to execute the `bundle install` command once. It will make sure you have all the required Ruby gems installed. If you get errors at this stage, you may need to update your Ruby installation, fix your Ruby environment, or resolve dependencies between the Ruby gems.

With the `serve` option, Jekyll watches the local files and on every save triggers an automatic build of the site. It also runs a mini-webserver at [http://localhost:4000/](http://localhost:4000/) so the documentation can be previewed in the browser right on [your own computer](http://localhost:4000/).

## Publishing changes

If you're a developer with enough access rights to publish changes to the `gh-pages` branch, the following bash script will ease your life by applying a consistent process for website publication. Run this from inside your local working copy of the repo.

### pub-marlindoc.sh

```bash
#!/bin/bash
TMPFOLDER=$( mktemp -d )
COMMIT=$( git log --format="%H" -n 1 )

set -e

git reset --hard
git clean -d -f

# Uncomment to compress the final html files
#mv ./_plugins/jekyll-press.rb-disabled ./_plugins/jekyll-press.rb

bundle install
bundle exec jekyll build --profile --trace --no-watch
bundle exec htmlproofer ./_site --only-4xx --allow-hash-href --check-favicon --check-html --url-swap ".*marlinfw.org/:/"

rsync -av _site/ ${TMPFOLDER}/

git reset --hard HEAD
git clean -d -f
git checkout gh-pages

rsync -av ${TMPFOLDER}/ ./

git add --all
git commit --message "Built from ${COMMIT}"
git push

rm -rf ${TMPFOLDER}

git checkout master
```

## License

Marlin is published under the [GPL license](/LICENSE) because we believe in open development. The GPL comes with both rights and obligations. Whether you use Marlin firmware as the driver for your open or closed-source product, you must keep Marlin open, and you must provide your compatible Marlin source code to end users upon request. The most straightforward way to comply with the Marlin license is to make a fork of Marlin on Github, perform your modifications, and direct users to your modified fork.

While we can't prevent the use of this code in products (3D printers, CNC, etc.) that are closed source or crippled by a patent, we would prefer that you choose another firmware or, better yet, make your own.
