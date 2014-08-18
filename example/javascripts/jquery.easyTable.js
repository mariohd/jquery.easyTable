
(function ($) {
    "use strict";
    $.fn.easyTable = function( action , options ) {
    var opts = $.extend( {}, $.fn.easyTable.defaults, options ),
    $this = $(this),
    $scrollableFather = $this.parents().filter( function() {
        return $(this).css('overflow') === 'auto';
    }),
    $headerFixed = $("#" + $this.attr('id') + '-fixedClone'),
    $tr;

    function _getScrollbarWidth() {
       if ( $this.height() > $scrollableFather.height() ) {
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
           return widthNoScroll widthWithScroll;
       }
       return 0;
   }

    function _isFixedHeaded() {
        return ( $headerFixed.length > 0 );
    }

    function smartSort(A, B) {
      if ( isNaN(A) || isNaN(B) ) {

        if( A  < B ) {
          return -1;
        }

        if( A > B ) {
          return 1;
        }
      } else {

        if(Number(A) < Number(B)) {
          return -1;
        }

        if(Number(A) > Number(B)) {
          return 1;
        }
      }
      return 0;
    }

    function sortTableBy( columnIndex ) {
      var rows = $this.find('tbody tr');

      rows.sort(function(a, b) {

        var A = $(a).children('td').eq(columnIndex).text().toUpperCase(),
            B = $(b).children('td').eq(columnIndex).text().toUpperCase();

        return smartSort(A, B);

      });

      $this.find('tbody tr').remove();
      $this.find('tbody').append(rows);

      if ( _isFixedHeaded() ) {
        $headerFixed.find('#arrowUp-sortingBy').remove();
        $headerFixed.find('thead th').eq(columnIndex).append(_getArrowUp());
      } else {
        $this.find('#arrowUp-sortingBy').remove();
        $this.find('thead th').eq(columnIndex).append(_getArrowUp());
      }
    }

    function _resizeFixedHeader() {
    	$headerFixed.css('width', $scrollableFather.width() - _getScrollbarWidth());
        if ( $this.find("th").length > 0 ) {
        	var olderHeader = $this.find("th");

           $headerFixed.find('th').each( function (index) {
        	   $(this).css('width', $(olderHeader[index]).css('width'));
           });

           $this.find("thead").remove();
        }

        var rows = $this.children('tbody').children('tr'),
        easyTableHeaders = $headerFixed.find('th');

	    $(rows).each( function () {
	 	   $(this).children('td').each( function (index) {
	 		   $(this).css('width', $(easyTableHeaders[index]).css('width'));
	 	   });
	    });
    }

    function _fixedHeader() {
        $scrollableFather.wrap('<div id="container-easyTable" />');
        $headerFixed = $this.clone();
        $headerFixed.attr('id', $headerFixed.attr('id') + '-fixedClone');
        $headerFixed.find("tbody").remove().end().addClass("fixedEasyTable").insertBefore($scrollableFather);
        _resizeFixedHeader();
    }

    function _removeFixedHeader() {
        var header = $headerFixed.find('thead'),
        body = $this.children('tbody');
        $scrollableFather.unwrap();
        header.find('th').each( function () {
            $(this).css('width', '');
        });
        header.insertBefore(body);
        $headerFixed.remove();
    }



    function _addRow() {
        var $newRow = $('<tr>');

        opts.columnsValues.some( function ( columnValue, index ) {
            var $td = $('<td>');
            $td.append(columnValue);
            $newRow.append($td);

            if ( opts.columnsNames[index] !== undefined ) {
              $td.attr('name', opts.columnsNames[index]);
            }

            if ( opts.columnsIDs[index] !== undefined ) {
              $td.attr('id', opts.columnsIDs[index]);
            }
        });

        if (typeof opts.animateAdd === 'function') {
          opts.animateAdd.call( 'undefined' , $this, $newRow );
        }

        $this.append($newRow);

        return $newRow;
    }

    function _editRowContent() {
        var $row = $(this),
            $textArea = $('<textarea>');
        $textArea.val( $(this).html() );
        $row.empty();
        $textArea.css('width', $row.width());
        $textArea.css('height', $row.height());
        $textArea.css('resize', 'none');
        $row.append($textArea);
        $row.off();
        $textArea.focus();
        $textArea.focusout( function () {
          $row.html( $(this).val() );
          $row.dblclick(_editRowContent);

          if ( _isFixedHeaded() ) {
              _resizeFixedHeader();
          }

        });
    };

    function _getArrowUp() {
      var $div = $('<div>');
      $div.css('width', 0);
      $div.css('height', 0);
      $div.css('border-left', '8px solid transparent');
      $div.css('border-right', '8px solid transparent');
      $div.css('border-bottom', '8px solid');
      $div.css('float', 'right');
      $div.attr('id', 'arrowUp-sortingBy');
      return $div;
    }

    switch ( action ) {

        case 'fixedHead':
            if ( ! _isFixedHeaded() ){
                _fixedHeader();
                $(window).resize(_resizeFixedHeader);
            }
        break;

        case 'undoFixedHead':
            if ( _isFixedHeaded() ){
                _removeFixedHeader();
                $(window).unbind('resize');
            }
        break;

        case 'addRow':
            if (typeof opts.beforeAdd === 'function'){
                opts.beforeAdd.call( $this );
            }

            $tr = _addRow();
            if ( _isFixedHeaded() ) {
                _resizeFixedHeader();
            }

            if (typeof opts.afterAdd === 'function'){
                opts.afterAdd.call( $this, $tr );
            }

        break;

        case 'removeRow':
            if (typeof opts.beforeRemove === 'function'){
                opts.beforeRemove.call( 'undefined', $this );
            }

            opts.indexes.sort().reverse();
            opts.indexes.some( function ( value ) {
                $this.find('tbody tr')[value].remove();
            });

            if ( _isFixedHeaded() ) {
                _resizeFixedHeader();
            }

            if (typeof opts.afterRemove === 'function'){
                opts.afterRemove.call('undefined', $this );
            }

        break;

        case 'removeAllRows':
            if (typeof opts.beforeRemoveAll === 'function'){
                opts.beforeRemoveAll.call( 'undefined', $this );
            }

            $this.find('tbody tr').remove();

            if ( _isFixedHeaded() ) {
                _resizeFixedHeader();
            }

            if (typeof opts.afterRemoveAll === 'function'){
                opts.afterRemoveAll.call( 'undefined', $this );
            }

        break;

        case 'editRowContent':

          if ( opts.edit === true ) {
              $this.find('td').each(function () {
                  $(this).dblclick(_editRowContent);
              });
          } else {
            $this.find('td').each(function () {
                $(this).off();
            });
          }
        break;

        case 'sort':
            sortTableBy(opts.column);
        break;
    }

    return this;
  };

  $.fn.easyTable.defaults = {
    indexes: [],
    columnsValues: [],
    columnsNames: [],
    columnsIDs: []
  };

}(jQuery));
