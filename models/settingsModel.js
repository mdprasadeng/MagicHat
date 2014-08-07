var settingsKey = "settings";
var delWordEnabled = "delWord";
var maxWordTShownCount = "maxWordTShownCount";
var delExactEnabled = "delExact";
var maxExactTTime = "maxExactTTime";
var Settings = Class.extend({
    localSettings : {},
    key : "",
    init: function() {
        this.key = settingsKey;
        this.load()
    },

    load: function() {
        var temp = this;
        chrome.storage.sync.get(temp.key,function(value){
            temp.localSettings = value[temp.key] || {};
        });
    },

    set: function(name,value) {
        console.log(name,value)
        this.localSettings[name] = value;
        var obj = {};
        obj[this.key] = this.localSettings;
        chrome.storage.sync.set(obj);
    },

    get: function(name) {
        return this.localSettings[name]
    },

    getMaxWordTShownCount: function() {
        return this.get(maxWordTShownCount);
    },
    getMaxExactTTime : function() {
        return this.get(maxExactTTime);
    },

    setMaxWordTShownCount: function(value) {

        return this.set(maxWordTShownCount,value);
    },
    setMaxExactTTime : function(value) {
        return this.set(maxExactTTime,value);
    },

    setDelExact:function(value) {
        return this.set(delExactEnabled,value);
    },

    getDelExact:function() {
        return this.get(delExactEnabled);
    },

    setDelWord:function(value) {
        return this.set(delWordEnabled,value);
    },

    getDelWord:function() {
        return this.get(delWordEnabled);
    }

});

gSettings = new Settings();
