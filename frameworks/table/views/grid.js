sc_require('views/table_row')

// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================
/*globals SC Endash */

/**
  @class

  DataView handles the display of tableRow views.
  It extends CollectionFastPath to provide accelerated rendering.

  @extends SC.View
  @author Christopher Swasey
*/

/*globals Endash */

Endash.GridView = SC.CollectionView.extend(
  Endash.GridViewDelegate, 
  Endash.GridViewDataSource, 
  Endash.GridViewRenderEngine, {

  exampleView: Endash.GridCellView,
  
  delegate: null,
  
  getDelegate: function() {
    return this.get('delegate') || this;
  },
  
  /**
    The cell content view, which gets placed inside a cell
    and actually displays the contents for the cell
    @property {SC.View}
  */
  cellView: SC.LabelView.extend({
    isPoolable: YES,
    layerIsCacheable: YES,
    contentValueKeyBinding: '*column.key',
    
    contentValueKeyDidChange: function() {
      this.updatePropertyFromContent('value', '*', 'contentValueKey');
    }.observes('contentValueKey')
  }),

  /**
    @private
    Gets the cell content class for a given column, defaults to our
    cellContentView
  */
  cellViewForColumn: function(col) {
    var columns = this.get('columns'),
      column = columns.objectAt(col),
      ret;

    if(ret = column.get('exampleView')) return ret;

    return this.get('cellView');
  },
  
  cellsInRect: function(rect) {
    var rows = this.rowIndexesInRect(rect),
      columns = this.columnsIndexesInRect(rect);
    
    return rows.map(function(y){
      return columns.map(function(x) {
        return y + "," + x;
      }, this)
    }, this).flatten();
  },

});
