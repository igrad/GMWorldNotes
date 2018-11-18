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
         activeTVIAssocs = notebookData.GetNode(activeID).associations
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

// dw_name_new_TVI functions
function OpenTVINewNameDialog(newNodeID) {
   activeID = newNodeID
   if (OpenDialog(null, "#dw_name_new_TVI", "New Page")) {
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

   node.name = newName
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

      var checked = $("#dw_associations_scroll [state='checked']")
      var newAssocs = []
      for (var i = 0; i < checked.length; i++) {
         newAssocs.push(checked[i].id.substring(2))
      }

      node.associations = newAssocs
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
   var depth = GetDepthFromID(id)
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
      html += "onclick='event.stopPropagation(); ToggleFolderCollapse(this)' isopen='true' style='position:relative;left:" + (indent - 4) + "px'>"
      html += "<div id='a_" + id + "_open' class='tree_view_item_open'>"
      html += "<svg id='a_" + id + "_open_img' class='tree_view_item_open_img' width='16' height='16' viewBox='0 0 16 16'><path fill='currentColor' d='M4.957 5.543l-1.414 1.414 4.457 4.457 4.457-4.457-1.414-1.414-3.043 3.043z'></path></svg></div>"
      html += "<div id='a_" + id + "_closed' class='tree_view_item_closed' style='display:none'>"
      html += "<svg id='a_" + id + "_closed_img' class='tree_view_item_closed_img' width='16' height='16' viewBox='0 0 16 16'><path fill='currentColor' d='M5.543 11.043l1.414 1.414 4.457-4.457-4.457-4.457-1.414 1.414 3.043 3.043z'></path></svg></div></div>"
      html += "<div class='tree_view_item_inner' id='a_" + id + "_inner' "
      html += "style='position:relative;left:" + indent + "px;width:calc(100% - " + widthFix + "px)'>" + name + "</div></div>"
   } else {
      html += "<div class='tree_view_item_inner' id='a_" + id + "_inner' "
      html += "style='left:" + widthFix
      html += "px; width:calc(100% - " + widthFix + "px)'>" + name + "</div></div>"
   }

   return html
}

async function AddATVIToScreen(id, builder) {
   var node = notebookData.GetNode(id)
   var builder = ""

   var depth = GetDepthFromID(id)

   // Add the node itself to the screen
   if (depth != 0) {
      var insertHTML = CreateNewATVI(id, node.name, node.type)

      builder += insertHTML
   }

   // Add the nodes children to the screen by recursively calling this function
   if (node.children.length > 0) {
      builder += "<div id='a_" + id + "_children'>"
      for (var i = 0; i < node.children.length; i++) {
         builder += await AddATVIToScreen(node.children[i], builder)
      }
      builder += "</div>"
   }

   if (id == "0-0") $("#dw_associations_scroll")[0].innerHTML = builder

   return builder
}

function LoadNotebookToAssociations() {
   // Load the nodes into the tree view
   // Get the tree view object
   var treeView = $("#dw_associations_scroll")[0]

   // Clear out the existing contents
   treeView.innerHTML = ""

   // Traverse the linked list/binary tree in order and build each node in memory
   // While doing this, also add each label into the content view
   console.log("Loading tree")

   AddATVIToScreen("0-0", "")
}
