var currentStyles = []

function ToggleTagAtSelection (tag) {
   document.execCommand(tag)
}



function GetActiveTagsAtAnchor () {
   // Get the parent node of the anchor's (start of the selection) position
   var pnode = getSelection().anchorNode.parentNode
   var styles = []

   while (pnode.id != "content_view") {
      styles.push(pnode.tagName)
      pnode = pnode.parentNode
   }

   return styles
}



function CheckStyleAtAnchor () {
   // This is what sets the "active" state of all text styling buttons when the cursor is moved to a new position. If the new position of the anchor is in a field with bold and italics applied, then only those buttons need to be active in the shelf.

   // Get the tags that need to be applied at the new anchor position
   var styles = GetActiveTagsAtAnchor()

   // Go through the list of styles to be applied and see which ones are already set or need to be set
   for (var i = 0; i < styles.length; i++) {
      var style = styles[i]

      if (! currentStyles.includes(style)) {
         // If the currently-applied styles do not include the styles that need to be applied, then that style needs to be activated
         switch (style) {
            case "B":
               ApplyFontStyle($("#menu_text_bold_btn")[0], false)
               break
            case "I":
               ApplyFontStyle($("#menu_text_italic_btn")[0], false)
               break
            case "U":
               ApplyFontStyle($("#menu_text_uline_btn")[0], false)
               break
         }
      }
   }

   // Go through the list of currentStyles and see which ones need to be removed if they don't already exist in the new styles list
   for (var i = 0; i < currentStyles.length; i++) {
      var style = currentStyles[i]

      if (! styles.includes(style)) {
         // If the currently-applied styles do not include the styles that need to be applied, then that style needs to be activated
         switch (style) {
            case "B":
               ApplyFontStyle($("#menu_text_bold_btn")[0], false)
               break
            case "I":
               ApplyFontStyle($("#menu_text_italic_btn")[0], false)
               break
            case "U":
               ApplyFontStyle($("#menu_text_uline_btn")[0], false)
               break
         }
      }
   }

   // Find a way to check font style and size and color at anchor cursor, check those
   // here along with simple font styles


   // Apply this at the end
   currentStyles = styles
}



function ApplyFontStyle (caller, makeEdit = true) {
   if ($(caller).attr("isOpen") == "true") {
      caller.classList.remove("isActive")
      $(caller).attr("isOpen", "false")
   } else {
      caller.classList.add("isActive")
      $(caller).attr("isOpen", "true")
   }

   if (makeEdit) {
      switch ($(caller)[0].innerText) {
         case "B":
            ToggleTagAtSelection('bold')
            break
         case "I":
            ToggleTagAtSelection('italic')
            break
         case "U":
            ToggleTagAtSelection('underline')
            break
      }
   }
}
