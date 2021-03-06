var openDialogWindow = null
var activeTVI = null
var activeTVIAssocs = []
var activeID = null

function OpenDialog(tvi, dialogID, header = null) {
   if ($(dialogID).css("display") == "none") {
      // Check if another dialog is already open
      if (openDialogWindow != null) {
         OpenDialog(null, openDialogWindow)
      }

      if (header) {
         $(dialogID + " .dialog_header")[0].innerText = header
      } else {
         $(dialogID + " .dialog_header")[0].innerText = tvi[0].innerText
      }

      $(dialogID).css("display", "flex")
      openDialogWindow = dialogID
      activeTVI = tvi

      if (tvi) {
         activeTVIAssocs = notebookData.GetNode(activeTVI.attr("id")).associations
      } else {
         try {
            activeTVIAssocs = notebookData.GetNode(activeID).associations
         } catch (error) {
            // TVI has no associations or cannot be found (probably a new notebook)
         }
      }
   } else {
      $(dialogID).css("display", "none")
      openDialogWindow = null
      activeTVI = null
      activeTVIAssocs = []
   }

   // If the dialog mentioned is now the open dialog window, return true
   return openDialogWindow == dialogID
}



// FILE MENU FUNCTIONS
// dw_new_name_nb functions
function OpenNBNewNameDialog() {
   OpenDialog(null, "#dw_name_new_nb", "New Notebook")

   // Automatically clear and focus the input
   $("#dw_name_new_nb input")[0].value = ""
   $("#dw_name_new_nb input").focus()
}

function NameNewNotebook() {
   var newName = $("#dw_name_new_nb input")[0].value

   if (newName.trim().length > 0) { newName.name = newName.trim() }
   notebookData.name = newName

   notebookData.UpdateDS()
   LoadNotebookToScreen(lastOpenNotebook)
}

var e1 = null
function CatchKeysNBNewName(caller, e) {
   e1 = e
   switch (e.keyCode) {
      case 13: // Enter pressed
         NameNewNotebook()
         OpenNBNewNameDialog(activeID)
         break
      case 27: // Escape Pressed
         OpenNBNewNameDialog(activeID)
         break
   }
}

function BuildNewNotebook() {
   var newNBID = CreateNewNotebookID()
   var newName = "Notebook"

   lastOpenNotebook = newNBID
   notebookData = new Notebook(newNBID)

   SetLastOpenNoteBook(newNBID)
   SetLastOpenPage("0000")

   LoadNotebookToScreen(lastOpenNotebook)

   OpenNBNewNameDialog()
}



// dw_name_new_TVI functions
function OpenTVINewNameDialog(newNodeID) {
   activeID = newNodeID
   if (OpenDialog(null, "#dw_name_new_TVI", "New Item")) {
      // Automatically clear and focus the input
      $("#dw_name_new_TVI input")[0].value = ""
      $("#dw_name_new_TVI input").focus()
   } else {
      activeID = null
   }
}

function CatchKeysTVINewName(caller, e) {
   switch (e.keyCode) {
      case 13: // Enter pressed
         NameNewNode()
         OpenTVINewNameDialog(activeID)
         break
      case 27: // Escape Pressed
         OpenTVINewNameDialog(activeID)
         break
   }
}

function NameNewNode() {
   var node = notebookData.GetNode(activeID)
   var newName = $("#dw_name_new_TVI input")[0].value

   if (newName.trim().length > 0) { node.name = newName.trim() }
   notebookData.UpdateDS()
   LoadNotebookToScreen(lastOpenNotebook)
}



// dw_rename_TVI functions
function OpenTVIRenameDialog(tvi = null) {
   if (OpenDialog(tvi, "#dw_rename_TVI")) {
      // Automatically clear and focus the input
      $("#dw_rename_TVI input")[0].value = ""
      $("#dw_rename_TVI input").focus()
   }
}

function CatchKeysTVIRename(caller, e) {
   switch (e.keyCode) {
      case 13: // Enter pressed
         RenameActiveNode()
         OpenTVIRenameDialog()
         break
      case 27: // Escape Pressed
         OpenTVIRenameDialog()
         break
   }
}

