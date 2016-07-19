---
title:        'Feature requests'
description:  'Complete list of all the user requested features'

author: jbrazio
category: [ development ]
---

## About

The following table contains the list of user requested features for Marlin which haven't yet been merged into Marlin, each feature will have an associated [Github Issue](https://github.com/MarlinFirmware/Marlin/issues).

The list can be [edited here](https://docs.google.com/spreadsheets/d/1mVTZnJbekS2tJtcfQ3mnHGtBHukd76AohlemK8Za8Ig/edit#gid=0).


## How to submit

To submit a feature you must be a Github [registered user](https://github.com/join) and open a [new issue](https://github.com/MarlinFirmware/Marlin/issues/new) following a few simple rules:

 - The issue title should start by **'[Feature Request]'** or it's short form **'[FR]'**
 - The title should be short and clear about your request
 - You should provide all the relevant information

We consider a good example of a feature request title:

 > [FR] Add support for ACME Stepper Driver

## Feature request list

<table id="fr_list" class="table table-condensed table-striped"></table>
<script type="text/javascript">
  head.ready("sheetrock.min.js", function() {
    $('#fr_list').sheetrock({
      url: "https://docs.google.com/spreadsheets/d/" +
        "1mVTZnJbekS2tJtcfQ3mnHGtBHukd76AohlemK8Za8Ig#gid=0",
        query: "SELECT A, B, C, D, G WHERE C != 'Implemented' ORDER BY A DESC",
        rowTemplate: function(row) {
          var html = '<tr>';
          switch(row['num']) {
            case 0:
              for (var col = 0; col < row['labels'].length; col++) {
                html += '<th>';
                html += row['labels'][col];
                html += '</th>'
              }
              break;

            default:
              for (var col = 0; col < row['cellsArray'].length; col++) {
                html += '<td>';
                if (row['labels'][col] == 'Issue') {
                  html += '<a href="';
                  html += 'https://github.com/MarlinFirmware/Marlin/issues/'
                    + row['cellsArray'][col];
                  html += '">';
                  html += row['cellsArray'][col];
                  html += '</a>';
                } else html += row['cellsArray'][col];
                html += '</td>'
              }
          }
          html += '</tr>'
          return html;
        }
    });
  });
</script>
