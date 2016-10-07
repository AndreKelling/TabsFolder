/**
* Group and tab manipulation functions 
*/

function createGroup()
{
	// Create a group
	var new_group = new classGroup();

	new_group.id = getNewId();
	new_group.name = "Group " + new_group.id.toString();

	// Add the group
	list_groups.push(new_group);

	// Add group to the groups view
	$("#list_groups").append(
		'<div id="group_id_' + new_group.id.toString() + '" class="group_id" >' +
		'<p class="group_head">' +
		'<input type="text" class="group_name" value="' + new_group.name + '" >' +
		'&nbsp;('+new_group.list_tabs.length.toString()+')&nbsp'+
		'<button type="button" class="group_remove" >Close the group</button>' +
		'<button type="button" class="group_set_actif" >Work with this group</button>' +
		'<button type="button" class="group_move" draggable="true" >M</button>' +
		'</p>' +
		'<ul class="list_tab">' +
		'</u>' +
		'</div>'
	);

	// Authorize Drag&Drop
	$('#group_id_' + new_group.id.toString()).get(0).addEventListener('dragover', allowDrop, false);
	$('#group_id_' + new_group.id.toString()).get(0).addEventListener('drop', dropLienVersGroupe, false);

	return new_group;
}

function addGroupTab(group, tab, onFirstLaunch) //adds a tab to a group?
{
	// Avoid adding our extension window
	if(tab.url != chrome.extension.getURL('manager.html')) //how about return false?
	{
		// Add to group
		tab.groupId = group.id;
		group.list_tabs.push(tab);

		// Update view (?)
		var elementTabList = '<li draggable="true" id="tab_id_' + tab.id + '" title="' + tab.url + '" >'+
			'<div class="tabButtons" >'+
			'<input type="checkbox" class="tabCheckButton" />'+
			'<button type="button" class="tabGoButton" >-&rsaquo;</button>'+
			'<button type="button" class="tabCloseButton" >-</button>'+
			'</div>';

		if(tab.icon)
		{
			elementTabList += '<img src="' + tab.icon + '" alt="" height="17px" /> ';
		}
		if(tab.title)
		{
			elementTabList += tab.title;
		}
		else
		{
			elementTabList += tab.url;
		}
		if(tab.pinned) //remove this?
		{
			elementTabList += ' (P)';
		}
		elementTabList += '</li>';

		$("#group_id_" + group.id.toString()).find(".list_tab").append(elementTabList);

		/*$("#group_id_" + group.id.toString()).find(".list_tab").append(
		  '<li draggable="true" id="tab_id_' + tab.id + '" >' + tab.url + '<button type="button" class="tabCloseButton" >-</button></li>'
		);*/

		// Authorize Drag&Drop
		$('#tab_id_' + tab.id.toString()).get(0).addEventListener('dragstart', dragLienBegin, false);

		// Create the tab if it's the active group
		if(group.id == activeGroup.id)
		{
			createTab(tab, onFirstLaunch);
		}
	}
}

function removeTabGroup(id_tab) 
{
	// Erase from view
	$('#' + id_tab).remove();

	// Delete group
	var group = getGroupByTab(id_tab);
	id_tab = parseInt(id_tab.replace("tab_id_",""));

	for(var i=0 ; i < group.list_tabs.length ; i++)
	{
		if(group.list_tabs[i].id == id_tab)
		{
			// Save
			var tab = group.list_tabs[i];

			// Delete
			group.list_tabs.splice(i, 1);

			// Close tab if it's the active group
			if(group.id == activeGroup.id)
			{
				closeTab(tab);

				// Check there's still one tab after
				if(activeGroup.list_tabs.length == 0)
				{
					// We create an empty tab             //repeated code
					var empty_tab = new classTab();
					empty_tab.id = getNewIdTab();
					empty_tab.id_chrome = -1;
					empty_tab.url = "chrome://newtab/";
					empty_tab.pinned = false;
					empty_tab.title = "New tab";
					empty_tab.icon = "";
					empty_tab.groupId = -1;

					addGroupTab(activeGroup, empty_tab);
				}
			}
		  
			tab.groupId = -1;
			tab.id_chrome = -1;

			// Return the erased tab
			return tab;
		}
	}
}

function setActiveGroup(group)
{
	$(".active_group").removeClass("active_group");

	// Close the tabs of the active group
	for(var i=0 ; i < activeGroup.list_tabs.length ; ++i)
	{
		closeTab(activeGroup.list_tabs[i], true);
	}

	// Update the new active group
	activeGroup = group;

	if(activeGroup.list_tabs.length == 0)
	{
		// We create an empty tab         //repeated code
		var empty_tab = new classTab();
		empty_tab.id = getNewIdTab();
		empty_tab.id_chrome = -1;
		empty_tab.url = "chrome://newtab/";
		empty_tab.pinned = false;
		empty_tab.title = "New tab";
		empty_tab.icon = "";
		empty_tab.groupId = -1;

		addGroupTab(activeGroup, empty_tab);
	}

	$("#group_id_" + activeGroup.id.toString()).addClass("active_group");

	// Open the tabs
	console.log("Opening: " + activeGroup.name);
	for(var i=0 ; i < activeGroup.list_tabs.length ; ++i)
	{
		createTab(activeGroup.list_tabs[i]);
	}
}
