---
title: Contributing Code
description: Submitting changes to Marlin on Github
parent: Development
layout: article
nav_order: 8
nav_enabled: true
toc: true
has_toc: true
back_to_top: true
---

# Contributing Code

Marlin welcomes fixes and new features from anyone. Every change arrives as a **Pull Request** (PR) on GitHub: you
copy the project to your own account, make the change on a branch there, and ask the maintainers to pull it into the
main project. This page walks through that process from start to finish. It assumes you can edit C++ and
build Marlin. If you can't build it yet, start with [Build & Install](/docs/basics/install.html).

Before you write anything, read [Contributing to Marlin](contributing.html) and the
[Coding Standards](coding_standards.html). Changes that follow them are accepted sooner.

## The short version

1. Fork `MarlinFirmware/Marlin` and clone your fork.
2. Make a branch from the latest `bugfix-2.1.x`.
3. Make one small, focused change, and [test it](testing.html).
4. Commit with a clear message.
5. Push the branch to your fork and open a Pull Request that targets `bugfix-2.1.x`.
6. Fix whatever CI and the reviewers find, then **rebase** (don't merge) to keep the branch current.

## Before you start

- **Look for existing work.** Search open issues and Pull Requests for the same fix or feature. Two people building the same
  thing is a waste.
- **Discuss a large change first.** For anything big or controversial, open a
  [feature request](feature_request.html) or ask in the Discord before you spend weeks on it. A maintainer can tell you whether
  it fits, and how.
- **A good first change** is easy to find in the issues labeled
  [good first issue](//github.com/MarlinFirmware/Marlin/labels/good%20first%20issue) and
  [help wanted](//github.com/MarlinFirmware/Marlin/labels/help%20wanted).
- **Keep it small.** A Pull Request should do one thing and build and pass CI on its own. If your work has several
  parts, split it into several PRs. The usual splits are refactor then feature, core logic then LCD support, and one board
  family or HAL per PR. If one PR depends on another, say so in its description.
- **AI tools are welcome**, but you are the author, you answer for every line, and you must have read and tested it. The
  rules are in the AI-Assisted Contributions section of Marlin's
  [`contributing.md`](//github.com/MarlinFirmware/Marlin/blob/bugfix-2.1.x/.github/contributing.md).

## Which branch?

Pull Requests go to **`bugfix-2.1.x`**, the working branch. It receives both bug fixes and new features, and releases are cut
from it later. *Never* target a release branch such as `2.0.x`. PRs aimed at one are closed automatically, with a
reminder to resubmit.

A fix that must also reach an older release can be backported by the maintainers. Very small patches are most
likely to be taken. Say in your description if you think yours should be.

## Set up

You need a free [GitHub account](//github.com/join) and [Git](//git-scm.com/). If you prefer a graphical
tool, [GitHub Desktop](//desktop.github.com) handles cloning, committing and pushing. It can't do rebases,
so you will still use the command line for those.

1. **Fork.** On the [Marlin repository](//github.com/MarlinFirmware/Marlin) click **Fork**. This copies the
   project to your account. Keep the repository name `Marlin`.
2. **Clone your fork** and add the main project as a second remote called `upstream`:

   ```sh
   git clone https://github.com/YOUR-NAME/Marlin.git
   cd Marlin
   git remote add upstream https://github.com/MarlinFirmware/Marlin.git
   git fetch upstream
   ```

   Now `origin` is your fork, where you push, and `upstream` is the main project, where you read the newest code.
   `git remote -v` shows both.

## Make a branch

Never work on `bugfix-2.1.x` itself. Make a branch with a short, descriptive name, starting from the latest
upstream code:

```sh
git fetch upstream
git switch -c fix_probe_offset --no-track upstream/bugfix-2.1.x
```

If you use GitHub Desktop, fetch, then choose **Branch &rarr; New Branch** and base it on `upstream/bugfix-2.1.x`.

## Make the change

- Follow the [Coding Standards](coding_standards.html): two-space indents, no tabs, and the style of the code around
  your change. Don't reformat or rename code you aren't changing, because that hides your real change in the diff.
- **Don't change defaults** in `Configuration.h` or `Configuration_adv.h` unless that is the point of the PR. A new
  feature is disabled by default. When you add or change an option, update its comment there, and add checks to
  `Marlin/src/inc/SanityCheck.h` for the combinations that can't work.
- Gate optional code with `ENABLED()`, `DISABLED()` and the related macros, so it costs nothing when it is off. The code must
  build for both 8-bit AVR boards and 32-bit boards.
- Never commit the changes you make to configuration files to suit your own printer. Keep them out of your commits.
- Include a picture, a diagram or a video link in the PR description if they help to show what the change does.

## Test it

Testing is part of the change. At a minimum, build the environments your change affects and try it, in the
[Simulator](/docs/printers/simulator.html) or on a printer. A new feature or option should also come with a build test, and
with a unit test when its logic can run without hardware. [Marlin Testing](testing.html) explains each of these and how to run
them, and has a checklist to use before you submit.

## Commit

Commit your work in logical steps, with one purpose per commit:

```sh
git add -p                      # choose exactly the changes to include
git commit
```

A commit message:

- starts with a short summary of 72 characters or fewer, in the imperative mood ("Fix probe offset on Delta", not "Fixed" or "Fixes");
- starts with an emoji that tells the kind of change, as in the project's `git log` (🐛 fix, ✨ feature, ⚡️ performance, 🔧 configuration,
  🩹 minor fix, 🧑‍💻 developer tooling, 🚸 UX);
- explains the reason for the change after a blank line, when it isn't obvious.

Look at recent commits with `git log --oneline upstream/bugfix-2.1.x` to see the style. Leave issue numbers out of the
first line. They go in the PR description.

## Open the Pull Request

Push the branch to your fork:

```sh
git push -u origin fix_probe_offset
```

Then open the PR in either of these ways:

- On GitHub, open your fork. A banner offers **Compare &amp; pull request** for the branch you just pushed. Click it.
- Or from the command line with the [GitHub CLI](//cli.github.com/): `gh pr create --base bugfix-2.1.x`.

**Check that the base repository is `MarlinFirmware/Marlin` and the base branch is `bugfix-2.1.x`.** GitHub Desktop
and some browser paths choose another target, and a PR aimed at the wrong branch must be redone.

Fill in every section of the PR form:

| Section | What to write |
|---------|---------------|
| **Description** | What the change does and why, in detail. The first reviewer may not know the area, so don't be brief. Add images where they help. |
| **Requirements** | A specific board, display or other hardware that the change needs, if any. |
| **Benefits** | What the change fixes or improves. |
| **Configurations** | A ZIP of the configuration files a reviewer needs in order to build and try the change. |
| **Related Issues** | Issues that it fixes or answers. Write the number as `#1536` and GitHub links it both ways. |

Keep issue numbers out of the PR *title*. Say in the description what you built and tested, on which hardware if any, and
what you didn't test. Reviewers can then spend their time where it counts.

## After you submit

### Checks

A few seconds after you open the PR, GitHub starts the automatic checks (CI). They build many boards and
configurations, run the unit tests and check the formatting, and they take a while. A red mark by a check means it
failed, and the **Details** link shows the log. The first error is usually the real one.
[Marlin Testing](testing.html#what-ci-checks) explains each check and how to reproduce it on your computer. A PR
with failing checks can't be merged, but you don't have to fix it right away.

### Review

Maintainers and other contributors comment on the PR. Expect questions and requests for changes. This is normal
and not an insult. Answer every comment, and say when you have changed something. Reviews can take a while, because
the reviewers are volunteers with a lot of PRs to read, so be patient.

To change the PR, commit to the same branch and push. The PR updates by itself:

```sh
git add -p
git commit
git push
```

## Keep it current

The main code moves while your PR waits. Bring your branch up to date by **rebasing** onto the latest upstream, never
with a merge. A merge adds an extra commit that mixes the old and new code, and the project doesn't want it.

```sh
git fetch upstream
git rebase upstream/bugfix-2.1.x
git push --force-with-lease
```

The push has to be forced because a rebase rewrites the history of your branch. `--force-with-lease` refuses to
overwrite anything on your fork that you haven't seen.

### Resolve conflicts

If the rebase stops with a conflict, Git marks the files it couldn't combine. Open each one and look for blocks like this:

```
<<<<<<< HEAD
(the newest upstream code)
=======
(your change)
>>>>>>> your commit message
```

Edit the block into the code you want, with no markers left, then:

```sh
git add path/to/file
git rebase --continue
```

If it goes wrong, `git rebase --abort` puts everything back as it was. Conflict resolution takes some practice. Look at
what changed upstream, using the history of the file on GitHub, to decide what to keep.

### Tidy the commits

If your PR has many small fix-up commits, combine them before it is merged, so that it has one commit per logical
change. Use an interactive rebase:

```sh
git rebase -i upstream/bugfix-2.1.x
```

Your editor opens with a list of your commits. Leave the first as `pick`, and change `pick` to `fixup` (or `f`)
on any commit that belongs with the one above it. Use `reword` to change a message, and `drop` to remove a commit.
Save and close, then `git push --force-with-lease`.

The [Marlin GitHub scripts](git_scripts.html) automate these steps, and many others, for those who use them often.

## If you submitted the wrong thing

- **Wrong target branch.** On the PR, use **Edit** next to the title and change the base branch to `bugfix-2.1.x`. If
  the PR then shows unrelated commits, rebase your branch onto `upstream/bugfix-2.1.x` and push again.
- **Config changes in your commits.** Remove them in a new commit (`git restore --source=upstream/bugfix-2.1.x -- Marlin/Configuration.h Marlin/Configuration_adv.h`),
  then tidy the commits so that the change disappears from the history.
- **Too big.** Split it. Create a new branch from `upstream/bugfix-2.1.x` for each part, bring over only the files
  for that part, and open a separate PR for each one.

## After it is merged

Clean up the branch, locally and on your fork:

```sh
git fetch upstream
git switch --detach upstream/bugfix-2.1.x
git branch -D fix_probe_offset
git push origin --delete fix_probe_offset
```

Thank you for making Marlin better. See [Contributing to Marlin](contributing.html) for other ways to help.
