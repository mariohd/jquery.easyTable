jquery.easyTable
================

The intent of this plugin is to help the development while using tables.
Has some quicker solutions for some commons and tricky problems.
This plugin uses JQuery, one of the most important javascript`s library.

How does it work...
==============
This plugin don`t have any default action, so it will depend the parameter while calling the method.

The available actions are : `fixedHead`, `undoFixedHead`, `addRow`, `removeRow`, `removeAllRows`.

Some actions also need other parameters to do his jobs.
```
    Actions usage parameters
        ├── fixedHead
        ├── undoFixedHead
        ├── addRow
        |   ├── columnsValues
        │   ├── { columnsNames }  
        |   └── { columnsIDs }
        ├── removeRow
        │   └── indexes
        └── removeAllRows
```
Those with { paramenterName } are optional to the action.

How to Apply the plugin?
================

Import the JS file like any other else!
Just remember to put easyTable import after JQuery import ;)

```html
   <script type="text/javascript" src="jquery-1.11.1.js"></script>
    .
    .
   <script type="text/javascript" src="jquery.easyTable.js"></script>
```

Usage
==============

As any other JQuery plugin, just need and JQuery object and a method call!

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

This plugin still under development, any help will be welcome!
