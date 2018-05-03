// App version needs to be set here and in package.json
const appVersion = '0.0.1'

let sessionData
let notebookData

let lastEditTime = new Date()

let lastRunTime = null
let lastRunVersion = null
let lastOpenNotebook = null
let lastOpenPage = null

let defaultSession = {
   LASTRUNTIME: null,
   LASTRUNVERSION: appVersion,
   LASTOPENNOTEBOOK: null,
   LASTOPENPAGE: "blank"
}



function LoadSession() {
   sessionData = new DataStore('session', 'session', defaultSession)

   sessionData.set("LASTRUNTIME", Date.now())

   lastRunTime = sessionData.get("LASTRUNTIME")
   lastRunVersion = sessionData.get("LASTRUNVERSION")
   lastOpenNotebook = sessionData.get("LASTOPENNOTEBOOK")
   lastOpenPage = sessionData.get("LASTOPENPAGE")

   console.log("=====SESSION DATA=====")
   console.log("Last run time: " + lastRunTime)
   console.log("Last run version: " + lastRunVersion)
   console.log("Last open notebook: " + lastOpenNotebook)
   console.log("Last open page: " + lastOpenPage)
   console.log("======================")
}



function SetLastOpenNoteBook (notebookID) {
   sessionData.set("LASTOPENNOTEBOOK", notebookID)
}



function SetLastOpenPage (pageID) {
   lastOpenPage = pageID
   sessionData.set("LASTOPENPAGE", pageID)
}



function LoadFileData (filepath) {
   const fs = require('fs')

   try {
      var dat = fs.readFileSync(filepath)
      return dat.toString()
   } catch (error) {
      console.log("Could not load file " + filepath)
   }
}



function SaveFileData (filepath, data) {
   const fs = require('fs')

   try {
      fs.writeFileSync(filepath, data)
   } catch (error) {
      console.log("Could not save data to file " + filepath)
   }
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



function LoadNotebookToScreen(id) {

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

   console.log("Load notebook to screen")
   SetLastOpenNoteBook(id)
}



function LoadPageToScreen(id) {
   console.log("Loading page " + id)
   
   var pathtopage = "./pages/" + id + ".html"

   SetLastOpenPage(id)

   var pageData = LoadFileData(pathtopage)

   console.log("Loading page from " + pathtopage)

   $("#content_view")[0].innerHTML = pageData
}



function SavePageToFile(id) {
   console.log("Saving page " + id + " to file")
   var pathtopage = "./pages/" + id + ".html"
   var pageData = $("#content_view")[0].innerHTML

   SaveFileData(pathtopage, pageData)
}
