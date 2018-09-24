function ToggleFolderCollapse(caller) {
   var collapseButton = $(caller)
   var openVal = collapseButton.attr("isopen")
   var childItemsContainer = $("#" + caller.parentNode.id + "_children")

   var openIcon = $("#" + caller.id + " #open")
   var closedIcon = $("#" + caller.id + " #closed")

   if (openVal == "true") {
      childItemsContainer.css("display", "none")
      collapseButton.attr("isopen", "false")

      openIcon.css("display", "none")
      closedIcon.css("display", "block")
   } else {
      childItemsContainer.css("display", "block")
      collapseButton.attr("isopen", "true")

      openIcon.css("display", "block")
      closedIcon.css("display", "none")
   }
}
