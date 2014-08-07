var exactThingKey = "exactThing";

var ExactThing = GenericThing.extend({
    init: function(url,count) {
        this._super(exactThingKey)
        this.item['url'] = url;
        this.item['timeSpent'] = (count || 0);
    },
	
	isEqual: function(other) {
        return this.item['url'] == other.item.url;
    },
	
    addTimeSpent: function(time){
        this.item['timeSpent'] += time;
        if(gSettings.getMaxExactTTime() && this.item['timeSpent'] > gSettings.getMaxExactTTime()) {
            this.unstore();
        }
        else {
            this.store();
        }
        this.item['timeSpent'];
    }
});

ExactThing.key = exactThingKey;