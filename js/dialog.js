var openDialogWindow = null

function OpenDialog(dialogID) {
   if ($(dialogID).css("display") == "none") {
      // Check if another dialog is already open
      if (openDialogWindow != null) {
         OpenDialog(openDialogWindow)
      }

      $(dialogID).css("display", "inline-block")
      openDialogWindow = dialogID
   } else {
      $(dialogID).css("display", "none")
      openDialogWindow = null
   }

   // If the dialog mentioned is now the open dialog window, return true
   return openDialogWindow == dialogID
}

// dw_rename_TVI functions
function OpenTVIRenameDialog() {
   if (OpenDialog("#dw_rename_TVI")) {
      // Automatically clear and focus the input
      $("#dw_rename_TVI input")[0].value = ""
      $("#dw_rename_TVI input").focus()
   }
}

function CatchKeysTVIRename(e) {
   switch (e.keyCode) {
      case 13: // Enter pressed
         OpenTVIRenameDialog()
         // Rename the TVI
         break
      case 27: // Escape Pressed
         OpenTVIRenameDialog()
         break
   }
}



// dw_associations_TVI functions
function OpenTVIAssociationsDialog(inputConfirmed) {
   if (OpenDialog("#dw_associations_TVI")) {
      // Automatically clear and focus the input
      $("#dw_associations_TVI input")[0].value = ""
      $("#dw_associations_TVI input").focus()
   }

   if (inputConfirmed) {
      // Make changes based on edited content
   }
}
