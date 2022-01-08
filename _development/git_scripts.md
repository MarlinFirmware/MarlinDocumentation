---
title:        'Marlin Github Scripts'
description:  'Helper scripts to ease and speed Marlin development.'
tag: github

author: thinkyhead
category: [ development ]
---

<!-- ## Background -->

Github is a great tool for collaboration. You can cover a lot of ground in a short time, and ideas sometimes come quickly and from many directions at once. Wouldn't it be great if the pace of deployment could be as fast as you can conceive of new ideas? While we may not be able to turn thought directly into code, we can at least provide some tools to smooth the process.

These scripts aim to improve, most especially, the process of managing, patching, and updating active Pull Requests. They don't rely on any special privileges, but encourage the use of the Pull Request process instead of doing direct commits.

Theoretically, a Pull Request should have a very short lifespan. It should be created, polished, and completed before anything else threatens to stomp on the same code lines. But in practice, some PRs take longer than others to develop and the Marlin policy has been to keep them open till they're ready. This opens up conflict and stale code issues. The longer a PR sits the harder it is to integrate and the less applicable its changes will be. A Marlin PR can sit for weeks or months.

By also paying careful attention to conflict resolution, these scripts can help keep a feature or patch branch (i.e., based on `bugfix-2.0.x` and forming the basis for a PR) fresh for as long as needed.

# Merge vs. Rebase

Working with branches and Pull Requests, you soon find there are some operations you need to do over and over, many of which just can't be done using the Github Desktop graphical interface. And one thing that becomes clear is that merge commits are highly undesirable on active PRs. If you have a PR that needs conflict resolution Github's tools work fine to patch it up, but the result is an unsightly new merge commit following your PR commits. Since a PR is a new set of changes yet to be added to the latest code, it's always best to "rebase" instead of "merge."

These helper scripts are designed for a workflow that uses `git rebase` and `git rebase -i` exclusively so Pull Request changes always come after the latest merged commits and are therefore relevant to the code at the time of merge.

# Interactive Rebase

During the lifespan of a Pull Request, you'll commonly want to combine or remove commits. This will be done using an "**interactive rebase**." All this means is that `git` opens up your editor (`vim`, `joe`, etc.) and you can change the order of commits, rewrite commit messages, drop commits, combine commits together, etc. When you save and close the editor, `git` attempts to make the changes.

This is one place where conflicts might arise, since `git` can't always decide which changes should supersede others.

# Resolving Conflicts

Git will tell you if there's a conflict and insert unresolved blocks beginning with `<<<<<` into the code. You must return to the project editor, search for these, resolve the conflicts, and then do:

```
git add .
git rebase --continue
```
If the resolution resulted in no changes (_e.g.,_ because already merged), then you will continue with:
```
git add .
git rebase --skip
```
If things get hairy and you don't know how to proceed, you can always abort and start over with:
```
git rebase --abort
```

Conflict resolution is a bit of art and a bit of science, but not too hard to get the hang of. When massive conflicts arise it may be better to skip `git rebase` and use `git diff` instead. But in ordinary situations with under \~20 conflicts, it shouldn't be very hard to resolve them.

**When resolving conflicts:**
- Usually you want some change from both sources. Consider all differences.
- Look carefully. Did a name change, punctuation get added?
- Confused? Reach beyond the current editor. Open the Github website to keep your original commits in view.

Ultimately, the aim of rebase is to apply the equivalent changes to a newer codebase. So use all means at your disposal. If necessary, you can create a temporary branch, recreate your original changes anew, then update the PR to point at the new commits:
```
mfnew my_redo_branch            ;# Create a new clean branch.
                                ;# Make changes, commit them, and then...
git checkout my_pr_branch       ;# Go back to the branch with a PR
git reset --hard my_redo_branch ;# Point the PR branch at the new work
git push -f                     ;# Now the PR contains shiny new commits
```

# Core Scripts

