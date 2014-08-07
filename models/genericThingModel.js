var GenericThing = Class.extend({
    
    init: function(key) {
    	this.item ={};
    },
	
	cloneItem: function(value) {
		this.item = value;	
		return this;
	},
	
    isEqual: function(other) {
        return false ;//(this.item.toString() === other.toString())
    },
	
    log : function() {
        console.log(this.item);
    }
	
   
})

var GenericThingList = Class.extend({
	key : "",
	init: function(anyThing,cb) {
        this.key = anyThing.key;
		var thisObj = this;
		chrome.storage.sync.get(anyThing.key,function(things){
	       things = things[anyThing.key] || [];
		   for (var x in things ) {
		   		thisObj.items.push(new anyThing().cloneItem(things[x]));
			}
			if(cb){
				cb(thisObj);	
			}
		})
		this.items = [];	
    },
	
    isStored: function(item){
		var storeItem = false;
        for(var x in this.items) {
           if(this.items[x].isEqual(item)){
              storeItem = this.items[x];
              break;
           }
        }
        return storeItem;
    },

    store: function(item) {
        var stored = this.isStored(item);
        if(!stored) {
              this.items.unshift(item);
			  this.save();
        }
    },

    unstore: function(item) {
        var stored = this.isStored(item);
        if(stored) {
			  this.items.splice(this.items.indexOf(stored),1);		
			  this.save();
        }
    },
	
	save : function () {
		var obj = {};	
		obj[this.key] = [];
		for (var x in this.items){
			obj[this.key].push(this.items[x].item);
		}		 
		chrome.storage.sync.set(obj);
	}
})



