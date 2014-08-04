;(function($) {
  $.fn.easyTable = function( options ) {
    var $this = $(this);
    var opts = $.extend( {}, $.fn.easyTable.defaults, options );
	  var scrollableFather = $this.parents().filter( function() {
                  return $(this).css('overflow-y') == 'auto';
               });

    opts.actions.some( function ( action ) {
        if ( action == 'fixedHead' ) {
          var	$t_fixed;
          _fixedHeader();
          _resizeFixedHeader();
          $(window).resize(_resizeFixedHeader);
        }

        if ( action == 'addRow' ) {
          if (typeof opts.beforeAdd == 'function'){
            opts.beforeAdd.call( $this );
          }

          var $tr = _addRow();

          if (typeof opts.afterAdd == 'function'){
            opts.afterAdd.call( $this, $tr );
          }
        }

        if ( action == 'removeRow' ) {
          if (typeof opts.beforeDelete == 'function'){
            opts.beforeDelete.call( $this );
          }

          opts.indexes.sort().reverse();
          opts.indexes.some( function ( value ) {
            $this.find('tbody tr')[value].remove();
          });

          if (typeof opts.afterDelete == 'function'){
            opts.afterDelete.call( $this );
          }
        }

        if ( action == 'removeAllRows' ) {
          if (typeof opts.beforeDeleteAll == 'function'){
            opts.beforeDeleteAll.call( $this );
          }

          $this.find('tbody tr').remove();

          if (typeof opts.afterDeleteAll == 'function'){
            opts.afterDeleteAll.call( $this );
          }
        }

    });

    function _fixedHeader() {
        scrollableFather.wrap('<div id="container-easyTable" />');
        $t_fixed = $this.clone();
        $t_fixed.attr('id', $t_fixed.attr('id') + '-fixedClone');
        $t_fixed.find("tbody").remove().end().addClass("fixedEasyTable").insertBefore(scrollableFather);
        _resizeFixedHeader();
    }

    function _resizeFixedHeader() {
        $t_fixed.find("th").each(function(index) {
          $(this).css("width",$this.find("th").eq(index).css('width'));
        });

        $t_fixed.css('margin-left', $this.css('margin-left'));
        $t_fixed.css('margin-right', $this.css('margin-right'));
    		$t_fixed.css('width', scrollableFather.width() - getScrollbarWidth());
    		$this.find("thead").remove();
    		$this.find("tr").first().children().each( function (index) {
    			$(this).css("width", $t_fixed.find("th").eq(index).css('width'));
    		});
    }

  	function getScrollbarWidth() {
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

    function _scrollFixedHeader() {
        $t_fixed.show();
    }

    function _addRow() {
      $newRow = $('<tr>');

      opts.columnsValues.some( function ( columnValue, index ) {
        $td = $('<td>');
        $td.append(columnValue);
        $newRow.append($td);

        if ( typeof opts.columnsNames[index] != 'undefined' ) {
          $input.attr('name', columnsNames[index]);
        }

        if ( typeof opts.columnsIDs[index] != 'undefined' ) {
          $input.attr('id', columnsIDs[index]);
        }

      });

      if (typeof opts.animateAdd == 'function') {
          opts.animateAdd.call( 'undefined' , $this, $newRow );
      }

      $this.append($newRow);

      return $newRow;
    };

    return this;
  };

  $.fn.easyTable.defaults = {
    indexes: [],
    actions: [],
    columnsValues: [],
    columnsNames: [],
    columnsIDs: []
  };

})(jQuery);
