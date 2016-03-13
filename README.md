# Marlin Documentation Project

[![Build Status](https://travis-ci.org/jbrazio/MarlinDocumentation.svg?branch=master)](https://travis-ci.org/jbrazio/MarlinDocumentation)

The aim of this project is to provide a clear and consise documentation of the [Marlin 3D printer firmware](https://github.com/MarlinFirmware/Marlin), we made it open and available on Github so anyone is welcome to contribute by either completing, correcting or creating new arcticles. Please see the chapter [Wanted](#wanted) for a list of the current most valuable needed contributions for the documenation project.

![Marlin logo](assets/images/logo/marlin/small.png)

Be safe, have fun and build anything.

## Getting started

Marlin Documentation Project is built using the following technologies:
- [Ruby](https://www.ruby-lang.org/en/downloads/)
- [RubyGems](https://rubygems.org/pages/download)
- [Jekyll](https://jekyllrb.com/)
- [Github pages](https://pages.github.com/)

We really recommend reading one of the following tutorials for a quick start with Jekyll:
- [Jekyll running on Windows](http://jekyll-windows.juthilo.com/)
- [Jekyll running on Linux, Unix, or Mac OS X](https://jekyllrb.com/docs/installation/)

## How to contribute

Let's pretend you want to add a new article to the project, you should start by forking the **MarlinDocumentation** repository.

```
git clone https://github.com/jbrazio/MarlinDocumentation.git
```

Then you should create a new branch, as the new article is about "mashed potatos" we do the following command:
```
git checkout -b article-mashed_potatos
```

Then inside the articles folder you should add the new file `mashed-potatos.md` and let flow all your creativity into it.
When you feel it is ready to be shared with the world just submit a commit into your own fork of **MarlinDocumentation** a start a new Pull Request to upstream.

## Previewing content

Jekyll allows you to preview the changes before submitted them to Github, just open a terminal/cmd window chdir to your local copy of the repository and start Jekyll using the following command: `jekyll serve --watch`.
Jekyll will watch the local files and every save you do will trigger an automatic build of the site which can then be easly previewd from [your own computer](http://localhost:4000/).

## Coding style

The preferred format for article contribution is Markdown language.

## Wanted

- Transport all documents from old Marlin wiki into this new system.

## License

Marlin is published under the [GPL license](/LICENSE) because we believe in open development. The GPL comes with both rights and obligations. Whether you use Marlin firmware as the driver for your open or closed-source product, you must keep Marlin open, and you must provide your compatible Marlin source code to end users upon request. The most straightforward way to comply with the Marlin license is to make a fork of Marlin on Github, perform your modifications, and direct users to your modified fork.

While we can't prevent the use of this code in products (3D printers, CNC, etc.) that are closed source or crippled by a patent, we would prefer that you choose another firmware or, better yet, make your own.
