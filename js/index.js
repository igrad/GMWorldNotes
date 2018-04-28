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



function AddTreeNodeToScreen(id, depth) {
   var node = notebookData.GetNode(id)
   var treeView = $("#tree_view")[0]

   // Add the node itself to the screen
   var indent = (parseInt($("body").css('--treeview-depth-indent')) * (depth - 1)) + "px"

   var insertHTML = "<div class=\"tree_view_item\" id=\"" + id + "\" "
   insertHTML += "onmouseover=\"TreeViewHover(this)\" "
   insertHTML += "onmouseout=\"TreeViewLeaveHover(this)\" "
   insertHTML += "onclick=\"TreeViewSwitch(this)\" "
   insertHTML += "style=\"left: " + indent + "\">" + node.name + "</div>"
   treeView.innerHTML += insertHTML

   // Add the nodes children to the screen by recursively calling this function
   for (var i = 0; i < node.children.length; i++) {
      AddTreeNodeToScreen(node.children[i], depth + 1)
   }
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
   var treeView = $("#tree_view")[0]


   // Clear out the existing contents
   treeView.innerHTML = ""

   // Traverse the linked list/binary tree in order and build each node in memory
   // While doing this, also add each label into the content view
   var key = "0-0"
   var depth = 0
   var rootnode = notebookData.GetNode("0-0")
   var children = rootnode.children

   if (children.length == 0) {
      // Add a new node to the tree, then push it to the screen
   } else {
      for (var i = 0; i < children.length; i++) {
         AddTreeNodeToScreen(children[i], 1)
      }
   }
}



function LoadPageToScreen(id) {
   console.log("Loading page " + id)

   var node = notebookData.GetNode(id)
   var pathtopage = "./pages/" + node.data + ".html"

   $("#content_view_iframe").attr("src", pathtopage)
   lastOpenPage = pathtopage
}



$(document).ready(function() {
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

   //TODO: Verify that this works. The click behavior has already been set in
   // LoadNotebookToScreen, so this should do the trick in loading the page and changing
   // CSS of all of the tree_view_item elements
   $("#" + lastOpenPage).click()

   // Set HTML final touches
   $("#upper_shelf_btn_file").click()
   $(".upper_shelf_btn").attr("isOpen", "false")

   $(".list_view_item").attr("isOpen", "false")
})
