var bkg = chrome.extension.getBackgroundPage();
var templates = {};
bkg.initSource();
var sourceKeys = bkg.searchAbles;
function init() {
	var source   = $("#someTmp").html();
	templates.some = Handlebars.compile(source);
	var source   = $("#exactTmp").html();
	templates.exact = Handlebars.compile(source);
	var source   = $("#wordTmp").html();
	templates.word = Handlebars.compile(source);

    templates.edit = Handlebars.compile($("#editTmp").html());

	renderSomethings();
    renderExactItems();
    renderWordthings();

    $(".head span").tooltip({placement:"bottom"});



    $('#miniAdd').typeahead({
        name:"Main Bar",
        local : sourceKeys,
        header: "<div id='dropSugg'>",
        template: Handlebars.compile('<a href="{{value}}" class="sugg">{{value}}</a>'),

        footer: "</div>"
    }).on('typeahead:selected',function(event,data){
            document.location.href = data.value;
        });

    $('#miniAdd').keypress(function(e){
        if(e.which == 13) {
            if($(".sugg").length > 0) {
                document.location.href = $(".sugg").first().attr('href');
            }
        }
    })

    $("#miniAdd").focus()


}



function renderSomethings() {
    var html = templates.some(bkg.someItems);
    $("#checked div div:first").html("").append(html);
    jQuery.each(bkg.someItems.items,function(x,val){
        jQuery("#someThings .remove").eq(x).click(function(){
            bkg.someItems.unstore(val);
            $(this).parent().remove();
            //renderSomethings();
        })

        jQuery("#someThings .edit").eq(x).click(function(){
            var li = $(this).parent();
            $(li).html(templates.edit(val.item));
            $(li).find("input").focus();
            $(li).find("input")[0].setSelectionRange(val.item.home.length+1,val.item.url.length);
            $(li).find("form").submit(function(e){
               bkg.someItems.items[x].item.home = $(this).find("input").val();
               bkg.someItems.save();
               renderSomethings();
               return false;
            });
        })
    });
}

function renderExactItems() {
    var exact = templates.exact(bkg.exactItems);
    $("#checked div:nth-child(2)").html("").append(exact);
    jQuery.each(bkg.exactItems.items,function(i,val){
        jQuery("#exactThings .remove").eq(i).click(function(){
            bkg.exactItems.unstore(val);
            $(this).parent().remove();
            //renderExactItems();
        })

    });

    var delEnabled = bkg.gSettings.getDelExact();
    if(delEnabled){
        jQuery("#delExact").prop("checked",true);
        jQuery("#exactText").val(bkg.gSettings.getMaxExactTTime()).prop("disabled",false);
    }
    else {
        jQuery("#delExact").next().prop("checked",false);
        jQuery("#exactText").val(bkg.gSettings.getMaxExactTTime()).prop("disabled",true);
    }

    jQuery("#delExact").bind("change",function(){
       bkg.gSettings.setDelExact($(this).is(":checked"));
        jQuery("#exactText").prop("disabled",!$(this).is(":checked"));
    });

    jQuery("#exactText").bind("change",function(){
        if($.isNumeric(jQuery(this).val()))
            bkg.gSettings.setMaxExactTTime($(this).val());
    });
}

function renderWordthings() {

    var word = templates.word(bkg.wordItems);
	$("#checked div:nth-child(3)").html("").append(word);
    jQuery.each(bkg.wordItems.items,function(i,val){
        jQuery("#wordThings .remove").eq(i).click(function(){
            bkg.wordItems.unstore(val);
            $(this).parent().remove();
            //renderWordthings();
        })
    })

    var delEnabled = bkg.gSettings.getDelWord();
    if(delEnabled){
        jQuery("#delWord").prop("checked",true);
        jQuery("#wordText").val(bkg.gSettings.getMaxWordTShownCount()).prop("disabled",false);
    }
    else {
        jQuery("#delWord").prop("checked",false);
        jQuery("#wordText").val(bkg.gSettings.getMaxWordTShownCount()).prop("disabled",true);
    }

    jQuery("#delWord").bind("change",function(){
        bkg.gSettings.setDelWord($(this).is(":checked"));
        jQuery("#wordText").prop("disabled",!$(this).is(":checked"));
    });

    jQuery("#wordText").bind("change",function(){
        if($.isNumeric(jQuery(this).val()))
            bkg.gSettings.setMaxWordTShownCount($(this).val());
    });
}

function items() {
	ThingUtil.getStoredObjects(SomeThing,function(somes){
		for (var x in somes){
			$("#something").append("<li>"+somes[x].item.home+"</li>")
		}
	})
	
}





$(init);