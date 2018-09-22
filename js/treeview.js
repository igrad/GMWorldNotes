function ToggleFolderCollapse(caller) {
   var collapseButton = $(caller)
   var item = $(collapseButton[0].parentNode)

   var nodeItem = notebookData.GetNode(item[0].id)
   for (var i = 0; i < nodeItem.children.length; i++) {
      var child = nodeItem.children[i]

      if (collapseButton.attr("isOpen") == "true") {
         $("#" + child.id).css("display", "none")
      } else {
         $("#" + child.id).css("display", "inline-block")
      }
   }
}
