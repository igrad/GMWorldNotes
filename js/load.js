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



function CreateNewTreeViewItem(id, name, type) {
   var depth = GetDepthFromID(id)

   var indent = parseInt($("body").css('--treeview-depth-indent')) * (depth - 1)
   var collapserWidth = parseInt($("body").css('--treeview-item-collapser-width'))

   var widthFix = indent + collapserWidth

   var html = "<div class='tree_view_item' id='" + id + "' "
   html += "onmouseover='TreeViewHover(this)' "
   html += "onmouseout='TreeViewLeaveHover(this)' "
   html += "onclick='TreeViewSwitch(this)'>"

   if (type == "folder") {
      html += "<div id='" + id + "-collapser' class='tree_view_item_collapser' "
      html += "onclick='ToggleFolderCollapse(this)'>"
      html += "<div id='open'>"
      html += "<svg width='16' height='16' viewBox='0 0 16 16'><path fill='currentColor' d='M5.543 11.043l1.414 1.414 4.457-4.457-4.457-4.457-1.414 1.414 3.043 3.043z'></path></svg></div>"
      html += "<div id='closed' style='display:none'>"
      html += "<svg width='16' height='16' viewBox='0 0 16 16'><path fill='currentColor' d='M4.957 5.543l-1.414 1.414 4.457 4.457 4.457-4.457-1.414-1.414-3.043 3.043z'></path></svg></div></div>"
   }
   html += "<div class='tree_view_item_inner' id='" + id + "' "
   html += "style='left:" + ((type == "folder") ? indent : widthFix)
   html += "px; width:calc(100% - " + widthFix + "px)'>" + name + "</div></div>"

   return html
}



async function AddTreeNodeToScreen(id) {
   var node = notebookData.GetNode(id)
   var treeView = $("#tree_view")[0]

   var depth = GetDepthFromID(id)

   // Add the node itself to the screen
   if (depth != 0) {
      var insertHTML = CreateNewTreeViewItem(id, node.name, node.type)

      treeView.innerHTML += insertHTML
   }

   // Add the nodes children to the screen by recursively calling this function
   for (var i = 0; i < node.children.length; i++) {
      await AddTreeNodeToScreen(node.children[i])
   }
}



function LoadThemeToScreen() {
   // Load the theme of the notebook onto screen
   // Get the currently-loaded theme's outer HTML string
   var linkTheme = $("#link_theme")[0]
   var linkThemeText = linkTheme.outerHTML

   // Isolate just the file name of the current theme
   var currentTheme = linkThemeText.substring((linkThemeText.indexOf("/") + 1), (linkThemeText.indexOf(".css")))

   // Replace the current theme with the new theme of notebook being loaded
   linkTheme.outerHTML = linkThemeText.replace(currentTheme, notebookData.theme)
}



function LoadNotebookToScreen(id) {
   // Load the nodes into the tree view
   // Get the tree view object
   var treeView = $("#tree_view")[0]

   // Clear out the existing contents
   treeView.innerHTML = ""

   // Traverse the linked list/binary tree in order and build each node in memory
   // While doing this, also add each label into the content view
   console.log("Loading tree")

   AddTreeNodeToScreen("0-0").then(function (result) {
      $(".tree_view_item").contextmenu(function(e) {
         e.preventDefault()
         console.log(e.target.id)

         treeViewItemRCM.callerID = e.target.id
         treeViewItemRCM.popup(remote.getCurrentWindow())
      })
   })

   SetLastOpenNoteBook(id)
   console.log("Loaded notebook to screen")
}



function LoadPageToScreen(id) {
   console.log("Loading page " + id)

   var pathtopage = "./pages/" + id + ".html"

   SetLastOpenPage(id)

   var pageData = LoadFileData(pathtopage)

   $("#content_view")[0].innerHTML = pageData
}



function SavePageToFile(id) {
   console.log("Saving page " + id + " to file")
   var pathtopage = "./pages/" + id + ".html"
   var pageData = $("#content_view")[0].innerHTML

   SaveFileData(pathtopage, pageData)
}
