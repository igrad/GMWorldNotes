function ToggleDD(caller) {
   var dropBtn = $(caller)
   var dropMenu = $("#" + ($(caller).attr("dropmenu")))

   if (dropMenu.attr("isOpen") == "true") {
      dropMenu.css("display", "none")
      dropMenu.attr("isOpen", "false")
      dropBtn[0].classList.remove("isActive")

      $("[onclick='ToggleDD(this)']").each(function (i) {
         this.classList.remove("isActive")
      })
   } else {
      CloseDropDowns()

      dropMenu.css("display", "inline-block")
      dropMenu.css("top", dropBtn.position().top + dropBtn.outerHeight())
      dropMenu.css("left", dropBtn.position().left)
      dropMenu.attr("isOpen", "true")
      dropBtn[0].classList.add("isActive")
   }
}



async function CreateFontFamilyOptions(showPlainTextFontNames = false) {
   var fontList = await sysFonts.getFonts().then(
      function(res) {
         console.log("Loaded " + res.length + " fonts.")
         return res
      },
      function(err) {
         console.log("Failed to load fonts")
         return []
      }
   )

   // Use @font-face in addition with local() function for each named font family
   // List each of the created fonts in the generated-fonts sheet
   var sheets = document.styleSheets
   var sheet = null
   for (var i = 0; i < sheets.length; i++) {
      if (sheets[i].href.includes("generated-fonts.css")) { sheet = sheets[i] }
   }

   for (var i = 0; i < fontList.length; i++) {
      var fontName = fontList[i]

      try {
         sheet.insertRule("@font-face {font-family: '" + fontName + "'; src: local('" + fontName + "');}", 0)
      } catch (err) {
         console.log("Failed to load font: " + fontName)

         // Remove the failed fonts
         var index = fontList.indexOf(fontName)
         fontList.splice(index, 1)
      }
   }

   // Go through each font and add it to the font list drop-down menu
   var innerHTML = ""
   var webFonts = ["Arial", "Helvetica", "Tahoma", "Verdana"]
   for (var i = 0; i < webFonts.length; i++) {
      if (!fontList.includes(webFonts[i])) fontList.push(webFonts[i])
   }
   fontList.sort()

   var indexOfArial = fontList.indexOf("Arial")
   $("#dd_font_fam").attr("selectedIndex", "ffb-" + indexOfArial)

   for (var i = 0; i < fontList.length; i++) {
      var fontName = fontList[i]
      var html = "<div id='ffb-" + i + "' class='menu_text_fontfamily_dd_opt_btn"
      if (fontName == "Arial") { html += " isActive_dd" }
      html += "' onClick='SetActiveFont(this)' fontName='" + fontName + "'>"
      html += "<div id='ffb-ex-" + i + "' class='menu_text_fontfamily_dd_opt_ex' style='font-family:" + fontName + "; font-size: 1em;'>" + fontName + "</div>"

      if (showPlainTextFontNames) {
         html += "<br/><div id='ffb-st-" + i + "' class='menu_text_fontfamily_dd_opt_st'>" + fontName + "</div>"
      }
      html += "</div>"

      innerHTML += html
   }
   $("#dd_font_fam")[0].innerHTML = innerHTML
}



function ShelfHover(caller) {
   if ($(caller).attr("isOpen") == "false") {
      $(caller).css({"background-color": "var(--shelf-top-bg-color-hover)",
         "color": "var(--shelf-top-font-color-hover)"})
   }
}



function ShelfLeaveHover(caller) {
   if ($(caller).attr("isOpen") == "false") {
      $(caller).css({"background-color": "var(--shelf-top-bg-color)",
         "color": "var(--shelf-top-font-color)"})
   }
}



function ShelfSwitch(caller) {
   var caller = $(caller)

   $(".upper_shelf_btn").attr("isOpen", "false")

   $(caller).attr("isOpen", "true")

   $(".upper_shelf_btn").css("background-color", "var(--shelf-top-bg-color)")
   $(".upper_shelf_btn").css("color", "var(--shelf-top-font-color)")

   $(caller).css("background-color", "var(--shelf-top-bg-color-open)")
   $(caller).css("color", "var(--shelf-top-font-color-hover)")

   CloseDropDowns()
   $(".lower_shelf_menu").hide()
   $("#" + caller.attr("frame")).show()
}
