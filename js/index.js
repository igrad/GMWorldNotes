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

   $(".lower_shelf_menu").hide()
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
      $("#resize_bar").css("left", $("#tree_view").css("width"))
   }
}



$(window).on('load', function() {
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

   // Load data
   console.log("Document is ready. Loading session.")
   LoadSession()

   notebookData = new Notebook(lastOpenNotebook)
   notebookData.UpdateDS()
   LoadThemeToScreen()
   LoadNotebookToScreen(lastOpenNotebook)

   // Select the page that was open last time this notebook was closed
   $("#" + lastOpenPage).click()

   // Set HTML final touches
   $("#upper_shelf_btn_file").click()
   $(".upper_shelf_btn").attr("isOpen", "false")

   $(".list_view_item").attr("isOpen", "false")

   $("#lower_shelf_viewport button").attr("isOpen", "false")
})



$(document).ready(function () {
   // Set the text shelf menu to be opened by default instead of file
   $("#upper_shelf_btn_text").click()

   // Make all document style edits using CSS instead of HTML tags
   document.execCommand("styleWithCSS", false, true)

   // Set the default colors for the font and background in text shelf menu
   SetTextColorButtonUnderlineColor(null)
   SetHighlightColorButtonUnderlineColor(null)
})



// Call some data initialization functions
const SystemFonts = require('system-font-families').default
const sysFonts = new SystemFonts()
CreateFontFamilyOptions()



function CloseDropDowns() {
   $(".drop_down").each(function(i) {
      if($(this).attr("isOpen") == "true") {
         let owner = $("#" + $(this).attr("owner"))
         owner.click()
      }
   })
}
