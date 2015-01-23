jquery.easyTable
================

The intent of this plugin is to help the development while using tables.
It has some quicker solutions for some commons and tricky problems.
This plugin uses jQuery, one of the most important JavaScript library.

Check out the live demo on [plugin's page](http://mariohd.github.io/jquery.easyTable/ "Title").

How does it work...
==============
This plugin doesn't have any default action, so it will depend on the parameter passed while calling the method.

The available actions are : `fixedHead`, `undoFixedHead`, `addRow`, `editRowContent`, `removeRow`, `removeAllRows`, `sort`.

Some actions also need other parameters to do his jobs.
```
        Action
          └── parameters

          ├── fixedHead
          ├── undoFixedHead
          ├── addRow
          |   ├── values
          │   ├── { names }
          |   └── { ids }
          ├── editRowContent
          ├── removeRow
          │   └── indexes
          ├── removeAllRows
          └── sort
              ├── column
              ├── { from }
              ├── { to }
              └── { orderBy }

```

How to Apply the plugin?
================

Import the JS file like any other else!
Just remember to put the easyTable import after the jQuery import ;)

```html
   <script type="text/javascript" src="jquery-1.11.1.min.js"></script>
    .
    .
   <script type="text/javascript" src="jquery.easyTable.js"></script>
```

Usage
==============

As any other jQuery plugin, it just needs a jQuery object and a method call!

```html
    // To fix the header of a table.
    $('#easyTable-example').easyTable( 'fixedHead' );  

    // Adding a row.
    $('#easyTable-example').easyTable('addRow', { columnsValues: ["first", "...", "N columns" ] } );

    // Remove some rows.
    $('#easyTable-example').easyTable( 'removeRow', { indexes: [ 0, 2, 4, 6 ] } );  

    // Remove entire content.
     $('#easyTable-example').easyTable( 'removeAllRows' );  

```

This plugin is still under development, any help will be appreciated!
