var domainStoreKey = "someThings";

var SomeThing = GenericThing.extend({
    init: function(url,home) {
        this._super(domainStoreKey);
        this.item['home'] = (home)?home:getDomainOfUrl(url);
        this.item['url'] = url;
    },

	isEqual: function(other) {
        return (this.item['url'] == other.item.url || this.item['home'].indexOf(other.item.home) == 0);
    },
	
    change: function(newHome){
        this.item['home'] = newHome;
        this.store();
    }
});

SomeThing.key = domainStoreKey;