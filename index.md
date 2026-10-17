---
title:       'Home'
description: 'Marlin Firmware - A Really Good 3D Printer Driver.'
category:    [ default ]
layout:      home
regenerate:  true
# Theme Options
nav_enabled: true
nav_exclude: true
gh_edit_link: true # show or hide edit this page link
back_to_top: true
back_to_top_text: "Back to top"
---

<!-- This how TOC is emitted with just-the-docs out of the box. But we'll emit nav in layouts instead. See _layouts/article.html  -->
<!-- details open markdown="block">
  <summary>Page Index</summary>{: .text-delta }
  - TOC
  {:toc}
</details -->

<script>
const toggleDarkMode = document.querySelector('.js-toggle-dark-mode');
jtd.addEvent(toggleDarkMode, 'click', function() {
    if (jtd.getTheme() === 'dark') {
        jtd.setTheme('light');
        toggleDarkMode.textContent = 'Preview dark color scheme';
    } else {
        jtd.setTheme('dark');
        toggleDarkMode.textContent = 'Return to the light side';
    }
});
</script>

# {{site.name}}

## Welcome

Marlin is a highly optimized monolithic firmware designed to execute motion smoothly and reliably while maintaining a responsive user interface on a single MCU. If you need a motion system for your project consider choosing Marlin!

The sidebar has one other feature — this one from Bootstrap. If the user’s viewport is tall enough, the sidebar remains fixed on the page. This allows the user to scroll down the page and still keep the sidebar in view.

In the customsscripts.js file in the js folder, there’s a function that adds an affix class if the height of the browser window is greater than 800 pixels. If the browser’s height is less than 800 pixels, the nav affix class does not get inserted. As a result, the sidebar can slide up and down as the user scrolls up and down the page.

Depending on your content, you may need to adjust 800 pixel number. If your sidebar is so long that having it in a fixed position makes it so the bottom of the sidebar gets cut off, increase the 800 pixel number here to a higher number.

Text can be **bold**, _italic_, or ~~strikethrough~~.

[Link to another page](../another-page).

There should be whitespace between paragraphs.

There should be whitespace between paragraphs. We recommend including a README, or a file with information about your project.

# [](#header-1)Header 1

This is a normal paragraph following a header. GitHub is a code hosting platform for version control and collaboration. It lets you and others work together on projects from anywhere.

## [](#header-2)Header 2

> This is a blockquote following a header.
>
> When something is important enough, you do it even if the odds are not in your favor.

### [](#header-3)Header 3

```py
# Python code with syntax highlighting
import module

def function(x):
    return x + 1

class ClassName(object):
    """docstring for ClassName"""
    def __init__(self, arg):
        super(ClassName, self).__init__()
        self.arg = arg

    @property
    def foo(self):
        return self._foo
```

```js
// Javascript code with syntax highlighting.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l)
  return true;
}
```

```ruby
# Ruby code with syntax highlighting
GitHubPages::Dependencies.gems.each do |gem, version|
  s.add_dependency(gem, "= #{version}")
end
```

#### [](#header-4)Header 4

*   This is an unordered list following a header.
*   This is an unordered list following a header.
*   This is an unordered list following a header.

##### [](#header-5)Header 5

1.  This is an ordered list following a header.
2.  This is an ordered list following a header.
3.  This is an ordered list following a header.

###### [](#header-6)Header 6

| head1        | head two          | three |
|:-------------|:------------------|:------|
| ok           | good swedish fish | nice  |
| out of stock | good and plenty   | nice  |
| ok           | good `oreos`      | hmm   |
| ok           | good `zoute` drop | yumm  |

### There's a horizontal rule below this.

* * *

### Here is an unordered list:

*   Item foo
*   Item bar
*   Item baz
*   Item zip

### And an ordered list:

1.  Item one
1.  Item two
1.  Item three
1.  Item four

### And a nested list:

- level 1 item
  - level 2 item
  - level 2 item
    - level 3 item
    - level 3 item
- level 1 item
  - level 2 item
  - level 2 item
  - level 2 item
- level 1 item
  - level 2 item
  - level 2 item
- level 1 item

### Small image

![](https://assets-cdn.github.com/images/icons/emoji/octocat.png)

### Large image

![](https://guides.github.com/activities/hello-world/branching.png)

### Definition lists can be used with HTML syntax.

<dl>
<dt>Name</dt>
<dd>Godzilla</dd>
<dt>Born</dt>
<dd>1952</dd>
<dt>Birthplace</dt>
<dd>Japan</dd>
<dt>Color</dt>
<dd>Green</dd>
</dl>

```
Long, single-line code blocks should not wrap. They should horizontally scroll if they are too long. This line should be long enough to demonstrate this.
```

```
The final element.
```
