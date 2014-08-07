function updateMenu(tab) {
	
	var some = new SomeThing(tab.url);
	var someExists = someItems.isStored(some);
	var title = (someExists)? "Remove ": "Add ";
	title += some.item.home;
	
	chrome.contextMenus.update("cio_subdomain",{
		title:title,
	});	
	
	var exact = new ExactThing(tab.url);
	var exactExists = exactItems.isStored(exact);
	var title = (exactExists)? "Remove ": "Add ";
	if(exact.item.url.length > 50)
		title += exact.item.url.substr(0,50)+"...";
	else
		title += exact.item.url;	
	
	chrome.contextMenus.update("cio_suburl",{
		title:title
	});
    monitorBadgeText();
	return [someExists, exactExists ]
}

function managePageHome(info,tab){
	var some = new SomeThing(tab.url);
	var existsome = someItems.isStored(some);
	if(existsome){
		someItems.unstore(existsome)
	}	
	else {
		someItems.store(some);
	}
	updateMenu(tab);
}

function managePageLink(info,tab){
	var exact = new ExactThing(tab.url);
	var existexact = exactItems.isStored(exact);
	if(existexact){
		exactItems.unstore(existexact)
	}	
	else {
		exactItems.store(exact);
	}
	updateMenu(tab);
}

function addContextLink(info,tab){
	var exact = new ExactThing(info.linkUrl);
	exactItems.store(exact);
}

function addContextWord(info,tab){
	var word = new WordThing(info.selectionText)
	wordItems.store(word);
}


chrome.contextMenus.create({
	type:"normal",
	id:"cio_link",
	title:"Add Link",
	contexts:["link"],
	onclick: addContextLink
	});

chrome.contextMenus.create({
	type:"normal",
	id:"cio_word",
	title:"Bag '%s'",
	contexts:["selection"],
	onclick:addContextWord
	});

chrome.contextMenus.create({
	type:"normal",
	id:"cio",
	title:"Magic Hat"
	
	});

chrome.contextMenus.create({
		id:"cio_subdomain",
		type:"normal",
		parentId:"cio",
		title:"Add/Remove Domain",
		onclick:managePageHome
	});	
	
chrome.contextMenus.create({
		id:"cio_suburl",
		type:"normal",
		parentId:"cio",
		title:"Add/Remove Url",
		onclick:managePageLink
});	