//Fixing a chrome.storage.sync bug where configuration strings longer than 4096 bytes were not saved ("storage.set: QUOTA_BYTES_PER_ITEM quota exceeded.")
// https://github.com/kdzwinel/Context/blob/master/js/classes/HugeStorageSync.class.js
function HugeStorageSync()
{
	"use strict";

	function getCacheKey(key, i)
	{
		return (i === 0) ? key : key + "_" + i;
	}

	/**
	 * Allows to save strings longer than QUOTA_BYTES_PER_ITEM in chrome.storage.sync by splitting them into smaller parts.
	 * Please note that you still can't save more than QUOTA_BYTES.
	 *
	 * @param {string} key
	 * @param {string} value
	 * @param {function(): void=} callback
	 */
	this.set =									//i suspect there's a bug when the sync storage is full
		function(key, value, callback)
		{
			var i = 0,
				cache = {},
				segment,
				cacheKey;

			// split value into chunks and store them in an object indexed by `key_i`
			while(value.length > 0)
			{
				cacheKey = getCacheKey(key, i);
				//if you are wondering about -2 at the end see: https://code.google.com/p/chromium/issues/detail?id=261572
				segment = value.substr(0, chrome.storage.sync.QUOTA_BYTES_PER_ITEM/2 - cacheKey.length - 2);
				cache[cacheKey] = segment;
				value = value.substr(chrome.storage.sync.QUOTA_BYTES_PER_ITEM/2 - cacheKey.length - 2);
				i++;
			}

			// store all the chunks
			chrome.storage.sync.set(cache, callback);

			//we need to make sure that after the last chunk we have an empty chunk. Why this is so important?
			// Saving v1 of our object. Chrome sync status: [chunk1v1] [chunk2v1] [chunk3v1]
			// Saving v2 of our object (a bit smaller). Chrome sync status: [chunk1v2] [chunk2v2] [chunk3v1]
			// When reading this configuration back we will end up with chunk3v1 being appended to the chunk1v2+chunk2v2
			chrome.storage.sync.remove(getCacheKey(key, i));
		};


	/**
	 * Retrieves chunks of value stored in chrome.storage.sync and combines them.
	 *
	 * @param {string} key
	 * @param {function(string):void=} callback
	 */
	this.get =
		function(key, callback)
		{
			//get everything from storage
			chrome.storage.sync.get(null,
				function(items)
				{
					var i, value = "";

					for(i=0; i<chrome.storage.sync.MAX_ITEMS; i++)
					{
						if(items[getCacheKey(key, i)] === undefined)
						{
							break;
						}
						value += items[getCacheKey(key, i)];
					}

					callback(value);
				}
			);
		};
}


function loadGroup()
{
	var hugeStorage = new HugeStorageSync();
	hugeStorage.get("lg",
		function(string_totale)
		{
			chrome.storage.sync.get(["active_name"],
				function(items)
				{
					if(items["active_name"])
					{
						activeGroup.name = items["active_name"];
						$("#group_id_" + activeGroup.id.toString()).find(".group_name").val(activeGroup.name);
					}
					else
					{
						console.log("First launch");
					}
					  
					if(string_totale != "")
					{
						var listLoadGroup = JSON.parse(string_totale);

						for(var i=0 ; i < listLoadGroup.length; ++i)
						{
							var newGroup = createGroup();
							newGroup.name = listLoadGroup[i].name;
							$("#group_id_" + newGroup.id.toString()).find(".group_name").val(newGroup.name);

							for(var j=0 ; j < listLoadGroup[i].list_tabs.length; ++j)
							{
								// Create tab  (repeated code??)
								var newTab = new classTab();

								newTab.id = getNewIdTab();
								newTab.id_chrome = -1;
								newTab.url = listLoadGroup[i].list_tabs[j].url;
								newTab.title = listLoadGroup[i].list_tabs[j].title;
								newTab.pinned = listLoadGroup[i].list_tabs[j].pinned;
								newTab.icon = listLoadGroup[i].list_tabs[j].icon;
								newTab.groupId = -1;

								// Add tab (without opening it)
								addGroupTab(newGroup, newTab);
							}
						}
					}
					else
					{
						console.log("Not found");
					}
				}
			);
		}
	);
}

function saveGroup()
{
	//chrome.storage.sync.clear( //empty sync storage (for debug purposes, may be eliminated later)
		//function()
		//{
			var listSaveGroup = new Array();
			for(var i=0 ; i < list_groups.length; ++i)
			{
				// Copy all but the active one (why? wouldn't it be better to copy all?)
				if(list_groups[i].id != activeGroup.id)
				{
					listSaveGroup.push(list_groups[i]);
				}
			}
			// Save active group name
			chrome.storage.sync.set({"active_name":activeGroup.name});
			
			// Split the list to be saved into parts
			var hugeStorage = new HugeStorageSync();
			hugeStorage.set('lg', JSON.stringify(listSaveGroup)); //add a callback here to handle any storage errors
			//chrome.storage.sync.set({"list_groups":storageSplit}); (??)
	//	}
	//);
}