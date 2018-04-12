const {remote} = require('electron')
const {Menu, MenuItem} = remote

// https://electronjs.org/docs/api/menu
// https://www.tutorialspoint.com/electron/electron_menus.htm
// https://github.com/electron/electron/blob/master/docs/api/menu-item.md


// Set up the RCM for when the user right-clicks on the tree view
var treeViewRCMopts = {
   0: { role: 'cut' },
   1: { role: 'copy' },
   2: { role: 'paste' },
   3: { type: 'separator' },
   4: {
      label: 'New',
      submenu: [ {
            label: 'New Page',
            click() {
               // Create a new page in the notebook
            }
         }, {
            label: 'New Folder',
            click() {
               // Create a new folder in the notebook
            }
         }
      ]
   }
}

const treeViewRCM = new Menu()
for (var item in treeViewRCMopts) {
   treeViewRCM.append( new MenuItem(treeViewRCMopts[item]) )
}

// Set up the RCM for when the user right-clicks on an item in the tree view
var treeViewItemRCMopts = {
   0: { role: 'cut' },
   1: { role: 'copy' },
   2: { role: 'paste' },
   3: { type: 'separator' },
   4: {
      label: "Rename",
      click() {
         // Open prompt to rename this node
      }
   },
   5: {
      label: "Move",
      click() {
         // Let the user select where they want to move this item to
      }
   },
   6: {
      label: "Edit Associations",
      click() {
         // Open up the associations editor
      }
   },
   7: {
      label: "Delete",
      click() {
         // Open up prompt to confirm deletion
      }
   },
   8: { type: 'separator' },
   9: {
      label: "New",
      submenu: [ {
            label: 'New Page',
            click() {
               // Create a new page in the notebook
            }
         }, {
            label: 'New Folder',
            click() {
               // Create a new folder in the notebook
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
var contentViewRCM = {
   0: { role: 'cut' },
   1: { role: 'copy' },
   2: { role: 'paste' },
   3: { type: 'separator' }
}

const contentViewRCM = new Menu()
for (var item in contentViewRCMopts) {
   contentViewRCM.append( new MenuItem(contentViewRCMopts[item]) )
}
