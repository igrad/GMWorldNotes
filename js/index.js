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
