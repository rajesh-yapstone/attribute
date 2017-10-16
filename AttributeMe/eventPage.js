var menuItem = {
    "id": "spendMoney",
    "title": "Attribute",
    "contexts": ["selection"]
};

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}

var url="";

chrome.tabs.getSelected(null, function(tab) {
	alert("url 1="+ tab.url);
    url=tab.url;
})

setTimeout(function(){
    alert("inside timer:"+url);


    var response =    $.ajax({  
        url:'http://localhost:8080/passport.action?url='+url,  
        type:'POST',
        contentType:false,
        async:true,
        dataType: 'application/json;charset=utf-8' 
    }).responseText;  
},500);

 
 



chrome.contextMenus.create(menuItem);

chrome.contextMenus.onClicked.addListener(function(clickData){   
    if (clickData.menuItemId == "spendMoney" && clickData.selectionText){    
        if (isInt(clickData.selectionText)){          
            chrome.storage.sync.get(['total','limit'], function(budget){
                var newTotal = 0;
                if (budget.total){
                    newTotal += parseInt(budget.total);
                }

                newTotal += parseInt(clickData.selectionText);
                chrome.storage.sync.set({'total': newTotal}, function(){               
                if (newTotal >= budget.limit){
                    var notifOptions = {
                        type: "basic",
                        iconUrl: "icon48.png",
                        title: "Limit reached!",
                        message: "Uh oh, look's like you've reached your alloted limit."
                    };
                    chrome.notifications.create('limitNotif', notifOptions);

                    }
                });
            });
        }
    }
});

chrome.storage.onChanged.addListener(function(changes, storageName){
    chrome.browserAction.setBadgeText({"text": changes.total.newValue.toString()});
});
