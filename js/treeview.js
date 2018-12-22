function ToggleFolderCollapse(caller) {
   var collapseButton = $(caller)
   var openVal = collapseButton.attr("isopen")
   var childItemsContainer = $("#" + caller.parentNode.id + "_children")
   var parent = $("#" + caller.parentNode.id)

   var openIcon = $("#" + caller.id + " .tree_view_item_open")
   var closedIcon = $("#" + caller.id + " .tree_view_item_closed")

   if (openVal == "true") {
      childItemsContainer.css("display", "none")
      collapseButton.attr("isopen", "false")

      openIcon.css("display", "none")
      closedIcon.css("display", "block")

      parent.css("border-bottom", "1px solid var(--treeview-item-collapser-border-closed)")
   } else {
      childItemsContainer.css("display", "block")
      collapseButton.attr("isopen", "true")

      openIcon.css("display", "block")
      closedIcon.css("display", "none")
      parent.css("border-bottom", "")
   }
}



function TreeViewHover(caller) {
   if ($(caller).attr("isOpen") == "false") {
      $(caller).css({"background-color": "var(--treeview-item-bg-color-hover)",
         "color": "var(--treeview-item-font-color-hover)"})
   }
}



function TreeViewLeaveHover(caller) {
   if ($(caller).attr("isOpen") == "false") {
      $(caller).css({"background-color": "var(--treeview-item-bg-color)",
         "color": "var(--treeview-item-font-color)"})
   }
}



function TreeViewSwitch(caller, keepIndex = false) {
   var item = $(caller)

   if (item.attr("type") == "folder") {
      var collapser = $("#" + caller.id + " .tree_view_item_collapser")

      if ((collapser.css("background-color")).includes("hover")) {return false}
   }

   $(".tree_view_item").attr("isOpen", "false")
   $(".tree_view_item").css("background-color", "var(--treeview-item-bg-color)")
   $(".tree_view_item").css("color", "var(--treeview-item-font-color)")

   $(item).attr("isOpen", "true")
   $(item).css("background-color", "var(--treeview-item-bg-color-active)")
   $(item).css("color", "var(--treeview-item-font-color-active)")

   // Call up the node that has been selected from the tree view
   LoadPageToScreen(item.attr("id"), keepIndex)
}



let resizing = false
function StartResizingTreeView (e) {
   // Allow the other resize functions to operate
   resizing = true

   // Set the content_view to disallow edits so that resizing the tree_view
   // too quickly doesn't accidentally highlight the content
   $("#content_view").attr("contenteditable", false)

   // Set the global cursor to the resize cursor so that resizing too quickly
   // doesn't make the cursor flip between different styles rapidly
   $("#tree_view").css("pointer-events", "none")
   $("#shelf_view").css("pointer-events", "none")
   $("body").css("cursor", "ew-resize")
}



function DoneResizingTreeView () {
   if (resizing) {
      // Revert everything set in StartResizingTreeView
      resizing = false

      $("#content_view").attr("contenteditable", true)

      $("body").css("cursor", "inherit")
      $("#tree_view").css("pointer-events", "all")
      $("#shelf_view").css("pointer-events", "all")
   }
}



function ResizingTreeView (e) {
   if (resizing) {
      // Get the current X position of the mouse and assign it to the width of
      // the tree view
      $("#content_view_wrap").css("width", (parseInt($("body").css("width")) - e.clientX) + "px")
      $("#tree_view").css("width", e.clientX + "px")

      // Copy-paste the width of tree_view to the X position of the resize_bar
      // so that we don't have to do any math for the tree_view's min and max
      // boundaries - they will address themselves during the above operation
      $("#resize_bar").css("left", $("#tree_view").outerWidth() + "px")
   }
}
