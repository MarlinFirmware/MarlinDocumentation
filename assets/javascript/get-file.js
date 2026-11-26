/**
 * Start the download requested by /get-file?url=... (see redirects/get-file.html)
 *
 * Only Marlin's own downloads are accepted, so that a marlinfw.org link
 * can't be used to push an arbitrary file at a visitor.
 */
(function () {
  'use strict';

  // Release assets, and archives of tags and branches. Not commit hashes or
  // pull request refs, which can expose unreviewed code from any fork.
  var ALLOWED_PATH = /^\/MarlinFirmware\/[\w.-]+\/(releases\/(latest\/)?download\/.+|archive\/(refs\/(tags|heads)\/)?(?![0-9a-f]{4,40}\.(zip|tar\.gz)$)(?!refs\/)[^?#]+\.(zip|tar\.gz))$/i;

  var params = new URLSearchParams(location.search),
      requested = params.get('url');
  if (requested === null) return;

  // Drop the parameter so reloading or bookmarking doesn't download again
  params.delete('url');
  var query = params.toString();
  history.replaceState(null, '', location.pathname + (query ? '?' + query : '') + location.hash);

  var heading = document.getElementById('donate');
  if (!heading) return;

  // The browser doesn't reliably jump to #donate on this first load
  window.addEventListener('load', function () { heading.scrollIntoView({ behavior: 'instant' }); });

  var file;
  try { file = new URL(requested); } catch (e) { return; }
  if (file.protocol !== 'https:' || file.host !== 'github.com'
      || file.username || file.password || !ALLOWED_PATH.test(file.pathname)) return;

  var notice = document.createElement('p'),
      link = document.createElement('a');
  link.href = file.href;
  link.textContent = 'click here';
  notice.className = 'note';
  notice.append('Your download should begin shortly. If it doesn’t, ', link, '.');
  heading.after(notice);

  // These URLs are served as attachments, so this page stays open
  window.addEventListener('load', function () {
    setTimeout(function () { location.assign(file.href); }, 1000);
  });
})();
