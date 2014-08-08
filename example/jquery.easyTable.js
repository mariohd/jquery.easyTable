;(function($) {
  $.fn.easyTable = function( action , options ) {
    var opts = $.extend( {}, $.fn.easyTable.defaults, options );

    var $this = $(this);
    var $scrollableFather = $this.parents().filter( function() {
                  return $(this).css('overflow') == 'auto';
               });
    var $headerFixed = $("#" + $this.attr('id') + '-fixedClone');

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
          if (typeof opts.beforeAdd == 'function'){
            opts.beforeAdd.call( $this );
          }

          _addRow();
          if ( _isFixedHeaded() ) {
            _resizeFixedHeader();
          }

          if (typeof opts.afterAdd == 'function'){
            opts.afterAdd.call( $this, $tr );
          }

          break;

        case 'removeRow':
          if (typeof opts.beforeDelete == 'function'){
            opts.beforeDelete.call( $this );
          }

          opts.indexes.sort().reverse();
          opts.indexes.some( function ( value ) {
            $this.find('tbody tr')[value].remove();
          });

          if ( _isFixedHeaded() ) {
            _resizeFixedHeader();
          }

          if (typeof opts.afterDelete == 'function'){
            opts.afterDelete.call( $this );
          }

          break;

        case 'removeAllRows':
          if (typeof opts.beforeDeleteAll == 'function'){
            opts.beforeDeleteAll.call( $this );
          }

          $this.find('tbody tr').remove();

          if ( _isFixedHeaded() ) {
            _resizeFixedHeader();
          }

          if (typeof opts.afterDeleteAll == 'function'){
            opts.afterDeleteAll.call( $this );
          }

          break;
      }

    function _fixedHeader() {
        $scrollableFather.wrap('<div id="container-easyTable" />');
        $headerFixed = $this.clone();
        $headerFixed.attr('id', $headerFixed.attr('id') + '-fixedClone');
        $headerFixed.find("tbody").remove().end().addClass("fixedEasyTable").insertBefore($scrollableFather);
        _resizeFixedHeader();
    }

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
        $headerFixed.css('width', $this.width() - _getScrollbarWidth());
    }

    function _removeFixedHeader() {
    	var header = $headerFixed.find('thead');
        var body = $this.find('tbody');
        $scrollableFather.unwrap();
        header.find('th').each( function () {
            $(this).css('width', '');
        });
        header.insertBefore(body);
        $headerFixed.remove();
    }

  	function _getScrollbarWidth() {
  		if ( $this.height() > $scrollableFather.height() ) {
    		var outer = document.createElement("div");
    		outer.style.visibility = "hidden";
    		outer.style.width = "100px";
    		outer.style.msOverflowStyle = "scrollbar";

    		document.body.appendChild(outer);

    		var widthNoScroll = outer.offsetWidth;

    		outer.style.overflow = "scroll";

    		var inner = document.createElement("div");
    		inner.style.width = "100%";
    		outer.appendChild(inner);

    		var widthWithScroll = inner.offsetWidth;

    		outer.parentNode.removeChild(outer);

    		return widthNoScroll - widthWithScroll;
  	  }
  	  return 0;
  	}

    function _addRow() {
      $newRow = $('<tr>');

      opts.columnsValues.some( function ( columnValue, index ) {
        $td = $('<td>');
        $td.append(columnValue);
        $newRow.append($td);

        if ( typeof opts.columnsNames[index] != 'undefined' ) {
          $td.attr('name', opts.columnsNames[index]);
        }

        if ( typeof opts.columnsIDs[index] != 'undefined' ) {
          $td.attr('id', opts.columnsIDs[index]);
        }

      });

      if (typeof opts.animateAdd == 'function') {
          opts.animateAdd.call( 'undefined' , $this, $newRow );
      }

      $this.append($newRow);

      return $newRow;
    };

    function _isFixedHeaded() {
      return ( $headerFixed.length > 0 );
    }

    return this;
  };

  $.fn.easyTable.defaults = {
    indexes: [],
    columnsValues: [],
    columnsNames: [],
    columnsIDs: []
  };

})(jQuery);
