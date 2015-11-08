/**
 * Main Script
 */

console.log("Script start");

var list_groups = new Array();
var activeGroup;

$( document ).ready(
	function()
	{
		activeGroup = createGroup();
		$("#group_id_" + activeGroup.id.toString()).addClass("active_group");

		chrome.windows.getAll({populate:true}, //might be nice to add windowtype normal to filter windows
			function(windows)
			{
				// Retrieve open tabs
				windows.forEach(
					function(window)
					{
						window.tabs.forEach(
							function(tab)
							{					
								if(!tab.pinned) // Ignore pinned tabs
								{
									// Create tab
									var newTab = new classTab();

									newTab.id = getNewIdTab();
									newTab.id_chrome = tab.id;
									newTab.url = tab.url;
									newTab.title = tab.title;
									newTab.pinned = tab.pinned; //line might be deleted?
									newTab.icon = tab.favIconUrl;
									newTab.groupId = -1;

									// Add tab (without opening it)
									addGroupTab(activeGroup, newTab, true);
								}
							}
						);
					}
				);
				// Retrieval of registered groups (or stored??)
				loadGroup();
			}
		);
	}
);

