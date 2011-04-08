Endash.TableRowBlock = SC.View.extend({
  
  exampleView: Endash.TableRowView,
  
  range: null,
  
  columns: null,
  columnsBindingDefault: SC.Binding.multiple(),
  
  content: null,
  contentBindingDefault: SC.Binding.multiple(),
  
  rowHeight: 18,
  rowHeightBindingDefault: SC.Binding.single(),
  
  rowSpacing: 1,
  rowSpacingBindingDefault: SC.Binding.single(),
  
  init: function() {
    this.createRows();
    sc_super();
  },
  
  renderLayout: function(context, firstTime) {
    if(firstTime) {
      return sc_super();
    }
  },
  
  rangeDidChange: function() {
    this.redraw(this.get('position'));
  }.observes('range'),
  
  _block_contentDidChange: function() {
    this.redraw(this.get('position'));
  }.observes('content'),

  redraw: function(idx, len) {
    var range = this.get('range'),
      content = this.get('content');

    if(!content || !range || content.get('length') === 0) return;
      
    var rows = this.get('rows'),
      len = range.get('length'),
      row, item, i, j, rIdx, attrs;
      
    if(idx == -1) {
      if(!rows || rows.get('length') < range.get('length')) {
        idx = 0;
      } else {
        idx = rows.get('length') - range.get('length');
      }
    }
    
    range = range.toArray();  
      
    for(i = 0, j = idx; i < len; i++, j++) {
      rIdx = range.objectAt(i);
      item = content.objectAt(rIdx);
      row = rows.objectAt(j)
      if(!row) row = this.addRow();

      this.configureRow(row, rIdx, item, attrs);
    }
  },
  
  createRows: function() {
    var height = this.get('frame').height,
      total = 0
      
    this.set('rows', [])
      
    while(total < height) {
      this.addRowView();
      total += rowHeight + rowSpacing;
    }
  },
  
  addRow: function() {
    var rows = this.get('rows'),
      view;
  
    if(!rows) this.set('rows', (rows = []));
          
    view = SC.TableRowView.create({
      idx: rows.get('length')
    });

    rows.push(view)
    this.appendChild(view);
    
    return view;
  },
  
  
  // columnsDidChange: function() {
  //   this.widthsDidChange(null, '[]', 0, YES);
  // }.observes('*columns.[]'),
  //   
  // widthsDidChange: function(object, key, value, force) {
  //   return;
  //   var columns = this.get('columns'),
  //     width = columns.get('@sum(width)'),
  //     nowShowing = this.get('nowShowing'),
  //     view, idx;
  //   
  //   if(width == this._width && !force) return;
  //   this._width = width;
  // 
  //   if(key == '[]') {
  //     idx = 0;<endash>
  //   } else {
  //     idx = columns.indexOf(object);
  //   }
  //   
  //   nowShowing.forEach(function(idx2) {
  //     view = this.itemViewForContentIndex(idx2);
  //     view.widthDidChangeForIndex(idx);
  //   }, this);
  //   
  // },

  configureRow: function(row, index, item, attrs) {
    
    var layout = this.get('parentView').layoutForContentIndex(index);
    
    row.beginPropertyChanges();
    row.set('content', item);
    row.set('contentIndex', index);
    row.set('parentView', this);
    delete layout['top'];
    row.set('layout', layout)
    // itemView.setIfChanged('layerId', attrs.layerId);
  //   itemView.setIfChanged('isEnabled', attrs.isEnabled);
  //   itemView.setIfChanged('isSelected', attrs.isSelected);
  //   itemView.setIfChanged('outlineLevel', attrs.outlineLevel);
  //   itemView.setIfChanged('disclosureState', attrs.disclosureState);
  //   itemView.setIfChanged('isVisibleInWindow', attrs.isVisibleInWindow);
  //   itemView.setIfChanged('isGroupView', attrs.isGroupView);
  //   itemView.setIfChanged('page', this.page);
    row.endPropertyChanges();
  //   
  //   this._repositionView(itemView.get('layer'), attrs.layout, itemView);
  //   itemView._updateCells();
  //   itemView.widthDidChangeForIndex(0);
  }
  
})