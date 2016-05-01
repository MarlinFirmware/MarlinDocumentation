$( document ).ready(function() {
    // Build dynamically the table of contents
    $("#toc").tocify({
        selectors: (typeof toc_selectors != 'undefined') ? toc_selectors : 'h1,h2,h3',
        extendPage: false,
        scrollTo: 65
    });

    // Hack tables, Jekyll's default table formating is awfull
    $( 'table' ).addClass( 'table table-bordered table-hover' );

    // Activate tooltips
    $('[data-toggle="tooltip"]').tooltip();
});
