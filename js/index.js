const {ipcRenderer} = require('electron')
const remote = require('electron').remote

let pageHistory = []
let pageIndex = -1

var saveQueued = false



function AddToPageHistory(pageID) {
   // If we're currently back a few pages, then overwrite the "forward" history
   if (pageIndex != (pageHistory.length - 1)) {
      pageHistory.splice(pageIndex + 1, pageHistory.length - (pageIndex + 1))
   }

   if (pageHistory.length >= 20) {
      // Remove the oldest item
      pageHistory.splice(0, 1)
   }

   pageHistory.push(pageID)
}



function FlipPage(increment) {
   var oldPageIndex = pageIndex
   pageIndex += increment
   if (pageIndex < 0) {
      pageIndex = 0
      return false
   }

   if (pageIndex > 19) {
      pageIndex = 19
      return false
   } else if (pageIndex > (pageHistory.length - 1)) {
      pageIndex = (pageHistory.length - 1)
   }

   if (pageIndex != oldPageIndex) {
      TreeViewSwitch($("#" + pageHistory[pageIndex])[0], true)
      return true
   }

   return false
}



function ClearPageHistoryAfterIndex() {
   var length = pageHistory.length

   if (pageIndex == length - 1) { return false }
   else { pageHistory.splice(pageIndex, length - pageIndex) }
}



// Window functions
function MinimizeWindow() {
   (remote.getCurrentWindow()).minimize()
}

function MaximizeWindow() {
   var window = (remote.getCurrentWindow())
   if (window.isMaximized()) {
      window.unmaximize()
   } else {
      window.maximize()
   }
}

function ExitApplication() {
   (remote.getCurrentWindow()).close()
   window.close()
}



// Helper function for ContentEdited function
async function sleep (ms) {
   return new Promise(resolve => setTimeout(resolve, ms))
}



async function ShowSaveNotification(pageID) {
   var savenote = $("#save_notification")

   savenote[0].innerText = "Saving \"" + (notebookData.GetNodeName(pageID)) + "\""
   savenote.fadeOut(0)
   savenote.fadeIn(200)

   await sleep(1200)
   savenote.fadeOut(200)
}



async function ContentEdited() {
   var tEdit = Date.now()
   saveQueued = true
   lastEditTime  = tEdit
   await sleep(1000)

   // If the last edit time is still the same time as when this function was called,
   // then this edit was the last edit made before the user paused. Save data to file.
   if ((lastEditTime == tEdit) && saveQueued) {
      saveQueued = false
      SavePageToFile(lastOpenPage)
      ShowSaveNotification(lastOpenPage)
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
   LoadNotebookToAssociations(lastOpenNotebook)

   // Set HTML final touches
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

   // Select the page that was open last time this notebook was closed
   $("#" + lastOpenPage).click()

   // Configure shortcut events
   ipcRenderer.on('FlipPageForward', () => { FlipPage(1) })
   ipcRenderer.on('FlipPageBack', () => { FlipPage(-1) })
})



// Call some data initialization functions
const SystemFonts = require('system-font-families').default
const sysFonts = new SystemFonts()
CreateFontFamilyOptions()



// Create application menu
const appMenuTemplate = [
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
   },
   {
      label: 'Shortcuts',
      submenu: [
         {
            label: "Flip page forward",
            accelerator: "Alt+Right",
            click() { FlipPage(1) }
         },
         {
            label: "Flip page back",
            accelerator: "Alt+Left",
            click() { FlipPage(-1) }
         }
      ]
   }
]

const appMenu = Menu.buildFromTemplate(appMenuTemplate)
Menu.setApplicationMenu(appMenu)



function CloseDropDowns() {
   $(".drop_down").each(function(i) {
      if ($(this).attr("isOpen") == "true") {
         $("[dropmenu='" + this.id + "']").each(function (i) {
            if (this.classList.contains("isActive")) {
               ToggleDD(this)
            }
         })
      }
   })
}
