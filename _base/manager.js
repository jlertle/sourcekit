dojo.provide("dijit._base.manager");

dojo.declare("dijit.WidgetSet",
	null,
	function(){
		// summary:
		//	A set of widgets indexed by id

		this._hash={};
	},
	{
		length: 0,

		add: function(/*Widget*/ widget){
			this._hash[widget.id]=widget;
			length++;
		},
		
		remove: function(/*String*/ id){
			delete this._hash[id];
			length--;
		},

		forEach: function(/*Function*/ func){
			for(var id in this._hash){
				func(this._hash[id]);
			}
		},
		
		filter: function(/*Function*/ filter){
			var res = new WidgetSet();
			this.forEach(function(widget){
				if(filter(widget)){ res.add(widget); }
			});
			return res;		// dijit.WidgetSet
		},
		
		byId: function(/*String*/ id){
			return this._hash[id];
		},

		byClass: function(/*String*/ cls){
			return this.filter(function(widget){ return widget.declaredClass==cls; });
		}
	}
);

// registry: list of all widgets on page
dijit.registry = new dijit.WidgetSet();

dijit._widgetTypeCtr = {};

dijit.getUniqueId = function(/*String*/widgetType){
	// summary
	//	Generates a unique id for a given widgetType

	var id;
	do{
		id = widgetType + "_" +
			(dijit._widgetTypeCtr[widgetType] !== undefined ?
				++dijit._widgetTypeCtr[widgetType] : dijit._widgetTypeCtr[widgetType] = 0);
	}while(dijit.byId(id));
	return id; // String
};


if(dojo.isIE && dojo.isIE < 7){
	// Only run this for IE6 because we think it's only necessary in that case,
	// and because it causes problems on FF.  See bug #3531 for details.
	dojo.addOnUnload(function(){
		dijit.registry.forEach(function(widget){ widget.destroy(); });
	});
}

dijit.byId = function(/*String|Widget*/id){
	// summary:
	//		Returns a widget by its id, or if passed a widget, no-op (like dojo.byId())
	return (dojo.isString(id)) ? dijit.registry.byId(id) : id; // Widget
};

dijit.byNode = function(/* DOMNode */ node){
	// summary:
	//		Returns the widget as referenced by node
	return dijit.registry.byId(node.getAttribute("widgetId")); // Widget
};
