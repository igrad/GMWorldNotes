function ButtonIsOpen(button) {
   return ($(button).attr("isOpen") == "true")
}

function ButtonSetClosed(button) {
   $(button).attr("isOpen", "false")
}

function ButtonSetOpen(button) {
   $(button).attr("isOpen", "true")
}


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
   if (ButtonIsOpen(button) && (!newStatus)) {
      button[0].classList.remove("isActive")
      ButtonSetClosed(button)
   }
   else if (!ButtonIsOpen(button) && (newStatus)) {
      button[0].classList.add("isActive")
      ButtonSetOpen(button)
   }
}



function CheckStyleAtAnchor () {
   // This is what sets the "active" state of all text styling buttons when the cursor is moved to a new position. If the new position of the anchor is in a field with bold and italics applied, then only those buttons need to be active in the shelf.

   // Get the CSS styles that need to be shown for the new anchor position
   var styles = GetActiveStylesAtAnchor()

   // Go through the list of toggled styles and see which ones are active
   var triggers = {
      0: ["font-style", "italic", "menu_text_italic_btn"],
      1: ["font-weight", "bold", "menu_text_bold_btn"],
      2: ["text-decoration-line", "underline", "menu_text_uline_btn"],
      3: ["text-decoration-line", "line-through", "menu_text_strike_btn"],
      4: ["vertical-align", "super", "menu_text_super_btn"],
      5: ["vertical-align", "sub", "menu_text_sub_btn"]
   }

   for (index in triggers) {
      var trigger = triggers[index][0]
      var style = styles[trigger]
      var active = triggers[index][1]
      var button = triggers[index][2]

      if (style && style.includes(active)) SetStyleButtonState(button, true)
      else SetStyleButtonState(button, false)
   }

   // Check the non-toggled font styles and apply them every time
   SetTextColorButtonUnderlineColor(styles["color"])
   SetHighlightColorButtonUnderlineColor(styles["background-color"])
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
      case "menu_text_strike_btn":
         document.execCommand('strikeThrough')
         break
      case "menu_text_fcolor_btn":
         document.execCommand("foreColor", false, $("#" + callerID).attr("setColor"))
         break
      case "menu_text_bcolor_btn":
         document.execCommand("backColor", false, $("#" + callerID).attr("setColor"))
         break
      case "menu_text_super_btn":
         document.execCommand("superscript")
         if(ButtonIsOpen("#menu_text_sub_btn")) {
            SetStyleButtonState("menu_text_sub_btn", false)
         }
         break
      case "menu_text_sub_btn":
         document.execCommand("subscript")
         if(ButtonIsOpen("#menu_text_super_btn")) {
            SetStyleButtonState("menu_text_super_btn", false)
         }
         break
   }
}



function ChangeStyle (caller) {
   if (ButtonIsOpen(caller)) SetStyleButtonState(caller.id, false)
   else SetStyleButtonState(caller.id, true)

   ApplyFontStyleToText(caller.id)
}



function SetActiveFont(caller) {
   // Set background color to show selection
   var button = $(caller)
   var oldSelection = $("#" + $("#dd_font_fam").attr("selectedIndex"))[0]
   oldSelection.classList.remove("isActive_dd")

   button[0].classList.add("isActive_dd")
   $("#dd_font_fam").attr("selectedIndex", caller.id)
   $("#menu_text_font_btn")[0].innerText = button.attr("fontName")
   ToggleFontFamilyDD(caller)

   // Apply font family to selected text
   document.execCommand("fontName", button.attr("fontName"))
}



function SetActiveFontSize(caller) {
   // Set background color to show selection
   var button = $(caller)
   var oldSelection = $("#" + $("#dd_font_size").attr("selectedIndex"))[0]
   oldSelection.classList.remove("isActive_dd")

   button[0].classList.add("isActive_dd")
   $("#dd_font_size").attr("selectedIndex", caller.id)
   $("#menu_text_size_btn")[0].innerText = button.attr("fontSize")
   ToggleFontSizeDD(caller)

   // Apply font family to selected text
   document.execCommand("fontSize", false, button.attr("fontSize"))
}
