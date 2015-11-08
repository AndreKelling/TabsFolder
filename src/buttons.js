$( document ).ready(
	function()
	{
		$("#create_group").click(
			function()
			{
				createGroup();
				// Save
				saveGroup();
			}
		);

		$("#list_groups").on( "click", ".group_remove",
			function()
			{
				var group = getGroup(getGroupId($(this)));

				if(group.id == activeGroup.id)
				{
					// Set the next group as active
					var next_group = list_groups[0];// we take the first group we can find
					if(next_group.id == activeGroup.id)// If it's the same
					{
						// There's another group
						if(list_groups.length > 1)
						{
							next_group = list_groups[1];
						}
						// Or not
						else
						{
							next_group = createGroup();
						}
					 }
					  
					//Close the current group tabs and open the next's
					setActiveGroup(next_group);
					  
					// Save
					saveGroup();
				}

				// Update view
				$("#group_id_" + group.id.toString()).remove();

				// Delete group
				list_groups.splice(list_groups.indexOf(group), 1);

				// Save
				saveGroup();
			}
		);

		$("#list_groups").on( "click", ".group_set_actif",
			function()
			{
				setActiveGroup(getGroup(getGroupId($(this))));

				// Save
				saveGroup();
			}
		);

		$("#list_groups").on( "blur", ".group_name",
			function()
			{
				group = getGroup(getGroupId($(this)));
				group.name = $(this).val();

				// Save
				saveGroup();
			}
		);
	}
);
