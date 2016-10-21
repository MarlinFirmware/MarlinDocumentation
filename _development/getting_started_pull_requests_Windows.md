---
title:        'Getting Started - Code Changes &amp; Pull Requests (Windows)'
description:  'How to get Marlin code, modify it, upload it &amp; do a pull request'

author: Bob Kuhn
contrib: 
category: [ development ]
---


## Intro

Hopefully this will save someone the aggravation I went through trying to get my Marlin code to the right place in GitHub for it to be considered by the Marlin team.  It took me a LONG time, a lot of reading and a whole bunch of failed attempts before I was able to do it.

The key is generating a pull request that compares the Marlin main repository against your repository.  To do this you need to fork the main repository to your work area.

I thought I'd create more repositories in my work area by doing forks within my work area.  I wasn't able to create a proper pull request with these &quot;fork of fork&quot; repositories.

The Marlin team has guidelines for the code changes and for GitHub documentation &amp; process.  Please review the [Wiki](https://github.com/MarlinFirmware/Marlin/wiki) and in particular [Contributing to Marlin](https://github.com/MarlinFirmware/Marlin/wiki/DNE-Contributing) and [Coding Standards](https://github.com/MarlinFirmware/Marlin/wiki/DNE-Coding-Standards)

Some of the Wiki stuff won't make sense until you've been through the process.  I had to go over them multiple times plus read/watch a bunch of online tutorials.

The tutorials were good for an overall picture but lacked enough detail to actually accomplish the task.  Hopefully this document supplies the details.

--------------------------------------------------------------------------------------------------------------------------

## Getting the code into your PC & setting up GitHub

You'll need a GitHub account and the desktop application.

Go to the main Marlin repository at:   [https://github.com/MarlinFirmware/Marlin](https://github.com/MarlinFirmware/Marlin)

Fork Marlin to your area by clicking the `fork` icon in the upper right

![image1]({{ '/assets/images/docs/development/pull_images/pull_1.jpg' | prepend: site.baseurl }})



You'll see a popup saying it's copying files and then your GitHub work area pops up showing the new (forked) repository.  That should happen within 10-20 seconds of clicking the Fork icon.

You'll have to wait before doing anything further until the `Fetching Latest Commit` goes away.  If it's still there after few minutes then GitHub is hung (not unusual).   Either way click on the `Settings` icon

![image2]({{ '/assets/images/docs/development/pull_images/pull_2.jpg' | prepend: site.baseurl }})



Change the repository name by clicking in the `Repository name` box, typing the new name and then clicking on the `Rename` button.

![image3]({{ '/assets/images/docs/development/pull_images/pull_3.jpg' | prepend: site.baseurl }})



![image4]({{ '/assets/images/docs/development/pull_images/pull_4.jpg' | prepend: site.baseurl }})



That takes you back where the new name is displayed.

Edit the title by clicking `Edit`.

![image5]({{ '/assets/images/docs/development/pull_images/pull_5.jpg' | prepend: site.baseurl }})



Type in the new title and click `Save`.

Do not change the website.

![image6]({{ '/assets/images/docs/development/pull_images/pull_6.jpg' | prepend: site.baseurl }})



Open Desktop on your computer.

![image7]({{ '/assets/images/docs/development/pull_images/pull_7.jpg' | prepend: site.baseurl }})



Select the branch you want to download to your computer by clicking `branches`.

![image8]({{ '/assets/images/docs/development/pull_images/pull_8.jpg' | prepend: site.baseurl }})



Then click on `Change default branch`

![image9]({{ '/assets/images/docs/development/pull_images/pull_9.jpg' | prepend: site.baseurl }})





Click on `RC` and a drop down appears.  Click on `RCBugFix` and then on the `Update` button.

![image10]({{ '/assets/images/docs/development/pull_images/pull_10.jpg' | prepend: site.baseurl }})

A warning pops up.  Just click the `button`

![image11]({{ '/assets/images/docs/development/pull_images/pull_11.jpg' | prepend: site.baseurl }})



Now click on `<> Code`

![image12]({{ '/assets/images/docs/development/pull_images/pull_12.jpg' | prepend: site.baseurl }})

Click the `Clone or download` button

![image13]({{ '/assets/images/docs/development/pull_images/pull_13.jpg' | prepend: site.baseurl }})



Select `Open in Desktop`

![image14]({{ '/assets/images/docs/development/pull_images/pull_14.jpg' | prepend: site.baseurl }})



A security popup may appear.  Just click the `Allow` button

![image15]({{ '/assets/images/docs/development/pull_images/pull_15.jpg' | prepend: site.baseurl }})



Click `OK` to save it in the default location.

![image16]({{ '/assets/images/docs/development/pull_images/pull_16.jpg' | prepend: site.baseurl }})



A progress bar appears

![image17]({{ '/assets/images/docs/development/pull_images/pull_17.jpg' | prepend: site.baseurl }})



The repository is now in your desktop.

Only the selected branch was downloaded to Desktop.

Check that the desired branch was downloaded.  Click `Changes`

![image18]({{ '/assets/images/docs/development/pull_images/pull_18.jpg' | prepend: site.baseurl }})



Click `open this repository`

![image19]({{ '/assets/images/docs/development/pull_images/pull_19.jpg' | prepend: site.baseurl }})



A Windows Explorer window pops up.  Open the Marlin directory and then open the version.h file

![image20]({{ '/assets/images/docs/development/pull_images/pull_20.jpg' | prepend: site.baseurl }})



Scroll down until the &quot;#define SHORT\_BUILD\_VERSION&quot; is visible.  The text should say RCBugFix in it.

![image21]({{ '/assets/images/docs/development/pull_images/pull_21.jpg' | prepend: site.baseurl }})



If not you'll need to repeat the steps starting with &quot;Select the branch you want to download to your computer by clicking branches.&quot;.  Try the exact same steps a couple of times.  If still not downloaded try selecting the branch via one of these two ways.

![image22]({{ '/assets/images/docs/development/pull_images/pull_22.jpg' | prepend: site.baseurl }})



Once you have the desired branch then make at least two local copies of the directory

- --One to do your work &amp; testing in
- --One so you have the original files in case you need to revert

Now make a new branch via Desktop by clicking this `icon`

![image23]({{ '/assets/images/docs/development/pull_images/pull_23.jpg' | prepend: site.baseurl }})



Type in the `name` and click `Create new branch`

![image24]({{ '/assets/images/docs/development/pull_images/pull_24.jpg' | prepend: site.baseurl }})



The new branch is automatically selected.  Click the `Publish` button to make GitHub aware of the new branch.  The button changes to Sync after the publish completes

![image25]({{ '/assets/images/docs/development/pull_images/pull_25.jpg' | prepend: site.baseurl }})



Creating the new branch just changed/created some pointers/flags - the directory names &amp; file contents didn't change.

## Now go do your code changes &amp; testing.

## Making your code available to the Marlin team

When you want the outside world to see your changes (because you're finished or you want a review/advice or ???) just go back to Desktop, select the desired branch, select changes and then copy/write the changed files into to the GitHub directory (the one where you checked the version.h file).  As the files are updated/replaced the change window in Desktop will update.  Clicking on the name of the file will bring up the changes in the right side window.

![image26]({{ '/assets/images/docs/development/pull_images/pull_26.jpg' | prepend: site.baseurl }})



Filling in the `Summary` and `Description` &amp; then clicking `Commit` takes a snapshot of the directory.  Make sure the check boxes are clicked on the files that you want to be made visible to the outside world.

![image27]({{ '/assets/images/docs/development/pull_images/pull_27.jpg' | prepend: site.baseurl }})



Before doing the commit

- Please review the Marlin team's guidelines
- Make sure you've compiled and done some sanity tests on the code you've written/copied into the branch directory

Actually moving the committed changes up to GitHub is done by clicking the `Sync` icon

![image28]({{ '/assets/images/docs/development/pull_images/pull_28.jpg' | prepend: site.baseurl }})



Now go back to the main Marlin page on GitHub and click the `New pull request` button.

![image29]({{ '/assets/images/docs/development/pull_images/pull_29.jpg' | prepend: site.baseurl }})

Click `compare across forks`

![image30]({{ '/assets/images/docs/development/pull_images/pull_30.jpg' | prepend: site.baseurl }})



Select the RCBugFix branch in the main Marlin repository by clicking the `base` button and then clicking on `RCBugFix`

![image31]({{ '/assets/images/docs/development/pull_images/pull_31.jpg' | prepend: site.baseurl }})



Click `compare across forks` (again)

![image32]({{ '/assets/images/docs/development/pull_images/pull_32.jpg' | prepend: site.baseurl }})



Click on the `head fork:` button and then click on `your repository`

![image33]({{ '/assets/images/docs/development/pull_images/pull_33.jpg' | prepend: site.baseurl }})

Click on the `compare` button and then click the `name of the branch` you created with Desktop

![image34]({{ '/assets/images/docs/development/pull_images/pull_34.jpg' | prepend: site.baseurl }})



The text from your commit is copied into the pull request.  Modify as desired.  When happy click the `Create pull request` button.

![image35]({{ '/assets/images/docs/development/pull_images/pull_35.jpg' | prepend: site.baseurl }})



Here's the pull request that was just created.

![image36]({{ '/assets/images/docs/development/pull_images/pull_36.jpg' | prepend: site.baseurl }})



You probably have an open issue associated with your code changes.  Copy the pull request's URL into the issue.
