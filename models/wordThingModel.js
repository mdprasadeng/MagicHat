var wordThingKey = "wordThing";
var searchEngine = "https://google.com/search?q=";
var WordThing = GenericThing.extend({
    init: function(word,count) {
        this._super(wordThingKey)
        this.item['word'] = word;
        this.item['shownCount'] = (count || 0);
        this.item['url'] = searchEngine+encodeURIComponent(word);
    },
	isEqual: function(other) {
        return this.item['word'] == other.item.word;
    },

    cloneItem: function(value) {
        this.item = value;
        this.item['url'] = searchEngine+encodeURIComponent(this.item.word);
        return this;
    },
	
    incrShownCount: function(){
        this.item['shownCount'] += 1;
        if(gSettings.getMaxWordTShownCount() && this.item['shownCount'] > gSettings.getMaxWordTShownCount()) {
            this.unstore();
        }
        else {
            this.store();
        }
        return  this.item['shownCount'];
    }
});

WordThing.key = wordThingKey;