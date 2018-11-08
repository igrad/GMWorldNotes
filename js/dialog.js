// dw_rename_TVI functions

function OpenTVIRenameDialog(caller) {
   if ($("#dw_rename_TVI").css("display").includes("none")) {
      $("#dw_rename_TVI").css("display", "inline-block")
   } else {
      $("#dw_rename_TVI").css("display", "none")
   }
}

function CatchKeysTVIRename(e) {
   console.log("Pressed " + e.keycode)
   switch (e.keycode) {
      case 13: // Enter pressed
         void()
   }
}
