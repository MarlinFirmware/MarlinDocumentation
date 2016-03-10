$( document ).ready(function() {
    $('#toc').toc({
        'selectors': 'h1,h2,h3',    //elements to use as headings
        'container': 'body',        //element to find all selectors in

        'activeClass':  'active',       //prefix for anchor tags and class names
        'prefix':       'toc-',         //prefix for anchor tags and class names

        'smoothScrolling': function(target, options, callback) {
            $(target).smoothScroller({
                offset: options.scrollToOffset
                }).on('smoothScrollerComplete', function() {
                    callback();
                });
            },

        'onHighlight': function(el) {}, //called when a new section is highlighted
        'highlightOnScroll': true,      //add class to heading that is currently in focus
        'highlightOffset': 70,          //offset to trigger the next headline
        'scrollToOffset': 70,

        //custom function for anchor name
        'anchorName': function(i, heading, prefix) {
            return prefix + i;
        },

        //custom function building the header-item text
        'headerText': function(i, heading, $heading) {
            return $heading.text();
        },

        // custom function for item class
        'itemClass': function(i, heading, $heading, prefix) {
            return 'clearfix ' + prefix + $heading[0].tagName.toLowerCase();;
        }
    });
});
