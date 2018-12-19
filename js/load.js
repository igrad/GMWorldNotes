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
   console.log("Last run time: " + (new Date(lastRunTime)).toString())
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
   AddToPageHistory(pageID)
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
   var depth = notebookData.GetNodeDepth(id)

   var indent = parseInt($("body").css('--treeview-depth-indent')) * (depth - 1)
   var collapserWidth = parseInt($("body").css('--treeview-item-collapser-width'))

   var widthFix = indent + collapserWidth

   var html = "<div class='tree_view_item' type='" + type + "' id='" + id + "' "
   html += "onmouseover='TreeViewHover(this)' "
   html += "onmouseout='TreeViewLeaveHover(this)' "
   html += "onclick='TreeViewSwitch(this)'>"

   if (type == "folder") {
      html += "<div id='" + id + "_collapser' class='tree_view_item_collapser' "
      html += "onclick='ToggleFolderCollapse(this); event.stopPropagation();' isopen='true' style='position:relative;left:" + (indent - 4) + "px'>"
      html += "<div id='" + id + "_open' class='tree_view_item_open'>"
      html += "<svg id='" + id + "_open_img' class='tree_view_item_open_img' width='16' height='16' viewBox='0 0 16 16'><path fill='currentColor' d='M4.957 5.543l-1.414 1.414 4.457 4.457 4.457-4.457-1.414-1.414-3.043 3.043z'></path></svg></div>"
      html += "<div id='" + id + "_closed' class='tree_view_item_closed' style='display:none'>"
      html += "<svg id='" + id + "_closed_img' class='tree_view_item_closed_img' width='16' height='16' viewBox='0 0 16 16'><path fill='currentColor' d='M5.543 11.043l1.414 1.414 4.457-4.457-4.457-4.457-1.414 1.414 3.043 3.043z'></path></svg></div></div>"
      html += "<div class='tree_view_item_inner' id='" + id + "_inner' "
      html += "style='position:relative;left:" + indent + "px;width:calc(100% - " + widthFix + "px)'>" + name + "</div></div>"
   } else {
      html += "<div class='tree_view_item_inner' id='" + id + "_inner' "
      html += "style='left:" + widthFix
      html += "px; width:calc(100% - " + widthFix + "px)'>" + name + "</div></div>"
   }

   return html
}



async function AddTreeNodeToScreen(id, builder) {
   var node = notebookData.GetNode(id)
   var builder = ""

   var depth = notebookData.GetNodeDepth(id)

   // Add the node itself to the screen
   if (depth != 0) {
      var insertHTML = CreateNewTreeViewItem(id, node.name, node.type)

      builder += insertHTML
   }

   // Add the nodes children to the screen by recursively calling this function
   if (node.children.length > 0) {
      builder += "<div id='" + id + "_children'>"
      for (var i = 0; i < node.children.length; i++) {
         builder += await AddTreeNodeToScreen(node.children[i], builder)
      }
      builder += "</div>"
   }

   if (id == "00000000") $("#tree_view")[0].innerHTML = builder

   return builder
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

   AddTreeNodeToScreen("00000000", "").then(function (result) {
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

   SetLastOpenPage(id)

   var pageData = LoadFileData("./pages/" + id + ".html")
   $("#content_view")[0].innerHTML = pageData

   pageIndex++
}



function SavePageToFile(id) {
   console.log("Saving page " + id + " to file")

   var pageData = $("#content_view")[0].innerHTML
   SaveFileData("./pages/" + id + ".html", pageData)
}
