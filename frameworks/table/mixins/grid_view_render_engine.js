Endash.GridViewRenderEngine = {
  isGridViewRenderEngine: YES,

  layoutForCell: function(row, column) {
    return {
      top: this.offsetForRow(row),
      height: this.heightForRow(row),
      left: this.offsetForColumn(column),
      width: this.widthForColumn(column)
    };
  },
  
  widthForColumn: function(idx) {
    var columns = this.get('columns'),
      column = columns.objectAt(idx);
    
    return column.get('width')
  },

  offsetForColumn: function(idx) {
    var cache = this._offsetCacheCol;
    if (!cache) {
      cache = this._offsetCacheCol = [];
    }
  
    if(SC.none(cache[idx])) {
      if(idx > 0) {
        cache[idx] = this.offsetForColumn(idx - 1) + this.widthForColumn(idx - 1);
      } else {
        cache[idx] = this.startOffset || 0;
      }
    }

    return cache[idx] + (this.offsetDelta || 0);
  },
  
  heightForRow: function(idx) {
    return this.get('rowHeight')
  },
  
  offsetForRow: function(idx) {
    var cache = this._offsetCacheRow;
    if (!cache) {
      cache = this._offsetCacheRow = [];
    }
  
    if(SC.none(cache[idx])) {
      if(idx > 0) {
        cache[idx] = this.offsetForRow(idx - 1) + this.heightForRow(idx - 1);
      } else {
        cache[idx] = this.startOffset || 0;
      }
    }

    return cache[idx] + (this.offsetDelta || 0);
  },



  allRowIndexes: function() {
    return SC.IndexSet.create(0, this.get('numRows'));
  }.property('numRows'),


  rowIndexesInRect: function(rect) {
    return this.get('allRowIndexes');
  },
  
  columnIndexesInRect: function(rect) {
    return null;
    return SC.IndexSet.create(0, this.get('columns').get('length'));
  },

  allCells: function(rect) {
    var rows = this.allContentIndexes(),
      columns = SC.IndexSet.create(0, this.get('columns').get('length'));
    
    return rows.map(function(y){
      return columns.map(function(x) {
        return y + "," + x;
      }, this)
    }, this).flatten();
  }.property().cacheable(),

  cellsInRect: function(rect) {
    return null;
  },
   
  computeNowShowing: function() {
    var r = this.cellsInRect(this.get('clippingFrame'));
    if (!r) r = this.get('allCells'); // default show all

    return r ;
  },
  
  _cv_nowShowingDidChange: function() {
    var nowShowing  = this.get('nowShowing'),
        last        = this._sccv_lastNowShowing,
        diff, diff1, diff2;

    // find the differences between the two
    // NOTE: reuse a TMP IndexSet object to avoid creating lots of objects
    // during scrolling
    if (last !== nowShowing) {
      if (last && nowShowing) {
        diff1 = this._TMP_DIFF1.add(last).remove(nowShowing);
        diff2 = this._TMP_DIFF2.add(nowShowing).remove(last);
        diff = diff1.add(diff2);
      } else diff = last || nowShowing ;
    }

    // if nowShowing has actually changed, then update
    if (diff && diff.get('length') > 0) {
      this._sccv_lastNowShowing = nowShowing ? nowShowing.frozenCopy() : null;
      this.updateContentRangeObserver();
      this.reload(diff);
    }
    
    // cleanup tmp objects
    if (diff1) diff1.clear();
    if (diff2) diff2.clear();
    
  }.observes('nowShowing'),
};