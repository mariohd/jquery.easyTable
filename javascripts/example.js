$(document).ready( function() {
  $('#fixateTableHeader').click( function () {
    goToTable();
    $('#easyTable-example').easyTable( 'fixedHead' );
  });

  $('#undoFixateTableHeader').click( function () {
    goToTable();
    $('#easyTable-example').easyTable( 'undoFixedHead' );
  });

  $('#addRowOnTable').click( function () {
    goToTable();
    tableDown();

    setTimeout(
      function ()
        {
          $('#easyTable-example').easyTable( 'addRow' ,{ columnsValues: ['You can', 'put some', 'HTML', 'Tags', '<input type="checkbox">' ]} );
          tableDown();
        },
    1500);
  });

  $('#removeRowFromTable').click( function () {
    goToTable();
    tableUp();
    setTimeout(
      function ()
        {
          $('#easyTable-example').easyTable( 'removeRow' ,{ indexes: [ 0, 1, 2 ] } );
        },
    1500);

  });

  $('#removeAllRowsFromTable').click( function () {
    goToTable();
    tableUp();
    setTimeout(
      function ()
        {
          $('#easyTable-example').easyTable( 'removeAllRows' );
        },
    1500);

  });

  $('#addWithEffect').click( function () {
    goToTable();
    tableDown();
    setTimeout(
      function ()
        {
          $('#easyTable-example').easyTable( 'addRow', { columnsValues: ['This row', 'will fade in', 'after', '5 seconds', 'with event call!'], animateAdd: function (table, tr) { tr.fadeIn(5000); } } );
          tableDown();
        },
    1500);

  });

  $('#removeWithEffect').click( function () {
    goToTable();
    tableUp();
    setTimeout(
      function ()
        {
          $('#easyTable-example').easyTable( 'removeRow', { indexes: [ 0, 1 ], beforeRemove: function () { alert('before remove!') }, afterRemove: function() { alert('and after remove!') }  } );
        },
    1500);

  });

  $('#removeAllWithEffect').click( function () {
    goToTable();
    tableUp();
    setTimeout(
      function ()
        {
          $('#easyTable-example').easyTable( 'removeAllRows', { afterRemoveAll: function(table) {  alert('table has now: '  + table.find('tbody tr').length  + ' rows') }  } );
        },
    1500);

  });

  $('#editRowContent').click( function () {
    goToTable();
    $('#easyTable-example').easyTable('editRowContent', { edit: true });
  });

});


function goToTable() {
  $("html, body").animate({
      scrollTop: $('#exampleTable').offset().top
  }, 1000);
}

function tableDown() {
  $("#scrollableDiv").animate({
      scrollTop: $('#easyTable-example').height()
  }, 1000);
}

function tableUp() {
  $("#scrollableDiv").animate({
      scrollTop: 0
  }, 1000);
}
