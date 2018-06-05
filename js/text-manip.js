function ToggleTagAtSelection (tag) {
   document.execCommand(tag)
}



function ApplyFontStyle (caller) {
   if ($(caller).attr("isOpen") == "true") {
      caller.classList.remove("isActive")
      $(caller).attr("isOpen", "false")
   } else {
      caller.classList.add("isActive")
      $(caller).attr("isOpen", "true")
   }

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
