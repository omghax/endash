Endash.ZenRender = {
	
	abbreviation: '',
	
	initMixin: function() {
		this._zen_tree = Endash.ZenParser.parse(this.get('abbreviation'));
	}
	
}