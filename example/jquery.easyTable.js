
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

    function _resizeFixedHeader() {

        if ( $this.find("th").length > 0 ) {
            $headerFixed.find("th").each(function(index) {
                $(this).css("width", $this.find("th").eq(index).css('width'));
            });
        } else {
            $($this.find("tr")[0]).find("td").each(function(index) {
                $(this).css("width", $headerFixed.find("th").eq(index).css('width'));
            });
        }

        $this.find("thead").remove();
        $headerFixed.css('width', $this.width());
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
        body = $this.find('tbody');
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

    function _isFixedHeaded() {
        return ( $headerFixed.length > 0 );
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