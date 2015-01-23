/*globals HTMLCollection, jQuery*/
(function ($) {
  "use strict";
  [HTMLCollection, NodeList].forEach(function (collection) {
    collection.prototype.toArray = function () {
      return Array.prototype.slice.call(this);
    };
  });

  $.fn.easyTable = function ( action, options ) {
    var opts = $.extend( {}, $.fn.easyTable.defaults, options ),
    element = this.get(0),
    dummyTable = document.getElementById(element.id + "-fixed"),
    thead = element.tHead || dummyTable.tHead,
    headers = thead.rows.item(0).cells,
    tbody = element.tBodies.item(0),
    rows = tbody.rows;

    function _fixTableHeader() {
      if (! dummyTable) {
        element.removeChild(thead);
        dummyTable = element.cloneNode(true);
        dummyTable.appendChild(thead);
        dummyTable.removeChild(dummyTable.tBodies.item(0));
        dummyTable.id += "-fixed";
        dummyTable.style.width = element.offsetWidth + 'px';
        element.parentNode.parentNode.insertBefore(dummyTable, element.parentNode);
        _fixColumnsWidths();
      }
    }

    function _unfixTableHeader() {
      if (dummyTable) {
        var Aheaders = headers.toArray();
        for (var index in Aheaders) {
          if (Aheaders.hasOwnProperty(index)) {
            Aheaders[index].style.width = rows[0].cells[index].style.width =  "";
          }
        }
        element.insertBefore(thead, tbody);
        dummyTable.parentNode.removeChild(dummyTable);
      }
    }

    function _fixColumnsWidths() {
      if(dummyTable) {
        var fisrtRow = rows[0],
        fisrtLineData = fisrtRow.cells,
        AHeaders = headers.toArray(),
        pWidth;
        for (var index in AHeaders ) {
          if (AHeaders.hasOwnProperty(index)) {
            pWidth = (fisrtLineData[index].offsetWidth/tbody.offsetWidth) * 100 + '%';
            AHeaders[index].style.width = pWidth;
            rows[0].cells[index].style.width = pWidth;
          }
        }
      }
    }

    function _addNewRow() {
      if (opts.beforeAdd) {
        opts.beforeAdd($(element), undefined);
      }

      var newRow = document.createElement('tr'),
      contents = opts.contents || opts.columnsValues,
      ids = opts.ids || opts.columnsIDs,
      names = opts.names || opts.ColumnsNames,
      td;
      contents.forEach(function (value, index) {
        td = document.createElement('td');
        td.innerHTML = value;
        if (ids && ids[index]) {
          td.id = ids[index];
        }
        if (names && names[index]) {
          td.setAttribute('name', names[index]);
        }
        newRow.appendChild(td);
      });

      if (opts.animateAdd) {
        opts.animateAdd($(element), $(newRow));
      }

      tbody.appendChild(newRow);

      if (opts.afterAdd) {
        opts.afterAdd($(element), $(newRow));
      }
    }

    function _toogleEditContent() {
      $.fn.easyTable.defaults.edit = ! $.fn.easyTable.defaults.edit;
      if ($.fn.easyTable.defaults.edit) {
        rows.toArray().forEach(function (row) {
          row.getElementsByTagName('td').toArray().forEach( function (data) {
            data.ondblclick  = _editContent;
          });
        });
      } else {
        rows.toArray().forEach(function (row) {
          row.getElementsByTagName('td').toArray().forEach( function (data) {
            data.ondblclick  = undefined;
          });
        });
      }
    }

    function _editContent() {
      /*jshint validthis: true */
      var textArea = document.createElement('textarea');
      textArea.value = this.innerHTML;
      textArea.style.width = this.style.width + 'px';
      textArea.style.height = this.style.height + 'px';
      textArea.style.resize = 'none';
      textArea.onblur = _removeTextArea;
      this.innerHTML = "";
      this.ondblclick = undefined;
      this.appendChild(textArea);
      _fixColumnsWidths();
    }

    function _removeTextArea() {
      /*jshint validthis: true */
      var parentNode = this.parentNode;
      this.parentNode.removeChild(this);
      parentNode.innerHTML = this.value;
      parentNode.ondblclick = _editContent;
      _fixColumnsWidths();
    }

    function _removeRow() {
      if (opts.beforeRemove) {
        opts.beforeRemove($(element));
      }

      if (opts.indexes) {
        opts.indexes.sort(function (a, b) {
          return Number(a) - Number(b);
        }).reverse();
        opts.indexes.forEach(function (index) {
          tbody.deleteRow(index);
        });
      }

      if (opts.afterRemove) {
        opts.afterRemove($(element));
      }
    }

    function _removeAllRows() {
      if (opts.beforeRemoveAll) {
        opts.beforeRemoveAll($(element));
      }

      opts.indexes = [];
      for (var index = 0; index < rows.length ; index++) {
        opts.indexes.push(index);
      }
      _removeRow();

      if (opts.afterRemoveAll) {
        opts.afterRemoveAll($(element));
      }
    }

    function _sortByColumn() {
      if (opts.column === 0 || opts.column) {
        var ordered = rows.toArray().sort(function(a, b) {
          var A = a.cells.item(opts.column).innerHTML,
          B = b.cells.item(opts.column).innerHTML;
          if (opts.from) {
            A = A.replace(opts.from, opts.to);
            B = B.replace(opts.from, opts.to);
          }
          return opts.order === 'asc' ? smartSort(A, B) : smartSort(B, A);
        }),
        row;
        while (row = rows.toArray().shift()) {
          tbody.removeChild(row);
        }
        while ( row = ordered.shift()) {
          tbody.appendChild(row);
        }
      }
    }

    function smartSort(A, B) {
      if ( isNaN(A) || isNaN(B) ) {
        return A.localeCompare(B);
      } else {
        return Number(A) - Number(B);
      }
    }

    switch ( action ) {
      case 'fixedHead':
        _fixTableHeader();
        break;

      case 'undoFixedHead':
        _unfixTableHeader();
        break;

      case 'addRow':
        _addNewRow();
        break;

      case 'edit':
      case 'editRowContent':
        _toogleEditContent();
        break;

      case 'removeRow':
        _removeRow();
        _fixColumnsWidths();
        break;

      case 'removeAllRows':
        _removeAllRows();
        _fixColumnsWidths();
        break;

      case 'sort':
        _sortByColumn();
        break;
      }

      return this;
    };

    $.fn.easyTable.defaults = {
      indexes: null,
      content: null,
      names: null,
      ids: null,
      edit: false,
      column: null,
      from: null,
      to: '',
      order: 'asc'
    };

  })(jQuery);
