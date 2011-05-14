SC.TableCellContentView = SC.LabelView.extend({
  layout: {left: 10, right: 10},
  isPoolable: YES,
  layerIsCacheable: YES,
  contentValueKeyBinding: '*column.key',
  
  contentValueKeyDidChange: function() {
    this.updatePropertyFromContent('value', '*', 'contentValueKey');
  }.observes('contentValueKey')
});