function RenameActiveNode() {
   var itemID = activeTVI.attr("id")
   var node = notebookData.GetNode(itemID)
   var newName = $("#dw_rename_TVI input")[0].value

   node.name = newName
   notebookData.UpdateDS()
   LoadNotebookToScreen(lastOpenNotebook)
}



// dw_associations_TVI functions
var checkedSVG = "<svg width='16' height='16' viewBox='0 0 16 16'> <path fill='currentColor' d='M14 0h-12c-1.1 0-2 0.9-2 2v12c0 1.1 0.9 2 2 2h12c1.1 0 2-0.9 2-2v-12c0-1.1-0.9-2-2-2zM7 12.414l-3.707-3.707 1.414-1.414 2.293 2.293 4.793-4.793 1.414 1.414-6.207 6.207z'></path></svg>"
var uncheckedSVG = "<svg width='16' height='16' viewBox='0 0 16 16'> <path fill='currentColor' d='M14 0h-12c-1.1 0-2 0.9-2 2v12c0 1.1 0.9 2 2 2h12c1.1 0 2-0.9 2-2v-12c0-1.1-0.9-2-2-2zM14 14h-12v-12h12v12z'></path></svg>"

function OpenTVIAssociationsDialog(tvi, inputConfirmed) {
   if (inputConfirmed) {
      // Make changes based on edited content
      var itemID = activeTVI.attr("id")
      var node = notebookData.GetNode(itemID)
      var oldAssocs = node.associations

      var checked = $("#dw_associations_scroll [state='checked']")
      var newAssocs = []
      for (var i = 0; i < checked.length; i++) {
         newAssocs.push(checked[i].id.substring(2))
      }

      for (var i = 0; i < oldAssocs.length; i++) {
         // If an old association is not included in the list of new associations, remove that old association
         if (!newAssocs.includes(oldAssocs[i])) {
            var otherNode = notebookData.GetNode(oldAssocs[i])
            otherNode.RemoveAssociation(node.id)

            node.RemoveAssociation(oldAssocs[i])
         }
      }

      // If one of the new associations does not exist in the prior list, add it in
      for (var j = 0; j < newAssocs.length; j++) {
         if (!oldAssocs.includes(newAssocs[j])) {
            var otherNode = notebookData.GetNode(newAssocs[j])
            otherNode.AddAssociation(node.id)

            node.AddAssociation(newAssocs[j])
         }
      }

      notebookData.UpdateDS()
      LoadNotebookToScreen(lastOpenNotebook)
   }

   if (OpenDialog(tvi, "#dw_associations_TVI")) {
      // Automatically clear and focus the input
      $("#dw_associations_TVI input")[0].value = ""
      $("#dw_associations_TVI input").focus()

      // Reload the scrolling treeview
      var itemID = activeTVI.attr("id")
      var node = notebookData.GetNode(itemID)
      var assocs = node.associations

      LoadNotebookToAssociations()
   }
}

function ToggleATVI(caller, forceNewState = null) {
   // Check the state of the caller, if unchecked, make it checked

   var atvi = $(caller)
   var check = $("#" + caller.id + "_check")[0]

   if (forceNewState == "checked") {
      check.innerHTML = checkedSVG
      atvi.attr("state", "checked")
   } else if (forceNewState == "unchecked") {
      check.innerHTML = uncheckedSVG
      atvi.attr("state", "unchecked")
   } else {
      if (atvi.attr("state") == "checked") {
         // Uncheck the box
         check.innerHTML = uncheckedSVG
         atvi.attr("state", "unchecked")
      } else {
         check.innerHTML = checkedSVG
         atvi.attr("state", "checked")
      }
   }
}

