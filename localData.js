var count = 0
function loadChecker(cb,eq){
    count++;
    if(count == eq)
        cb();
}

var jQuery = {};
jQuery.each = function(items,it){
    for(var x in items){
        if(items.hasOwnProperty(x))
            it(x,items[x]);
    }
}

var someItems = new GenericThingList(SomeThing,function(){loadChecker(load,4)});
var exactItems = new GenericThingList(ExactThing,function(){loadChecker(load,4)});
var wordItems = new GenericThingList(WordThing,function(){loadChecker(load,4)});

var searchAbles = [];

loadChecker(load,4);


function initSource() {
    var keys;
    var max  = 100;
    searchAbles = [];
    jQuery.each(someItems.items, function(index, value){
        keys = urlBreaker(value.item.home)
        searchAbles.push({value:value.item.home, tokens:keys})

    });

    jQuery.each(exactItems.items, function(index, value){
        keys = urlBreaker(value.item.url)
        searchAbles.push({value:value.item.url, tokens:keys})
    });

    jQuery.each(wordItems.items, function(index,value){
        searchAbles.push({value:value.item.url, tokens:[value.item.word]})
    });

}

function urlBreaker(url) {
    var keys = [];
    var splits;
    url = url.substr(url.indexOf("//")+2);
    splits = url.split("/");
    keys = keys.concat(domainBreaker(splits[0]));
    keys = keys.concat(splits.splice(1));

    return keys;
}

function domainBreaker(domain){
    if(domain.indexOf("www.")==0)
        domain = domain.substr(4);
    domain = domain.substr(0,domain.lastIndexOf("."));
    return domain.split(".");
}



function load () {
    initSource();
}




function getCurrentTab(callback){
    chrome.tabs.query({ currentWindow: true, active: true },function (tabArray) {
            var currTab = tabArray[0];
            callback(currTab);
        }
    );
}



chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId,function(tab){
		updateMenu(tab);
        monitorBadgeText(tab);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

	getCurrentTab(function(currTab){
        if(tabId == currTab.id) {
            updateMenu(tab);
            monitorBadgeText(currTab);
        }
    });


});



var badgeTexts = {};

badgeTexts['new']= {};
badgeTexts['add']= {};
badgeTexts['new']['text'] = "Random";
badgeTexts['add']['text'] = "Add";
badgeTexts['new']['img'] = "./img/bagCheck128.png";
badgeTexts['add']['img'] = "./img/bag.png";


var currBadge;

function setBadgeText(txt) {
    currBadge = badgeTexts[txt]["text"];
    chrome.browserAction.setIcon({
        path: badgeTexts[txt]['img']
    });
    chrome.browserAction.setTitle({
        title: badgeTexts[txt]["text"]
    })
}

function monitorBadgeText(tab){
    if(tab == undefined) {
        getCurrentTab(function (currTab) {
            monitorBadgeText(currTab);
        } );
        return;
    }

    var url = tab.url;
    var some = new SomeThing(url);
    var exact = new ExactThing(url);
    if(url.indexOf("chrome") == 0) {
        setBadgeText("new");
        return;
    }

    if(someItems.isStored(some) || exactItems.isStored(exact)){

        setBadgeText("new");
    }
    else {

        setBadgeText("add");
    }

}

chrome.browserAction.onClicked.addListener(function(tab){
    if(currBadge == badgeTexts.new.text ){
        var url = random();
        chrome.tabs.update(tab.id,{ url:url});
    }
    else if (currBadge == badgeTexts.add.text){
        var something = new SomeThing(tab.url);
        someItems.store(something);
        updateMenu(tab);
    }
    monitorBadgeText(tab);
});


function random() {
    var url;

    var splits = [someItems.items.length,exactItems.items.length, wordItems.items.length];
    var total = splits[0]+splits[1]+splits[2];
    if(total <= 0) return ;
    var rand = Math.floor(Math.random()*(total))+1;
    if(rand > someItems.items.length){
        rand -= someItems.items.length;
        if(rand > exactItems.items.length){
            rand -= exactItems.items.length;
            url = wordItems.items[rand-1].item.url;
        }
        else {
            url = exactItems.items[rand-1].item.url;
        }
    }
    else {
        url = someItems.items[rand-1].item.home;
    }
    return url;
}


chrome.commands.onCommand.addListener(function(command) {

        getCurrentTab(function (currTab) {
            var url = random();
            chrome.tabs.update(currTab.id,{ url:url});
        } );

});