jquery.easyTable
================

The intent of this plugin is to help the development while using tables.
Has some quicker solutions for some commons and tricky problems.
This plugin uses JQuery, one of the most important javascript`s library.

Options !!
==============
This plugin is don`t have any default action, so it will depend the parameter while calling the method.

The available actions are : `fixedHead`, `undoFixedHeader`, `addRow`, `removeRow`, `removeAllRows`.

Some actions, need other parameters to do his jobs.
```
    Actions usage parameters
        ├── fixedHead
        ├── undoFixedHeader
        ├── addRow
        |   ├── columnsValues
        │   ├── { columnsNames }  
        |   └── { columnsIDs }
        ├── removeRow
        │   └── indexes
        └── removeAllRows
```

How to Apply the plugin?
================

Just import the JS file like any other else!
Just remember to put easyTable import after JQuery import ;)

```html
   <script type="text/javascript" src="jquery-1.11.1.js"></script>
    .
    .
   <script type="text/javascript" src="jquery.easyTable.js"></script>
```

Usage
==============

Just like any other JQuery plugin, just need and JQuery object and a method call!

```html
    // To fixed header of a table.
    $('#easyTable-example').easyTable( 'fixedHead' );  

    //Adding a row.
    $('#easyTable-example').easyTable('addRow', { columnsValues: ["first", "...", "N columns" ] } );

    //Remove some rows.
    $('#easyTable-example').easyTable( 'removeRow', { indexes: [ 0, 2, 4, 6 ] } );  

    //Remove entire content.
     $('#easyTable-example').easyTable( 'removeAllRows' );  

```

This plugin still under development, any help is welcome!