function CreateNewATVI(id, name, type) {
   var depth = notebookData.GetNodeDepth(id)
   var indent = parseInt($("body").css('--treeview-depth-indent')) * (depth - 1)
   var collapserWidth = parseInt($("body").css('--treeview-item-collapser-width'))

   var widthFix = indent + collapserWidth

   var html = "<div class='associative_tree_view_item' type='" + type + "' id='a_" + id + "' "
   html += "onmouseover='TreeViewHover(this)' "
   html += "onmouseout='TreeViewLeaveHover(this)' "
   html += "onclick='ToggleATVI(this)' "
   if (activeTVIAssocs.includes(id)) { html += "state='checked'>" }
   else { html += "state='unchecked'>" }
   html += "<div id='a_" + id + "_check' style='display:inline-block;vertical-align:middle'>"

   if (activeTVIAssocs.includes(id)) { html += checkedSVG + "</div>" }
   else { html += uncheckedSVG + "</div>" }

   if (type == "folder") {
      html += "<div id='a_" + id + "_collapser' class='tree_view_item_collapser' "
      html += "onclick='ToggleFolderCollapse(this); event.stopPropagation();' isopen='true' style='position:relative;left:" + (indent + 4) + "px'>"
      html += "<div id='a_" + id + "_open' class='tree_view_item_open'>"
      html += "<svg id='a_" + id + "_open_img' class='tree_view_item_open_img' width='16' height='16' viewBox='0 0 16 16'><path fill='currentColor' d='M4.957 5.543l-1.414 1.414 4.457 4.457 4.457-4.457-1.414-1.414-3.043 3.043z'></path></svg></div>"
      html += "<div id='a_" + id + "_closed' class='tree_view_item_closed' style='display:none'>"
      html += "<svg id='a_" + id + "_closed_img' class='tree_view_item_closed_img' width='16' height='16' viewBox='0 0 16 16'><path fill='currentColor' d='M5.543 11.043l1.414 1.414 4.457-4.457-4.457-4.457-1.414 1.414 3.043 3.043z'></path></svg></div></div>"
      html += "<div class='tree_view_item_inner' id='a_" + id + "_inner' "
      html += "style='position:relative;left:" + (indent + 4) + "px;'>" + name + "</div></div>"
   } else {
      html += "<div class='tree_view_item_inner' id='a_" + id + "_inner' "
      html += "style='left:" + widthFix
      html += "px; width:calc(100% - " + widthFix + "px)'>" + name + "</div></div>"
   }

   return html
}



// dw_flip_TVI functions
function OpenTVIFlipDialog(tvi, inputConfirmed) {
   if (inputConfirmed) {
      if (notebookData.GetNode(tvi.attr("id")).type == "folder") {
         notebookData.GetNode(tvi.attr("id")).type = "page"
      } else {
         notebookData.GetNode(tvi.attr("id")).type = "folder"
      }

      notebookData.UpdateDS()
      LoadNotebookToScreen(lastOpenNotebook)
   }

   OpenDialog(tvi, "#dw_flip_TVI")
}



// dw_delete_TVI functions
function OpenTVIDeleteDialog(tvi, inputConfirmed) {
   if (inputConfirmed) {
      notebookData.DeleteNode(tvi.attr("id"))

      notebookData.UpdateDS()
      LoadNotebookToScreen(lastOpenNotebook)
   }

   OpenDialog(tvi, "#dw_delete_TVI")
}



// dw_details_TVI functions
function OpenTVIDetailsDialog(tvi = null) {
   var item = notebookData.GetNode(tvi.attr("id"))

   var createDate = new Date(item.createDate)
   var editDate = new Date(item.editDate)

   var html = "<b>ID:</b> " + item.id + "<br/>"
   html += "<b>Name:</b> " + item.name + "<br/>"
   html += "<b>Type:</b> " + item.type + "<br/><br/>"
   html += "<b>Creation Date:</b> " + createDate + "<br/>"
   html += "<b>Last Edit Date:</b> " + editDate + "<br/><br/>"
   html += "<b>Associations:</b> " + ((item.associations.toString()).split(",")).join(", ") + "<br/>"
   html += "<b>Parent:</b> " + item.parent + "<br/>"
   html += "<b>Children:</b> " + ((item.children.toString()).split(",")).join(", ")

   $("#dw_details_scroll")[0].innerHTML = html

   OpenDialog(tvi, "#dw_details_TVI")
}
