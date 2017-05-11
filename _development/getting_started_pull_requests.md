---
title:        'Contributing Code with Pull Requests'
description:  'How to get Marlin, modify, upload, and &amp; do pull requests'
tag: contributing 2

author: Bob-the-Kuhn, thinkyhead
contrib:
category: [ development ]
---

{% alert info %}
The current version of this document is targeted at Windows users.
{% endalert %}


## Intro

GitHub is a great tool for collaboration, but it takes some getting used to. The power of GitHub centers around the `git` version control system. If you've used version control systems like CVS, Subversion, or Mercurial, then `git` should be familiar. GitHub provides issue management, bug tracking, and other features that make it an ideal platform on which to build Marlin and its associated content.

Before submitting code and other content, please review [Contributing to Marlin](https://github.com/MarlinFirmware/Marlin/wiki/DNE-Contributing) and [Marlin Coding Standards](https://github.com/MarlinFirmware/Marlin/wiki/DNE-Coding-Standards). These pages are still on the old wiki, but we'll publish them here soon.

----

## Set up GitHub, Fork, and Clone

Before you can contribute to Marlin, you need to get a [free GitHub.com account](https://github.com/join). This is a pretty quick process. Please upload a unique icon or image so it will be easier to identify you on the project pages! You'll also need to download and install the [GitHub Desktop](https://desktop.github.com) application.

After signing in to your GitHub account, go to the main Marlin repository at: [https://github.com/MarlinFirmware/Marlin](https://github.com/MarlinFirmware/Marlin) and create a fork of Marlin by clicking the `fork` icon in the top right of the page.

![image1]({{ '/assets/images/docs/development/pull_images/pull_1.jpg' | prepend: site.baseurl }})

When GitHub is done copying files, a page will appear displaying your shiny new fork of Marlin. This takes about 10-20 seconds, so be patient. You may need to wait for the `Fetching Latest Commit` message to go away also. If still hasn't finished after few minutes then GitHub might be hung up (not unusual).

----

## Rename your Fork (not recommended)

It's always best to leave the repository name as "Marlin" unless you plan to make your own custom version of Marlin for publication. Here are the instructions if you want to rename it.

Click on the `Settings` icon.

![image2]({{ '/assets/images/docs/development/pull_images/pull_2.jpg' | prepend: site.baseurl }})

Click in the `Repository name` box, type the new name, and click `Rename`.

![image3]({{ '/assets/images/docs/development/pull_images/pull_3.jpg' | prepend: site.baseurl }})

![image4]({{ '/assets/images/docs/development/pull_images/pull_4.jpg' | prepend: site.baseurl }})

This takes you back to your fork's main page, where the new name is displayed.

Edit the title by clicking `Edit`.

![image5]({{ '/assets/images/docs/development/pull_images/pull_5.jpg' | prepend: site.baseurl }})

Type in the new title and click `Save`.

![image6]({{ '/assets/images/docs/development/pull_images/pull_6.jpg' | prepend: site.baseurl }})

----

## Change the Default Branch

`bugfix-1.1.x` is the work branch for our next release. For convenience you may want to change the "Default Branch" to `bugfix-1.1.x` in your fork to make it easier to do Pull Requests later.

Click on the `# branches` tab to view all branches in your fork.

![image8]({{ '/assets/images/docs/development/pull_images/pull_8.jpg' | prepend: site.baseurl }})

Click on the `Change default branch` button.

![image9]({{ '/assets/images/docs/development/pull_images/pull_9.jpg' | prepend: site.baseurl }})

Click on the branch dropdown button. Select `bugfix-1.1.x` and click `Update`.

![image10]({{ '/assets/images/docs/development/pull_images/pull_10.jpg' | prepend: site.baseurl }})

A warning pops up. Just click the `button`.

![image11]({{ '/assets/images/docs/development/pull_images/pull_11.jpg' | prepend: site.baseurl }})

----

## Clone Marlin to GitHub Desktop

Click on `<> Code`

![image12]({{ '/assets/images/docs/development/pull_images/pull_12.jpg' | prepend: site.baseurl }})

Click the `Clone or download` button

![image13]({{ '/assets/images/docs/development/pull_images/pull_13.jpg' | prepend: site.baseurl }})

Select `Open in Desktop`

![image14]({{ '/assets/images/docs/development/pull_images/pull_14.jpg' | prepend: site.baseurl }})

A security popup may appear. Just click the `Allow` button

![image15]({{ '/assets/images/docs/development/pull_images/pull_15.jpg' | prepend: site.baseurl }})

Click `OK` to save it in the default location.

![image16]({{ '/assets/images/docs/development/pull_images/pull_16.jpg' | prepend: site.baseurl }})

A progress bar appears.

![image17]({{ '/assets/images/docs/development/pull_images/pull_17.jpg' | prepend: site.baseurl }})

## Using GitHub Desktop...

You now have a "working copy" of Marlin on your PC. Note that only the branch you selected on your GitHub page may have been downloaded. Check that the desired branch was downloaded by clicking on `Changes`.

![image18]({{ '/assets/images/docs/development/pull_images/pull_18.jpg' | prepend: site.baseurl }})

Click `Open this repository`.

![image19]({{ '/assets/images/docs/development/pull_images/pull_19.jpg' | prepend: site.baseurl }})

A Windows Explorer window pops up. Open the `Marlin` directory and then open the `Version.h` file.

![image20]({{ '/assets/images/docs/development/pull_images/pull_20.jpg' | prepend: site.baseurl }})

Scroll down until the &quot;#define SHORT\_BUILD\_VERSION&quot; is visible. The text should say bugfix-1.1.x in it.

![image21]({{ '/assets/images/docs/development/pull_images/pull_21.jpg' | prepend: site.baseurl }})

If you downloaded the wrong branch, go back to the GitHub website, select the correct branch, and choose "Open in Desktop" again.

----

## Make a feature branch

You should keep an unaltered copy of the `bugfix-1.1.x` branch that you can keep up to date from the main project. To make patches or add a new feature, make a copy of `bugfix-1.1.x` with a descriptive name.

![image22]({{ '/assets/images/docs/development/pull_images/pull_22.jpg' | prepend: site.baseurl }})

Make a new branch via Desktop by clicking this `icon`:

![image23]({{ '/assets/images/docs/development/pull_images/pull_23.jpg' | prepend: site.baseurl }})

Type in the `name` and click `Create new branch`.

![image24]({{ '/assets/images/docs/development/pull_images/pull_24.jpg' | prepend: site.baseurl }})

The new branch will be automatically selected. Click the `Publish` button to make a copy on GitHub. (The button changes to `Sync` once the branch is published to your account.)

![image25]({{ '/assets/images/docs/development/pull_images/pull_25.jpg' | prepend: site.baseurl }})

----

## Make code changes &amp; test.

You can freely edit code files, configurations, etc., in your working copy. You can make new branches in your working copy to experiment, then throw them away. Nothing counts until you publish and sync your changes. And thanks to the magic of `git` you can always go back to earlier points in time.

In the main view, GitHub Desktop shows all your uncommitted changes in a list. You can click on each item to see the specific changes in the right pane. Previous commits are shown under the "History" tab.

## Commit changes to your working copy

Use GitHub Desktop to "commit" (in your working copy) the changes you want to keep. A commit not only stores your changes but also acts like a bookmark for the point in time when the changes were committed. Each "commit message" summarizes why the changes were made.

Tick the checkboxes on all the files that you want to commit. (Note that you can also "cherry-pick" selected changes by clicking in the margin of the second pane.)

![image26]({{ '/assets/images/docs/development/pull_images/pull_26.jpg' | prepend: site.baseurl }})

Fill in the `Summary` and `Description`, then click `Commit`. Voila! The selected changes are packaged and ready for submission.

![image27]({{ '/assets/images/docs/development/pull_images/pull_27.jpg' | prepend: site.baseurl }})

Once everything is committed, publish to your GitHub account by clicking the `Sync` button:

![image28]({{ '/assets/images/docs/development/pull_images/pull_28.jpg' | prepend: site.baseurl }})

----

## Submit code with a Pull Request

Before submitting the Pull Request:

- Please review the [Marlin project guidelines](https://github.com/MarlinFirmware/Marlin/wiki/DNE-Contributing).
- Make sure you've compiled and done some sanity tests on the code.

### Submit from GitHub Desktop

You can use GitHub Desktop to submit a pull request by using the `Pull Request` button, but you must be careful to _**specifically target the `MarlinFirmware/bugfix-1.1.x` branch!**_

### Submit from the GitHub website

Return to your fork's page on GitHub, select your updated branch, and click the `New Pull Request` button.

![image29]({{ '/assets/images/docs/development/pull_images/pull_29.jpg' | prepend: site.baseurl }})

GitHub should automatically detect the target for the pull request as `bugfix-1.1.x` in the main `MarlinFirmware` project. However, you may instead see a page like the one below. In that case, click the `Compare across forks` button:

![image30]({{ '/assets/images/docs/development/pull_images/pull_30.jpg' | prepend: site.baseurl }})

To target the `bugfix-1.1.x` branch in the main Marlin repository, click the `base` button and select `bugfix-1.1.x`.

![image31]({{ '/assets/images/docs/development/pull_images/pull_31.jpg' | prepend: site.baseurl }})

Click `compare across forks` (again).

![image32]({{ '/assets/images/docs/development/pull_images/pull_32.jpg' | prepend: site.baseurl }})

Click on the `head fork:` button and then click on `your repository`.

![image33]({{ '/assets/images/docs/development/pull_images/pull_33.jpg' | prepend: site.baseurl }})

Click on the `compare` button and then click the `name of the branch` you created with Desktop.

![image34]({{ '/assets/images/docs/development/pull_images/pull_34.jpg' | prepend: site.baseurl }})

If you have only a single commit, its text will be copied into the pull request. Edit as needed to provide all the relevant details. When your description is complete click the `Create pull request` button.

![image35]({{ '/assets/images/docs/development/pull_images/pull_35.jpg' | prepend: site.baseurl }})

Here's the pull request that was just created.

![image36]({{ '/assets/images/docs/development/pull_images/pull_36.jpg' | prepend: site.baseurl }})

If you have an open issue associated with your pull request, include that issue's number in your pull request description (e.g., "`#1536`"), and a link to the pull request will automatically appear on the issue's page. The same goes for individual commit descriptions.


## Updating the PR

Typically you`ll get requests to correct, improve and add features to your code.
The top level steps of doing this are:
1.	Open your branch in Windows Explorer
2.	Edit & test your code
3.	Move the code to the PR (commit & sync your code)
4.	Repeat the above as necessary
5.	Resolve `All checks have failed' issues
6.	Make the PR pretty & sync to main repository ( may need to be done multiple times)

### Open your branch in Windows Explorer

You've done most of this before when you created your branch.

Open Desktop, select your repository (on the left side), select your branch (top left), click on `Changes` (top middle) and then click on `open this repository` (right middle)

![image37]({{ '/assets/images/docs/development/pull_images/pull_37.jpg' | prepend: site.baseurl }})
A Windows Explorer window will popup. Copy the `Marlin` directory to your work area. Close the Windows Explorer window and close Desktop.

![image38]({{ '/assets/images/docs/development/pull_images/pull_38.jpg' | prepend: site.baseurl }})

### Edit & test your code

As before, do all your work & testing in your local copy.

### Move the code to the PR (commit & sync your code)

Open Desktop and the Windows Explorer window as before

Copy the changed files into the new Windows Explorer window. Alternatively you can just copy your entire directory over. GitHub will check the newly copied files against the old and only list the ones that have changed.

Finish the commit and sync as you did previously in `Commit changes to your working copy`

_**Since this branch is tied to a PR, the PR is also updated when you do the sync. **_

Most of the time you've made changes to the Configuration.h and Configuration_adv.h files that are specific to your printer. Do NOT upload those to the PR. This can be done multiple ways:
*	Don't copy them into the GitHub directory
*	Don't include them in the commit

### Repeat the above as necessary

### Resolve `All checks have failed' issues

Tests are run on the code when you created the PR and every time you commit new code to the PR. The tests basically consist of multiple cycles of enabling various options and then compiling. These must be resolved before the PR can be merged into the mainstream Marlin code.

Within 30-90 seconds of doing the sync the PR will have a section that looks like this:

![image39]({{ '/assets/images/docs/development/pull_images/pull_39.jpg' | prepend: site.baseurl }})

5 – 90 minutes later the PR will change to this if there are no problems.

![image40]({{ '/assets/images/docs/development/pull_images/pull_40.jpg' | prepend: site.baseurl }})

If you see this instead then there are problems that need to be fixed. You don't have to fix them immediately but they must be fixed before the PR can be merged into the mainstream Marlin code.

To see the errors click on `Details`

![image41]({{ '/assets/images/docs/development/pull_images/pull_41.jpg' | prepend: site.baseurl }})

This will bring up the `Travis` log. Green means that the test has passed. Red means there's a problem.

![image42]({{ '/assets/images/docs/development/pull_images/pull_42.jpg' | prepend: site.baseurl }})

It's recommended that you include the fixes in the next code you commit.

The errors you`re looking at come from the compiler. Resolve just like you do when compiling on your local machine.

Unfortunately the Travis log does not include the options that were enabled when the errors were found. That makes it harder to reproduce the problem locally.

### Make the PR pretty & sync to main repository

Before a PR is merged we need to get the number of commits down to one. It's so much easier to see what's going on when all the changes are easily available. If you have multiple commits then you need to go to each individual commit to see what that one changed and pretty soon you've lost track.

The other thing this process does is incorporate any code changes in the main Marlin code that have been done since the PR was created or the last time this process was run.

_**COMBINING ALL THE COMMITS INTO ONE MEANS YOU NO LONGER HAVE THE ABILITY TO REVERT THE NO LONGER EXISTING COMMITS. **_

This process uses a command window/shell to issue GIT commands.

Open Desktop and open the Windows Explorer window. Make a copy of the directory. You may use it later.

Next right click on the repository. A submenu will popup. Click on `Open in Git Shell`.

![image43]({{ '/assets/images/docs/development/pull_images/pull_43.jpg' | prepend: site.baseurl }})

The Git command window/shell pops up.

![image44]({{ '/assets/images/docs/development/pull_images/pull_44.jpg' | prepend: site.baseurl }})

Copy `Git remote –v` and paste it into the Git Shell window and then hit return.

![image45]({{ '/assets/images/docs/development/pull_images/pull_45.jpg' | prepend: site.baseurl }})

If the upstream section is missing then copy & paste `Git remote add upstream https://github.com/MarlinFirmware/Marlin.git` and then hit return.

Next copy & paste `Git fetch upstream` followed by `Git rebase upstream/bugfix-1.1.x` . If no problems are encountered the next text will look like this.

![image46]({{ '/assets/images/docs/development/pull_images/pull_46.jpg' | prepend: site.baseurl }})

If Git can't automatically combine the two code bases then it`ll look like this.

![image47]({{ '/assets/images/docs/development/pull_images/pull_47.jpg' | prepend: site.baseurl }})

It`ll tell you the number of files that need to be looked at and the names of the files. In this example there is one file that needs attention.

Git marks the areas of concern within the file and then writes the modified file to the directory you opened with Desktop.

Open the modified file (the file name didn't change but the time stamp did) and search for `<<<<<<< HEAD`. This marks the beginning of the code that could be newer than what you started with. The `=======` marks the boundary between the newer code and the original code in your file. `>>>>>>>` marks the end of of the code that needs attention. `#endif in wrong place` is the title of the commit that GIT couldn't automatically handle.

It can be helpful to consult the copy you made just before opening the Git Shell. Sometimes you even have to download the latest bugfix-1.1.x to understand.

![image48]({{ '/assets/images/docs/development/pull_images/pull_48.jpg' | prepend: site.baseurl }})

Write the file back.

Go to Git Shell and enter this `Git add Marlin/configuration_store.cpp`. The circled number will decrement.

![image49]({{ '/assets/images/docs/development/pull_images/pull_49.jpg' | prepend: site.baseurl }})

Repeat the `edit-save-Git-add` cycle until all the files have been addressed.

If you couldn't address all the files then you can enter the following to abort the process: `Git rebase –abort`

If all the files have been addressed then enter this into the Git Shell: `Git rebase –continue`

The next step is to "squash" the commits. This takes all the commits and combines them per your instructions. To start the "squash" process enter this `Git rebase -i upstream/bugfix-1.1.x`

In about 5-10 seconds a Notepad window will pop up. It starts with the list of the commits that are currently on the PR. To the extreme left of each line is the action you want performed. Sometimes extra commits are added if the main code base is being updated while you're doing a squash. Check that the first pick is one that you've done for this PR. If it isn't then change it to `drop`. Keep on changing them to `drop` until you get to your first commit. Leave your first commit as `pick`. Change all the other picks in the list to `squash`

![image50]({{ '/assets/images/docs/development/pull_images/pull_50.jpg' | prepend: site.baseurl }})

Once you've changed the file then click `File`, then `Save` and then close the file.

![image51]({{ '/assets/images/docs/development/pull_images/pull_51.jpg' | prepend: site.baseurl }})

In a few seconds a second Notepad window will pop up. In this one you specify the description portion of the squashed commit.

All the lines WITHOUT a leading # will be in the description in the order as in the Notepad window. Edit the text as desired. When done save the file and close it.

![image52]({{ '/assets/images/docs/development/pull_images/pull_52.jpg' | prepend: site.baseurl }})

A few seconds after closing Notepad the Git Shell will show this.

![image53]({{ '/assets/images/docs/development/pull_images/pull_53.jpg' | prepend: site.baseurl }})

In Git Shell enter `Git push –f` to finish the process. In a few seconds the following text will start to scroll up the page. When the command prompt appears then everything is done.

![image54]({{ '/assets/images/docs/development/pull_images/pull_54.jpg' | prepend: site.baseurl }})

You can now close Git Shell.

In Desktop notice that there is now only one commit with all your code changes in it.

You do not need to click `Sync` in Desktop. That was done as part of the `push` command.

You can now close Desktop and the Windows Explorer window you opened from Desktop.
