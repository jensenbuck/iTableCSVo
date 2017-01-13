
jQuery.fn.iTableCSVo = function(props) {

  // ensure props is a valid object
  if(props == null || typeof props != 'object' || isArray(props)) {
    props = {};
  }

  // validate header
  if(!props.hasOwnProperty('header') ||
    props['header'] == null || !isArray(props['header'])) {
    props['header'] = [];
  }

  var columnHeaders = props['header'];
  var rows = [];
  var row = [];

  // here we are mapping the column number and header values
  var trueHeaderMap = [];
  var counter = 0;
  $(this).filter(':visible').find('th').each(function() {
    if ($(this).css('display') != 'none') {
      trueHeaderMap[trueHeaderMap.length] = [counter++,stripHTML($(this).html())];
    }
  });

  // filter the headers to only columns we are looking for
  var filteredHeaderMap = [];
  if(columnHeaders.length > 0) {
    for(var i=0; i<columnHeaders.length; i++) {
      var col = stripHTML(columnHeaders[i]);
      for(var j=0; j<trueHeaderMap.length; j++) {
        if(col == trueHeaderMap[j][1]) {
          filteredHeaderMap[filteredHeaderMap.length] = [j, col];
        }
      }
    }
  } else {
    filteredHeaderMap = trueHeaderMap;
  }

  // convert the header to initial csv row
  for(var i=0; i<filteredHeaderMap.length; i++) {
    row[row.length] = filteredHeaderMap[i][1];
  }

  convertToCSVRow(row);

  // convert table body to csv rows
  var bodyRows = $(this).find('tr');
  for(var i=1; i<bodyRows.length; i++) {
    var bodyRow = bodyRows[i];
    row = [];
    var cols = bodyRow.cells;

    for(var j=0; j<filteredHeaderMap.length; j++) {
      var col = cols[filteredHeaderMap[j][0]];
      if($(col).css('display') != 'none') {
        row[row.length] = stripHTML($(col).html());
      }
    }

    convertToCSVRow(row);
  }

  exportCSV(encodeURIComponent(rows.join('\n')));
  return true;

  function convertToCSVRow(tmp) {
      if (tmp.length > 0 && tmp.join('') != '') {
          rows[rows.length] = tmp.join(',');
      }
  }

  function stripHTML(input) {
    var replaceMap = [[/&amp;/g, '&'], [/&lt;/g, '<'], [/&gt;/g, '>'],
      [/&quot;/g, '"'], [/["]/g, '“'], [/<br[^>]*>/g, '\n'], [/\<[^\<]+\>/g, ''],
      [/&#x2F;/g, '/'], [/&#39;/g, "'"]];

    for(var e in replaceMap) {
      input = input.replace(replaceMap[e][0], replaceMap[e][1]);
    }

    if(input == '') {
      return '';
    }

    return '"' + input.trim() + '"';
  }

  function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  }

  function exportCSV(encodedData) {
    var link = document.createElement("a");
    link.download = 'export.csv';
    link.href = 'data:text/csv;charset=utf8,' + encodedData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
  }

};
