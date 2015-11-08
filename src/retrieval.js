/**
 * Search functions (?) 
 */

function getNewId() 
{
  var valid = false;
  var id = 0;
  while(!valid)
  {
    valid = true;
    
    for (var i = 0 ; i < list_groups.length ; ++i)
    {
      // We check that the id doesn't exist already
      if(list_groups[i].id == id)
      {
		valid = false;
      }
    }
    
    id++;
  }
  return id-1;
}


var id_counter = 0;

function getNewIdTab()
{
  id_counter++;
  return id_counter;
}

function getGroupId(element) 
{
  var id_nom = "-1";
  
  // We first verify that the element is not already a group
  if(element.hasClass("group_id"))
  {
    id_nom = element.attr("id");
  }
  else
  {
    id_nom = element.closest(".group_id").attr("id");
  }
  
  return parseInt(id_nom.replace("group_id_",""));
}

function getGroup(id) 
{
  for(var i=0 ; i < list_groups.length ; i++)
  {
    if(list_groups[i].id == id)
    {
      return list_groups[i];
    }
  }
  console.error("Group not found : " + id.toString());
} 

function getGroupByTab(tab_id)
{
  tab_id = parseInt(tab_id.replace("tab_id_",""));
  
  for(var i=0 ; i < list_groups.length ; i++)
  {
    for(var j=0 ; j < list_groups[i].list_tabs.length ; j++)
    {
      if(list_groups[i].list_tabs[j].id == tab_id)
      {
	return list_groups[i];
      }
    }
  }
  console.error("No group contains : " + tab_id.toString());
}
