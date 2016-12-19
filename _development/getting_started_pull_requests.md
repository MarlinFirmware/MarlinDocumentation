---
title:        'Contributing Code with Pull Requests'
description:  'How to get Marlin code, modify it, upload it &amp; do a pull request'
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

`RCBugFix` is the work branch for our next release. For convenience you may want to change the "Default Branch" to `RCBugFix` in your fork to make it easier to do Pull Requests later.

Click on the `# branches` tab to view all branches in your fork.

![image8]({{ '/assets/images/docs/development/pull_images/pull_8.jpg' | prepend: site.baseurl }})

Click on the `Change default branch` button.

![image9]({{ '/assets/images/docs/development/pull_images/pull_9.jpg' | prepend: site.baseurl }})

Click on the branch dropdown button. Select `RCBugFix` and click `Update`.

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

Scroll down until the &quot;#define SHORT\_BUILD\_VERSION&quot; is visible. The text should say RCBugFix in it.

![image21]({{ '/assets/images/docs/development/pull_images/pull_21.jpg' | prepend: site.baseurl }})

If you downloaded the wrong branch, go back to the GitHub website, select the correct branch, and choose "Open in Desktop" again.

----

## Make a feature branch

You should keep an unaltered copy of the `RCBugFix` branch that you can keep up to date from the main project. To make patches or add a new feature, make a copy of `RCBugFix` with a descriptive name.

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

You can use GitHub Desktop to submit a pull request by using the `Pull Request` button, but you must be careful to _**specifically target the `MarlinFirmware/RCBugFix` branch!**_

### Submit from the GitHub website

Return to your fork's page on GitHub, select your updated branch, and click the `New Pull Request` button.

![image29]({{ '/assets/images/docs/development/pull_images/pull_29.jpg' | prepend: site.baseurl }})

GitHub should automatically detect the target for the pull request as `RCBugFix` in the main `MarlinFirmware` project. However, you may instead see a page like the one below. In that case, click the `Compare across forks` button:

![image30]({{ '/assets/images/docs/development/pull_images/pull_30.jpg' | prepend: site.baseurl }})

To target the `RCBugFix` branch in the main Marlin repository, click the `base` button and select `RCBugFix`.

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
