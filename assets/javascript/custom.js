$( document ).ready(function() {
    $('#toc').toc({
        'selectors':        (typeof  toc_selectors != 'undefined') ? toc_selectors : 'h1,h2,h3',
        'activeClass':      'active',
        'prefix':           'toc-',

        'scrollToOffset':   75,
        'highlightOffset':  50,

        'itemClass': function(i, heading, $heading, prefix) {
            //return 'custom-list-group-item ' + prefix + $heading[0].tagName.toLowerCase();;
            return prefix + $heading[0].tagName.toLowerCase();;
        }
    });

    // Hack tables, Jekyll's default table formating is awfull
    $( 'table' ).addClass( 'table table-bordered table-hover' );

    // Activate tooltips
    $('[data-toggle="tooltip"]').tooltip();
});
