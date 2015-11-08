function createTab(tab, onFirstLaunch)
{
  if(!onFirstLaunch)// We don't open the tabs that are already open
  {
      chrome.tabs.create({url:tab.url, active:false, pinned:tab.pinned}, function(createdTab) {
      // Retrieve the id_chrome !!!!!
      tab.id_chrome = createdTab.id;
    });
  }
}

function closeTab(tab)
{
  chrome.tabs.remove(tab.id_chrome);
}
