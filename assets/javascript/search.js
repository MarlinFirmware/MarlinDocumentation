/**
 * A simple JSON search
 * Requires jQuery (v 1.7+)
 *
 * @author  Mat Hayward - Erskine Design
 *          Scott Lahteine - Thinkyhead
 * @version  0.1-MF
 */

"use strict";

//
// Declare a jekyllSearch singleton
//
var jekyllSearch = (function(){

  var q, qmatch, jsonFeedUrl = '/feeds/feed.json',
    $searchForm, $searchInput, $searchButton,
    $resultTemplate, $resultsPlaceholder, $results,
    $foundContainer, $foundTerm, $foundCount,
    allowEmpty = false, showLoader = false,
    loadingClass = 'is--loading',
    self, searchTimer, odd = false,
    section_head = { gcode:"G-code", basics:"Getting Started", config:"Configuration", feat:"Features", devel:"Development" };

  const ignore_pattern = /\b(a(ll|nd|re(n't)?)|but|can('t|not)?|d(id|oes)(n't)?|end|for|ha(d|s|ve)(n't)?|it'?s|odd|use[ds]?|even|from|man?y|more|much|some|this|tha[nt]|th[eo]se|the([mny]|ir|re|y're)?|(was|were)(n't)?|wh(at|en|ere|ich|o|y)|will|won't|other|people|(al)?though|users|your?|one|two)\b/g;

  // Return the public interface
  return {

    /**
     * Get query string parameter - taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
     * @param {String} name
     * @return {String} parameter value
     */
    getParameterByName: function(name) {
      var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
      return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    },

    /**
     * Inject content into template using placeholder
     * @param {String} originalContent
     * @param {String} injection
     * @param {String} placeholder
     * @return {String} injected content
     */
    injectContent: function(originalContent, injection, placeholder) {
      if (injection === undefined) injection = '';
      var regex = new RegExp(placeholder, 'g');
      return originalContent.replace(regex, injection);
    },

    init: function() {
      self = this;

      if (document.location.href.indexOf('meta/search/') == -1) {
        setTimeout(function(){ $('#searchbox>form').css('display','inline-block'); }, 800);
        return;
      }

      $searchForm = $("[data-search-form]");
      $searchInput = $("[data-search-input]");
      $searchButton = $("[data-search-button]");
      $resultTemplate = $("#search-result");
      $resultsPlaceholder = $("[data-search-results]");
      $foundContainer = $("[data-search-found]");
      $foundTerm = $("[data-search-found-term]");
      $foundCount = $("[data-search-found-count]");

      // hide items found string
      $foundContainer.hide();

      /**
       * Initiate search functionality.
       * Show results based on (q)uerystring if present.
       * Bind search function to form submission.
       */

      // Get search results if q parameter is set in querystring
      if (self.getParameterByName('q')) {
        var newq = decodeURIComponent(self.getParameterByName('q'));
        $searchInput.val(newq);
        self.execSearch(newq, newq);
      }

      //$searchForm.on('submit',function(e){ return false; });

      // Get search results on submission of form
      // TODO: Update results on change, after a pause
      $searchInput.change(self.onSearchChanged)
                  .keydown(function(e){
                    var k = e.keyCode;
                    if (k == 10 || k == 13) return self.onSearchChanged(e);
                  })
                  .keyup(function(e){
                    var k = e.keyCode;
                    if (k >= 32 || k == 8) self.onSearchKeyUp();
                  });

      $searchButton.click(function(e) { self.onSearchChanged(e); });

      self.searchFromField();
    },

    searchFieldString: function() {
      return $searchInput.val().trim();
    },

    searchPattern: function(str) {
      const patt = str.toLowerCase().replace(ignore_pattern, '').trim().replace(/\s+/g, '.+');
      return new RegExp(patt);
    },

    searchFromField: function() {
      var newq = self.searchFieldString(),
          newm = self.searchPattern(newq);
      self.execSearch(newq, newm);
    },

    onSearchChanged: function(e) {
      e.preventDefault();
      var newq = self.searchFieldString();
      if (newq.length >= 3 || newq.match(/^[gm]\d+/i))
        self.searchFromField();
      return false;
    },

    onSearchKeyUp: function() {
      if (searchTimer) { clearTimeout(searchTimer); searchTimer = 0; }
      var newq = self.searchFieldString();
      if (newq.length >= 3 || newq.match(/^[gm]\d+/i))
        searchTimer = setTimeout(self.searchFromField, 800);
    },

    fixResultsPos: function() {
      $resultsPlaceholder.css('padding-top', ($("#search .overlay").height() + 6) + 'px');
      $(window).scrollTop(0);
    },

    /**
     * Execute search
     * @return null
     */
    execSearch: function(newq, newm) {
      if (newq != '' || allowEmpty) {
        q = newq;
        qmatch = newm;
        if (showLoader) self.toggleLoadingClass();
        self.getSearchResults(self.resultsProcessor());
        var loc = window.location;
        history.replaceState({}, "marlinfw.org Search", loc.origin + '/meta/search/' + "?q=" + newq);
      }
    },

    /**
     * Toggle loading class on results and found string
     * @return null
     */
    toggleLoadingClass: function() {
      $resultsPlaceholder.toggleClass(loadingClass);
      $foundContainer.toggleClass(loadingClass);
    },

    /**
     * Get Search results from JSON
     * @param {Function} callbackFunction
     * @return null
     */
    getSearchResults: function(callbackFunction) {
      $.get(jsonFeedUrl, callbackFunction, 'json');
    },

    /**
     * Process search result data
     * @return null
     */
    resultsProcessor: function() {
      var results = [];

      return function(data) {

        //console.log("Processor data", data);

        var resultsCount = 0, results = '', lastclass = '';

        $.each(data, function(index, item) {
          // check if search term is in content or title
          const comp = (item.title + ' ' + item.content).toLowerCase();
          if (comp.match(qmatch)) {
            if (item.class != lastclass) {
              lastclass = item.class;
              var fancy = section_head[item.class];
              results += '<h1 class="' + item.class + '">' + (fancy ? fancy : item.class) + '</h1>';
            }
            var result = self.populateResultContent($resultTemplate.html(), item);
            resultsCount++;
            results += result;
          }
        });

        if (showLoader) self.toggleLoadingClass();

        self.populateResultsString(resultsCount);
        self.showSearchResults(results);
      }
    },

    /**
     * Add search results to placeholder
     * @param {String} results
     * @return null
     */
    showSearchResults: function(results) {
      // Add results HTML to placeholder
      $resultsPlaceholder.html(results);
      self.fixResultsPos();
    },

    /**
     * Add results content to item template
     * @param {String} html
     * @param {object} item
     * @return {String} Populated HTML
     */
    populateResultContent: function(html, item) {
      html = self.injectContent(html, item.title, '##Title##');
      html = self.injectContent(html, item.link, '##Url##');
      html = self.injectContent(html, item.excerpt, '##Excerpt##');
      var extra_tags = '';
      if (item.exp !== undefined)
        extra_tags += '<span class="label label-warning"><span data-toggle="tooltip" data-placement="bottom" title="Experimental feature"><i class="fa fa-flask" aria-hidden="true"></i></span></span>';
      if (item.since !== undefined)
        extra_tags += '<span class="label label-success"><span data-toggle="tooltip" data-placement="bottom" title="Available since"><i class="fa fa-code" aria-hidden="true"></i>' + item.since + '</span></span>';
      if (item.group !== undefined)
        extra_tags += '<span class="label label-default"><i class="fa fa-tags" aria-hidden="true"></i>' + item.group + '</span>';
      if (item.requires !== undefined)
        $.each(item.requires.split(","), function() {
          extra_tags += '<span class="label label-requires">' + this + '</span>';
        });
      html = self.injectContent(html, extra_tags, '##CustomHTML##');
      var c = item.class ? item.class : '';
      html = self.injectContent(html, 'item ' + (odd ? 'odd ' : '') + c, '##DivClass##');

      if (item.date)
        html = self.injectContent(html, item.date, '##Date##');
      else
        html = self.injectContent(html, '', '<h2 class="date"><a href="##Url##">##Date##</a></h2>');

      odd = !odd;
      return html;
    },

    /**
     * Populates results string
     * @param {String} count
     * @return null
     */
    populateResultsString: function(count) {
      $foundTerm.text(q);
      $foundCount.text(count);
      $foundContainer.show();
    }

  }; // return public interface

})();
