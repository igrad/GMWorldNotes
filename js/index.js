function ShelfHover(caller) {
   if($(caller).attr("isOpen") == "false") {
      $(caller).css({"background-color": "var(--shelf-top-bg-color-hover)",
         "color": "var(--shelf-top-font-color-hover)"})
   }
}



function ShelfLeaveHover(caller) {
   if($(caller).attr("isOpen") == "false") {
      $(caller).css({"background-color": "var(--shelf-top-bg-color)",
         "color": "var(--shelf-top-font-color)"})
   }
}



function ShelfSwitch(caller) {
   var caller = $(caller)

   $(".upper_shelf_btn").attr("isOpen", "false")

   $(caller).attr("isOpen", "true")

   $(".upper_shelf_btn").css("background-color", "var(--shelf-top-bg-color)")
   $(".upper_shelf_btn").css("color", "var(--shelf-top-font-color)")

   $(caller).css("background-color", "var(--shelf-top-bg-color-open)")
   $(caller).css("color", "var(--shelf-top-font-color-hover)")

   $(".lower_shelf_iframe").hide()
   $("#" + caller.attr("frame")).show()
}



function LoadNotebookToScreen() {

   // TODO: Wrap all of this in a try-catch

   // Order of events
   // 1. Load the theme of the notebook onto screen
   // 2. Load the nodes into tree view

   // Load the theme of the notebook onto screen
   // Get the currently-loaded theme's outer HTML string
   var linkTheme = $("#link_theme")[0]
   var linkThemeText = linkTheme.outerHTML

   // Isolate just the file name of the current theme
   var currentTheme = linkThemeText.substring((linkThemeText.indexOf("/") + 1), (linkThemeText.indexOf(".css")))

   // Replace the current theme with the new theme of notebook being loaded
   linkTheme.outerHTML = linkThemeText.replace(currentTheme, notebookData.theme)


   // Load the nodes into the tree view
   // Get the tree view object
   var treeView = $("#tree_view")


   // Clear out the existing contents

   // Traverse the linked list/binary tree in order and build each node in memory
   // While doing this, also add each label into the content view

   // Make sure that there's a setting for how far each tab is indented. This should be included in the global style settings as well as in the theme, because the tree view font may be different for different notebooks, and people might want to adjust that tab distance.
}



function LoadPageToScreen(pathtopage) {
   console.log("Loading page")
   $("#content_view_iframe").attr("src", pathtopage)
   currentPage = pathtopage
}



$(document).ready(function() {
   // Set HTML final touches
   $(".upper_shelf_btn").attr("isOpen", "false")

   // Set up context menus
   $("#tree_view").contextmenu(function(e) {
      e.preventDefault()
      treeViewRCM.popup(remote.getCurrentWindow())
   })

   $("#tree_view_item").contextmenu(function(e) {
      e.preventDefault()
      treeViewItemRCM.popup(remote.getCurrentWindow())
   })

   $("#content_view_iframe").contents().find("body").contextmenu(function(e) {
      e.preventDefault()
      contentViewRCM.popup(remote.getCurrentWindow())
   })

   // Load data
   console.log("Document is ready. Loading session.")
   LoadSession()
   notebookData = new Notebook(lastOpenNotebook)

   LoadNotebookToScreen()
   LoadPageToScreen(lastOpenPage)
})
