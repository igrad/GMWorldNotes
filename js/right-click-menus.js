const {Menu, MenuItem} = require('electron').remote

// https://electronjs.org/docs/api/menu
// https://www.tutorialspoint.com/electron/electron_menus.htm
// https://github.com/electron/electron/blob/master/docs/api/menu-item.md


// Set up the RCM for when the user right-clicks on the tree view
var treeViewRCMopts = {
   "Cut": { role: 'cut' },
   "Copy": { role: 'copy' },
   "Paste": { role: 'paste' },
   "div1": { type: 'separator' },
   "New": {
      label: 'New',
      submenu: [ {
            label: 'New Page',
            click() {
               // If this has been called, it means that the user didn't click on an
               // existing item, and this should be added to the first layer under root
               // Create a new page in the notebook
               var newTVI = notebookData.nodeTree.AddNewNode("page", "00000000")

               OpenTVINewNameDialog(newTVI)

               LoadPageToScreen(newTVI, true)
            }
         }, {
            label: 'New Folder',
            click() {
               // Create a new folder in the notebook
               var newTVI = notebookData.nodeTree.AddNewNode("folder", "00000000")

               OpenTVINewNameDialog(newTVI)

               LoadPageToScreen(newTVI, true)
            }
         }
      ]
   }
}

const treeViewRCM = new Menu()
for (var item in treeViewRCMopts) {
   treeViewRCM.append( new MenuItem(treeViewRCMopts[item]) )
}

var callerID = ""

// Set up the RCM for when the user right-clicks on an item in the tree view
var treeViewItemRCMopts = {
   "Select": {
      label: "Select",
      click() {
         // Mark this item as selected in its checkbox
      }
   },
   "Rename": {
      label: "Rename",
      click() {
         var item = $("#" + treeViewItemRCM.callerID)
         while (item.attr("class") != "tree_view_item") {
            item = item.parent()
         }

         OpenTVIRenameDialog(item)
      }
   },
   "MoveUp": {
      label: "Move Up",
      click() {
         // Move the item up one
      }
   },
   "MoveDown": {
      label: "Move Down",
      click() {
         // Move the item down one
      }
   },
   "div1": { type: 'separator' },
   "Assoc": {
      label: "Edit Associations",
      click() {
         // Open up the associations editor
         var item = $("#" + treeViewItemRCM.callerID)
         while (item.attr("class") != "tree_view_item") {
            item = item.parent()
         }

         OpenTVIAssociationsDialog(item, null)
      }
   },
   "ChangeType": {
      label: "Change Type",
      click() {
         // Change from a folder to a page or vice versa
         var item = $("#" + treeViewItemRCM.callerID)
         while (item.attr("class") != "tree_view_item") {
            item = item.parent()
         }

         OpenTVIFlipDialog(item, null)
      }
   },
   "Delete": {
      label: "Delete",
      click() {
         // Open up prompt to confirm deletion
         var item = $("#" + treeViewItemRCM.callerID)
         while (item.attr("class") != "tree_view_item") {
            item = item.parent()
         }

         OpenTVIDeleteDialog(item, null)
      }
   },
   "Details": {
      label: "Show Details",
      click() {
         // Show smaller dialog window to display the item's details
         var tvi = $("#" + treeViewItemRCM.callerID)
         while (tvi.attr("class") != "tree_view_item") { tvi = tvi.parent() }

         OpenTVIDetailsDialog(tvi)
      }
   },
   "div2": { type: 'separator' },
   "New": {
      label: "New",
      submenu: [ {
            label: 'Page',
            click() {
               // Create a new page in the notebook
               var tvi = $("#" + treeViewItemRCM.callerID)

               while (tvi.attr("class") != "tree_view_item") { tvi = tvi.parent() }

               var newTVI = notebookData.nodeTree.AddNewNode("page", tvi.attr("id"))

               OpenTVINewNameDialog(newTVI)
            }
         }, {
            label: 'Folder',
            click() {
               // Create a new folder in the notebook
               var tvi = $("#" + treeViewItemRCM.callerID)

               while (tvi.attr("class") != "tree_view_item") { tvi = item.parent() }

               var newTVI = notebookData.nodeTree.AddNewNode("folder", tvi.attr("id"))

               OpenTVINewNameDialog(newTVI)
            }
         }
      ]
   }
}

const treeViewItemRCM = new Menu()
for (var item in treeViewItemRCMopts) {
   treeViewItemRCM.append( new MenuItem(treeViewItemRCMopts[item]) )
}


// Set up RCM for content view
// Items to add:
// Edit Associations
// Insert: reference, image, link
var contentViewRCMopts = {
   "Cut": { role: 'cut' },
   "Copy": { role: 'copy' },
   "Paste": { role: 'paste' },
   "div1": { type: 'separator' }
}

const contentViewRCM = new Menu()
for (var item in contentViewRCMopts) {
   contentViewRCM.append( new MenuItem(contentViewRCMopts[item]) )
}



var m = new Menu()

m.append(new MenuItem({
   label: "fwdPage",
   accelerator: "CmdOrCtrl+P",
   click: () => {console.log('fwdPage triggered')}
}))