These powerful scripts come with some preliminary requirements:

 - A GNU BASH shell environment with GNU utilies `sed`, `awk`, `gawk`, `sort`, and a few others.
 - Basic understanding of Git branches, commits, some experience with `git merge` and `git rebase`.
 - Experience with making a Pull Request.
 - A Github account and a fork of Marlin in your Github account.
 - A checked-out working copy of your Marlin fork. (Get Github Desktop. Use "Open in Desktop" from your fork's page.)

(It may also be possible to adapt these scripts for the Github Desktop shell environment in Windows.)

Only run these commands from within your Marlin working copy. That is, you first need to run `cd /home/work/Marlin` (for example). If you don't know what any of this is about, start by reading about BASH online, specifically about the "working directory." Just don't `cd` out of the working directory and all will be well.

WARNING: While short, these scripts can be dangerous and don't always fail cleanly. Read them to understand how they work and use them with utmost caution. Remember, you can use `git reflog` to recover from almost any disaster, so have fun.

---
## `ghtp`

**Usage:** `ghtp -[s|h] [remote-list]`

Use this script to set the "GitHub Transport Protocol" for your remotes to either SSH or HTTP. This determines how Git (and Github Desktop) will connect to Github. You can set all remotes or specify just those you want to change. You should always use SSH with a public-key, unless behind a firewall.

---
## `mfinit`

**_Run this script before any others_** to prepare your working copy of Marlin to use these helper scripts. All `mfinit` does is create a remote named `upstream` as an alias to `MarlinFirmware`. This is a common and convenient shorthand, and is used within the other scripts.

---
## `mfinfo`

Run this script to get a line of information about your current working copy, branch, and upstream. When working on Marlin the output will look something like this:

**Project**|**Your Account**|**Repository**|**Dev Branch**|**Working Branch**
`MarlinFirmware`|`joehitgub`|`Marlin`|`bugfix-2.0.x`|`fix_something_june_1`

When working with this website's repository, the output will will read:

**Project**|**Your Account**|**Repository**|**Dev Branch**|**Working Branch**
`MarlinFirmware`|`joehitgub`|`MarlinDocumentation`|`master`|`master`

The other `mf*` scripts use `mfinfo` so they know what repository, fork, and so on are currently in use. If you write any custom scripts, you can also use `mfinfo`.

---
## `firstpush`

- Push the current branch to your fork on Github (`origin`) for the first time.
- Set the current branch's upstream to `origin`.
- Open the current branch's commit log in the browser.

Use `firstpush` after `mfnew` or whenever you want establish the current branch in your fork. The `mfpr` script will run `firstpush` if needed. This script doesn't do anything extra if the branch already exists in your fork.

---
## `mfnew`

**Usage:** `mfnew [new_branch_name]`

- Fetch `upstream` to make sure you have the latest code.
- Create a new branch with the given name as a copy of the Dev Branch.

Note that the new branch is not sync'ed to your fork. Run `firstpush` if you want to create the remote copy.

Use this command when you want to make a patch or feature starting from the latest Dev Branch.

---
## `mfpr`

Open the **Compare & Pull Request** page on Github for the current branch. Be sure to use `git push` or `git push -f` to update the branch in your fork before submitting the Pull Request. You can always use `git push -f` afterward if you forget.

---
## `mfqp`

Quick patch the current branch.

- Commit all uncommitted changes with the message "patch."
- Run `mfrb` so you can apply the patch with `fixup` and make other changes.
- Run `git push -f` to update your fork.

Use `mfqp` when you want to make a quick correction to an earlier commit and upload it immediately to `origin`. This will also update the open Pull Request, if there is one, and is intended to be used when patching up a Pull Request in preparation to get it merged and closed.

---
## `mfrb`

Rebase the code on the latest Dev Branch and (optionally) rewrite commits.

- Fetch `upstream` to get the latest changes to the Dev Branch.
- Rebase the current branch on the Dev Branch. (Conflicts may arise here.)
- Do an **interactive rebase** to fixup, squash, drop, rewrite, etc.

For the 2.0.x development tree that last step will run `git rebase -i upstream/bugfix-2.0.x`. After using `mfrb` to rewrite your commit log you must use `git push -f` to update your fork. The `-f` flag cannot be omitted.

Use `mfrb` whenever an open Pull Request is reporting conflicts (thus preventing the PR from being merged), or anytime you want to refresh a branch or Pull Request. Ideally, all open Pull Request should be periodically rebased so that they can be evaluated in relation to the current codebase. This command makes rebasing much easier to do while requiring much less typing.

Whenever possible, take the opportunity to reduce the number of commit using "squash" or "fixup" (preferred).

{% alert warning %}
NOTE: `mfrb` may stop for conflict resolution. If this occurs, don't panic. Carefully evaluate each instance where `<<<<<` appears in the code and make sure to choose the resolution that fits the commit being applied (not necessarily the final code).
{% endalert %}

---
## `mfup`

Quickly bring a branch up to date, locally and remote.

- Fetch `upstream` to get the latest changes to the Dev Branch
- Rebase the current branch on the Dev Branch. (Conflicts may arise here.)
- Run `git push -f` to update your fork.

{% alert warning %}
NOTE: `mfup` may stop for conflict resolution. If this occurs, don't panic. Carefully evaluate each instance where `<<<<<` appears in the code and make sure to choose the resolution that fits the commit being applied (not necessarily the final code).
{% endalert %}

# Utility Scripts

---
## `mfadd`

Add and fetch a remote.

**Usage:** `mfadd MagoKimbra`

Use this command to get a branch from another Github user to work on. After making changes and committing them to a copy of another user's branch, you can submit a PR to the original branch on their fork. If their branch has an open PR, then your PR's changes become included in their PR when merged.

---
## `mfclean`

Check to see if branches can be deleted. Remove merged branches and any branches that have been deleted from your fork. Use with care. May not be suitable for all working styles.

# Documentation Scripts

Documentation can be worked on with PRs, but these scripts assume a more direct approach for privileged users. You can still check out the documentation, make changes, and submit PRs. The `mfpr`, `mfnew`, `mfqp`, and `mfup` scripts are all compatible with the `MarlinDocumentation` repository as well.

---
## `mfdoc`

Use Jekyll to compile the Marlin documentation website and display the local copy in the browser using the small integrated webserver. This command only runs in the `MarlinDocumentation` repository with the `master` branch checked out.

---
## `mfpub`

Publish the current documentation website. This command only runs in the `MarlinDocumentation` repository with the `master` branch checked out. Only committed changes will be published. Uncommitted changes will be stashed and popped, so you can continue to work on them.

- Check out `master` and force-push changes to `origin` and `upstream`.
- Build the full Marlin documentation website to a temporary folder.
- Check out `gh-pages` and copy the built website into it.
- Add and commit changes, then push the `gh-pages` branch.
