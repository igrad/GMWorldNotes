// dw_rename_TVI functions

function OpenTVIRenameDialog() {
   if ($("#dw_rename_TVI").css("display").includes("none")) {
      $("#dw_rename_TVI").css("display", "inline-block")
   } else {
      $("#dw_rename_TVI").css("display", "none")
   }
}

function CatchKeysTVIRename(e) {
   console.log("Pressed " + e.keyCode)
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
