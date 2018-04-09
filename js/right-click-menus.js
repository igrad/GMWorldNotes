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
   },
   5: {
      label: 'Associations',
      click() {
         // Open associations menu
      }
   }
}

const treeViewRCM = new Menu()
for (var i = 0; i < 6; i++) {
   treeViewRCM.append( new MenuItem(treeViewRCMopts[i]) )
}


// Set up RCM for content pane
var contentPaneRCM = {

}


// Add event listeners to the appropriate divs on the screen so that they can each
// reply with the proper RCM when called
$(document).ready(function() {
   $("#tree_view").contextmenu(function(e) {
      e.preventDefault()
      treeViewRCM.popup(remote.getCurrentWindow())
   })
})
