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



function TreeViewHover(caller) {
   if($(caller).attr("isOpen") == "false") {
      $(caller).css({"background-color": "var(--treeview-item-bg-color-hover)",
         "color": "var(--treeview-item-font-color-hover)"})
   }
}


function TreeViewLeaveHover(caller) {
   if($(caller).attr("isOpen") == "false") {
      $(caller).css({"background-color": "var(--treeview-item-bg-color)",
         "color": "var(--treeview-item-font-color)"})
   }
}


function TreeViewSwitch(caller) {
   var caller = $(caller)

   $(".tree_view_item").attr("isOpen", "false")
   $(".tree_view_item").css("background-color", "var(--treeview-item-bg-color)")
   $(".tree_view_item").css("color", "var(--treeview-item-font-color)")

   $(caller).attr("isOpen", "true")
   $(caller).css("background-color", "var(--treeview-item-bg-color-active)")
   $(caller).css("color", "var(--treeview-item-font-color-active)")

   // Call up the node that has been selected from the tree view
   console.log("node id = " + caller.attr("id"))
   LoadPageToScreen(caller.attr("id"))
}



// Helper function for ContentEdited function
async function sleep (ms) {
   return new Promise(resolve => setTimeout(resolve, ms))
}



async function ShowSaveNotification() {
   var savenote = $("#save_notification")
   savenote.fadeOut(0)
   savenote.fadeIn(200)

   await sleep(1200)
   savenote.fadeOut(200)
}


async function ContentEdited() {
   var tEdit = Date.now()
   lastEditTime  = tEdit
   await sleep(1000)

   // If the last edit time is still the same time as when this function was called,
   // then this edit was the last edit made before the user paused. Save data to file.
   if (lastEditTime == tEdit) {
      SavePageToFile(lastOpenPage)
      ShowSaveNotification()
   }
}



$(document).ready(function() {
   // Load data
   console.log("Document is ready. Loading session.")
   LoadSession()

   notebookData = new Notebook(lastOpenNotebook)
   notebookData.UpdateDS()
   LoadNotebookToScreen(lastOpenNotebook)

   //TODO: Verify that this works. The click behavior has already been set in
   // LoadNotebookToScreen, so this should do the trick in loading the page and changing
   // CSS of all of the tree_view_item elements
   $("#" + lastOpenPage).click()

   // Set HTML final touches
   $("#upper_shelf_btn_file").click()
   $(".upper_shelf_btn").attr("isOpen", "false")

   $(".list_view_item").attr("isOpen", "false")

   // Set up context menus
   $("#tree_view").contextmenu(function(e) {
      // Prevent the tree_view context menu from opening when a context menu for a
      // tree_view_item is supposed to be displayed
      if (e.currentTarget != e.target) { return }
      e.preventDefault()
      treeViewRCM.popup(remote.getCurrentWindow())
   })

   $("#content_view").contextmenu(function(e) {
      e.preventDefault()
      contentViewRCM.popup(remote.getCurrentWindow())
   })
})
