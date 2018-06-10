function SetTextColorButtonUnderlineColor (newColor) {
   if (!newColor) newColor = "var(--contentview-font-color)"

   var button = $("#menu_text_fcolor_btn #text_color")

   button.css("box-shadow", "inset 0 -2px 0 " + newColor)
   button.attr("setColor", newColor)
}



function SetHighlightColorButtonUnderlineColor (newColor) {
   if (!newColor) newColor = "var(--contentview-bg-color)"

   var button = $("#menu_text_bcolor_btn #highlight_color")
   button.css("background-color", newColor)
   button.attr("setColor", newColor)
}



function GetActiveStylesAtAnchor () {
   // Get the parent node of the anchor's (start of the selection) position
   var allStyles = getSelection().anchorNode.parentNode.style
   var styles = {}

   for (var i = 0; i < allStyles.length; i++) {
      var style = allStyles[i]
      if (style) styles[style] = allStyles[style]
      else break
   }

   return styles
}



function SetStyleButtonState (buttonID, newStatus) {
   var button = $("#" + buttonID)
   if ((button.attr("isOpen")) && (!newStatus)) {
      button[0].classList.remove("isActive")
      button.attr("isOpen", "false")
   }
   if ((!button.attr("isOpen")) && (newStatus)) {
      button[0].classList.add("isActive")
      button.attr("isOpen", "true")
   }
}



function CheckStyleAtAnchor () {
   // This is what sets the "active" state of all text styling buttons when the cursor is moved to a new position. If the new position of the anchor is in a field with bold and italics applied, then only those buttons need to be active in the shelf.

   // Get the CSS styles that need to be shown for the new anchor position
   var styles = GetActiveStylesAtAnchor()

   // Go through the list of toggled styles and see which ones are active
   var triggers = {
      "font-style": ["italic", "menu_text_italic_btn"],
      "font-weight": ["bold", "menu_text_bold_btn"],
      "text-decoration-line": ["underline", "menu_text_uline_btn"]
   }

   for (trigger in triggers) {
      var style = styles[trigger]
      var active = trigger[0]
      var button = trigger[1]

      if (style == active) SetStyleButtonState(button, true)
      else SetStyleButtonState(button, false)
   }

   // Check the non-toggled font styles and apply them every time
   SetTextColorButtonUnderlineColor(styles["color"])
   SetHighlightColorButtonUnderlineColor(styles["background-color"])


   // Apply this at the end
   currentStyles = styles
}



function ApplyFontStyleToText (callerID) {
   switch (callerID) {
      case "menu_text_bold_btn":
         document.execCommand('bold')
         break
      case "menu_text_italic_btn":
         document.execCommand('italic')
         break
      case "menu_text_uline_btn":
         document.execCommand('underline')
         break
      case "menu_text_fcolor_btn":
         document.execCommand("styleWithCSS", false, true)
         document.execCommand("foreColor", false, $("#" + callerID).attr("setColor"))
         break
      case "menu_text_bcolor_btn":
         document.execCommand("styleWithCSS", false, true)
         document.execCommand("backColor", false, $("#" + callerID).attr("setColor"))
         break
   }
}



function ChangeStyle (caller) {
   if (caller.isOpen) SetShelfStyleButtonStatus(caller.id, false)
   else SetShelfStyleButtonStatus(caller.id, true)

   ApplyFontStyleToText(caller.id)
}
