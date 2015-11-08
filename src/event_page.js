chrome.browserAction.onClicked.addListener(
	function(dummy) //Open manager tab
	{
	  chrome.tabs.query({'url':chrome.extension.getURL('manager.html')},
		  function(tabs)
		  {
			// Close all other manager tabs
			for(var i = 0 ; i < tabs.length ; ++i)
			{
			  chrome.tabs.remove(tabs[i]['id']);
			}			
			// Create tab
			chrome.tabs.create({'url': chrome.extension.getURL('manager.html')},
				function(tab)
				{
				  // Tab opened.
				});
		  });
	});
