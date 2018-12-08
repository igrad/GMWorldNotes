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
