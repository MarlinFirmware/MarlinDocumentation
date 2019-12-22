// Set or remove 'night' class
function setLighting(night) {
  var p = '/assets/images/logo/marlin/', $b = $('body');
  if (night) $b.addClass('night'); else $b.removeClass('night');
  $('img.mflogo').attr('src', p + 'text-' + (night ? 'night' : 'day') + '.png');
}

var d = new Date(), h = d.getHours();
setLighting(n = h >= 19 || h < 6);

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
   * All external links open in a new tab
   */
  $('a:not(:has(img))').filter(function() {
    return this.hostname && this.hostname !== location.hostname;
  }).attr('target', '_blank');

  /**
   * Activate all tooltip elements
   */
  $('[data-toggle="tooltip"]').tooltip();

  // Hack tables, Jekyll's default table formating is awful
  //$( 'table' ).addClass( 'table table-bordered table-hover' );

  // Mark 'here' links in the navigation
  var url = window.location.pathname
  $('.nav.navbar-nav li a').each(function() {
    if (this.href.endsWith(url) && url.length > 2)
      $(this).addClass('here').parents('li').addClass('here');
  });

  // Expand first item of tocify (table of content) by default
  $('.tocify-subheader').first().css('display','block');

  // Responsive submenu - shifts to left on smaller window
  // Bootstrap's pull-left is right and vice versa
  var minWindowWidth = 768, maxWindowWidth = 1100;

  // Resize image to fit panel
  function resizeImage() {
    $('.custom-article img').each(function() {
      var $t = $(this);
      if ($t.width() >= 600) {
        var w = $(window).width(), maxw = maxWindowWidth + 100;
        $(this).css('width', w >= maxw ? '840px' : w >= minWindowWidth ? '90%' : '690px');
      }
    });
  }

  function shiftSubMenu() {
    var w = $(window).width();
    if (w >= minWindowWidth && w <= maxWindowWidth ) {
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
