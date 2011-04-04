Endash.GridViewDataSource = {
  isGridViewDataSource: YES,
  
  contentForCell: function(row, column) {
    var content = this.get('content');
    
    return content.objectAt(row);
  }
  
  
}