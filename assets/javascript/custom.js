$(function() {

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


  //expand first item of tocify (table of content) by default
  $('.tocify-subheader').first().css('display','block');

  //responsive submenu - shifts to left on smaller window
  //bootstrap's pull-left is right and vice versa
  var minWindowWidth = 768, maxWindowWidth = 1100;

      //// Resize image to fit panel
  function resizeImage() {
    $('.custom-article img').each(function() {
      var $t = $(this);
      if ($t.width() >= 600) {
        var w = $(window).width(), maxw = maxWindowWidth + 100;
        if (w >= maxw)
          $t.css('width', '840px');
        else if (w >= minWindowWidth && w < maxw)
          $t.css('width', '90%');
      }
    });
  }

  function shiftSubMenu() {
    if ($(window).width() >= minWindowWidth && $(window).width() <= maxWindowWidth ) {
      $('.dropdown-menu').addClass('pull-right');
      $('.dropdown-submenu .dropdown-menu').addClass('flip-left');
    }
    else {
      $('.dropdown-menu').removeClass('pull-right');
      $('.dropdown-submenu .dropdown-menu').removeClass('flip-left');
    }
  }

  shiftSubMenu();
  resizeImage();

  $(window).resize(shiftSubMenu, resizeImage);

  // Fire the singleton init on document.ready
  jekyllSearch.init();

});
