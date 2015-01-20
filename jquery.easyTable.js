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
    thead = element.getElementsByTagName('thead').item(0) || dummyTable.getElementsByTagName('thead').item(0),
    headers = thead.getElementsByTagName('th'),
    tbody = element.getElementsByTagName('tbody').item(0),
    rows = tbody.getElementsByTagName('tr');

    function _fixTableHeader() {
      if (! dummyTable) {
        element.removeChild(thead);
        dummyTable = element.cloneNode(true);
        dummyTable.appendChild(thead);
        dummyTable.removeChild(dummyTable.getElementsByTagName('tbody').item(0));
        dummyTable.id = dummyTable.id + "-fixed";
        element.parentNode.parentNode.insertBefore(dummyTable, element.parentNode);
        _fixColumnsWidths();
      }
    }

    function _unfixTableHeader() {
      if (dummyTable) {
        var Aheaders = headers.toArray();
        for (var index in Aheaders) {
          if (Aheaders.hasOwnProperty(index)) {
            Aheaders[index].style.width = "";
            Aheaders[index].style.width = "";
          }
        }
        element.insertBefore(thead, tbody);
        dummyTable.parentNode.removeChild(dummyTable);
      }
    }

    function _fixColumnsWidths() {
      var fisrtRow = rows.toArray()[0],
      fisrtLineData = fisrtRow.getElementsByTagName('td').toArray(),
      AHeaders = headers.toArray();
      for (var index in AHeaders ) {
        if (AHeaders.hasOwnProperty(index)) {
          AHeaders[index].style.width = fisrtLineData[index].offsetWidth + 'px';
        }
      }
      AHeaders[index].style.width = fisrtLineData[index].offsetWidth + _scrollbarWidth() + 'px';
    }

    function _scrollbarWidth() {
      var outer = document.createElement("div"),
      widthNoScroll,
      inner,
      widthWithScroll;
      outer.style.visibility = "hidden";
      outer.style.width = "100px";
      outer.style.msOverflowStyle = "scrollbar";
      document.body.appendChild(outer);
      widthNoScroll = outer.offsetWidth;
      outer.style.overflow = "scroll";
      inner = document.createElement("div");
      inner.style.width = "100%";
      outer.appendChild(inner);
      widthWithScroll = inner.offsetWidth;
      outer.parentNode.removeChild(outer);
      return widthNoScroll - widthWithScroll;
    }

    function _addNewRow() {
      var newRow = document.createElement('tr'),
      values = opts.values || opts.columnsValues,
      ids = opts.ids || opts.columnsIDs,
      names = opts.names || opts.ColumnsNames,
      td;
      values.forEach(function (value, index) {
        td = document.createElement('td');
        td.innerHTML = value;
        if (ids && ids[index]) {
          td.id = ids[index];
        }
        if (names && names[index]) {
          td.setAttribute('name',names[index]);
        }
        newRow.appendChild(td);
      });
      tbody.appendChild(newRow);
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
            }
            return this;
          };

          $.fn.easyTable.defaults = {
            indexes: null,
            values: null,
            names: null,
            ids: null,
            edit: false
          };

        })(jQuery);
