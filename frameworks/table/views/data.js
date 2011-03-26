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

Endash.DataView = SC.ListView.extend(Endash.CollectionFastPath, SC.DataViewDelegate, {
  /**
    TableRow
    @property {SC.View}
  */
  exampleView: Endash.TableCellView,,
  
  
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
  
  
  
  // delegate methods
  

  layoutCell: function(row, cellIdx) {
    var cells = this.get('cells')[row],
      cell = cells.objectAt(cellIdx),
      layer = cell.get('layer'),
      layout = this.getDelegate().layoutForCell(row, cellIdx);
      
    this._repositionView(layer, layout);
  },
  
  layoutForCell: function(row, cellIdx) {
    var columns = this.get('columns'),
    
  },
  
  widthForCell: function(idx) {
    var columns = this.get('columns'),
      column = columns.objectAt(idx);
      
    return column.get('width')
  }
  
  offsetForCell: function(idx) {
    var cache = this._offsetCache;
    if (!cache) {
      cache = this._offsetCache = [];
    }
    
    if(SC.none(this._offsetCache[idx])) {
      if(idx > 0) {
        this._offsetCache[idx] = this.offsetForCell(idx - 1) + this.getDelegate().widthForCell(idx - 1);
      } else {
        this._offsetCache[idx] = this.startOffset || 0;
      }
    }
  
    return this._offsetCache[idx] + (this.offsetDelta || 0);
  },




  /**
    @private
    Sends a view to a DOM pool.
  */
  sendToDOMPool: function(view) {
    var pool = this.domPoolForExampleView(view.createdFromExampleView);
    pool.push(view);
    var f = view.get("frame");
    
    this._repositionView(view.get('layer'), {top: -(f.height + 2)});
    
    view.set("layerId", SC.guidFor(view));
    if (view.sleepInDOMPool) view.sleepInDOMPool();
  },
  
  contentIndexesInRect: function(rect) {
    var contentIndexes = sc_super(),
      columns = this.get('columns');
      
    return contentIndexes.map(function(y){
      return columns.map(function(x) {
        return y + "," + x;
      }, this)
    }, this).flatten();
  }
  

});
