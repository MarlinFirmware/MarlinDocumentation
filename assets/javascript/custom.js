//
// Marlin custom Javascript
//

// Cookie Helpers

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + '=',
      decodedCookie = decodeURIComponent(document.cookie),
      ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return '';
}

// Set Lighting according to cookie or time

function setDarkMode(dark) {
  //console.log((dark ? "Set" :  "Clear") + " dark mode.");
  var $t = $('html'), q = '/assets/images/';
  dark ? $t.attr('data-theme', 'dark') : $t.removeAttr('data-theme');
  $('#daynite')
    .attr('src', q + 'btn-' + (dark ? 'day' : 'night') + '.svg')
    .css('visibility', 'visible');
}

function toggleDarkMode() {
  var dark = !document.documentElement.hasAttribute("data-theme");
  setDarkMode(dark);
  return dark;
}

var nightMode = getCookie('nightMode');
if (nightMode === '') {
  var d = new Date(), h = d.getHours();
  nightMode = (h >= 19 || h < 6);
}
else
  nightMode = (nightMode === 'true');

setDarkMode(nightMode);


// Scroll Position Detection

var $animation_elements = $('.animation-element');
var $window = $(window);

function check_if_in_view() {
  var win_height = $window.height();
  var win_top = $window.scrollTop();
  var win_bottom = (win_top + win_height);

  $.each($animation_elements, function() {
    var $e = $(this);
    var height = $e.outerHeight();
    var top = ($e.offset().top);
    var bottom = (top + height);

    // Check whether this current container is within viewport
    if (bottom >= win_top && top <= win_bottom - 100)
      $e.addClass('in-view');
  });
}
check_if_in_view();
$window.on('scroll', check_if_in_view);

$(function() {

  /**
   * Dynamically build the table of contents
   */
  $toc = $("#toc");
  if ($toc !== undefined) $toc.tocify({
    selectors: (typeof toc_selectors != 'undefined') ? toc_selectors : 'h1,h2,h3,h4',
    scrollTo: 60,
    smoothScroll: false,
    extendPage: false,
    hashGenerator: 'pretty'
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
  //$('table').addClass('table table-bordered table-hover');

  // Mark 'here' links in the navigation
  var url = window.location.pathname
  $('.nav.navbar-nav li a').each(function() {
    if (this.href.endsWith(url) && url.length > 2)
      $(this).addClass('here').parents('li').addClass('here');
  });

  // Expand first item of tocify (table of content) by default
  $('#toc .tocify-subheader').first().css('display','block');

  // Responsive submenu - shifts to left on smaller window
  // Bootstrap's pull-left is right and vice versa
  var minWindowWidth = 768, maxWindowWidth = 1100;

  // Resize image to fit panel
  function resizeImage() {
    var w = $(window).width(), maxw = maxWindowWidth + 100;
    $('.custom-article img').each(function() {
      var $t = $(this);
      if ($t.width() >= 600) {
        $(this).css('width', w >= maxw ? '840px' : w >= minWindowWidth ? '90%' : '690px');
      }
    });
    if (w <= 991) {
      $('.mfw-bg').css('position', 'absolute');
      var rightShift = 520;
      $('.mfw-bg').css('right', rightShift + 'px');
      $('#mfw-logo').addClass('mfw-bg');
    }
    else {
      $('.mfw-bg').css('position', 'relative');
      $('#mfw-logo').removeClass('mfw-bg');
      $('#mfw-logo').css('right', 0 );
    }
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

  $('#daynite').click(function(){
    const dark = toggleDarkMode();
    setCookie('nightMode', dark);
  });

  // Scroll to the active nav item in a long nav sidebar, such as docs/gcode/*.html
  const $here_ul = $('.container.detail ul.nav.nav-list');
  if ($here_ul.length) {
    const $here_link = $here_ul.children('li.tocify-item.active');
    if ($here_link.length) {
      $.fn.visibleHeight = function() {
        const scrollTop = $(window).scrollTop(),
              scrollBot = scrollTop + $(window).height(),
              elTop = this.offset().top,
              elBottom = elTop + this.outerHeight(),
              visibleTop = elTop < scrollTop ? scrollTop : elTop,
              visibleBot = elBottom > scrollBot ? scrollBot : elBottom;
        return visibleBot - visibleTop;
      };
      $here_ul.prop({ scrollTop: $here_link.offset().top - $here_ul.visibleHeight() / 2 });
    }
  }

  // Fire the singleton init on document.ready
  jekyllSearch.init();
});
