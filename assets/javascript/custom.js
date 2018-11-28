$( document ).ready(function() {
    /**
     * Dynamically build the table of contents
     */
    $("#toc").tocify({
        selectors: (typeof toc_selectors != 'undefined') ? toc_selectors : 'h1,h2,h3',
        scrollTo: 65,
        extendPage: false,
        hashGenerator: 'pretty',
    });

    /**
     * SEO optimization: mark all external link as nofollow
     */
    $('a:not(:has(img))').filter(function() {
        return this.hostname && this.hostname !== location.hostname;
    }).attr('target', '_blank').attr('rel', 'nofollow');

    /**
     * Activate all tooltip elements
     */
    $('[data-toggle="tooltip"]').tooltip();

    // Hack tables, Jekyll's default table formating is awful
    //$( 'table' ).addClass( 'table table-bordered table-hover' );

    /* add 'here' class to current page tree */
    var url = window.location.pathname

    // Grab every link from the navigation
    $('.nav.navbar-nav li a').each(function(){
      if (this.href.endsWith(url) && url.length > 2)
        $(this).addClass('here').parents('li').addClass('here');
    });
});
