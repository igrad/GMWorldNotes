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
   for (var iter in ["Arial", "Helvetica", "Tahoma", "Verdana"]) {
      if (!fontList.includes(iter)) fontList.push(iter)
   }
   fontList.sort()

   for (var i = 0; i < fontList.length; i++) {
      var fontName = fontList[i]
      var html = "<div id='ffb-" + i + "' class='menu_text_fontfamily_dd_opt_btn' "
      html += "onClick='SetActiveFont(this)' fontName='" + fontName + "'>"
      html += "<div id='ffb-ex-" + i + "' class='menu_text_fontfamily_dd_opt_ex' style='font-family:" + fontName + "; font-size: 1em;'>" + fontName + "</div>"

      if (showPlainTextFontNames) {
         html += "<br/><div id='ffb-st-" + i + "' class='menu_text_fontfamily_dd_opt_st'>" + fontName + "</div>"
      }
      html += "</div>"

      innerHTML += html
   }
   $("#dd_font_fam")[0].innerHTML = innerHTML
}



function CreateFontSizeOptions() {
   var range = [8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]

   var innerHTML = ""
   for (var i = 0; i < range.length; i++) {
      let fontSize = range[i]
      var html = "<div id='fsb-" + i + "' class='menu_text_fontsize_dd_opt_btn' "
      html += "onClick='SetActiveFontSize(this)' fontSize='" + fontSize + "'>"
      html += "<div id='fsb-ex-" + i + "' class='menu_text_fontsize_dd_opt_ex' "
      html += "style='font-size: " + fontSize + ";'>" + fontSize + "</div>"

      innerHTML += html
   }
   innerHTML += "</div>"

   $("#dd_font_size")[0].innerHTML = innerHTML
}



function ToggleFontFamilyDD(caller) {
   var dropBtn = $("#menu_text_fontfamily_btn")
   var dropMenu = $("#dd_font_fam")

   if (dropMenu.attr("isOpen") == "true") {
      dropMenu.css("display", "none")
      dropMenu.attr("isOpen", "false")
   } else {
      dropMenu.css("display", "inline-block")
      dropMenu.css("top", dropBtn.position().top + dropBtn.outerHeight())
      dropMenu.css("left", dropBtn.position().left)
      dropMenu.attr("isOpen", "true")
   }
}



function ToggleFontSizeDD(caller) {
   var dropBtn = $("#menu_text_fontsize_btn")
   var dropMenu = $("#dd_font_size")

   if (dropMenu.attr("isOpen") == "true") {
      dropMenu.css("display", "none")
      dropMenu.attr("isOpen", "false")
   } else {
      dropMenu.css("display", "inline-block")
      dropMenu.css("top", dropBtn.position().top + dropBtn.outerHeight())
      dropMenu.css("left", dropBtn.position().left)
      dropMenu.attr("isOpen", "true")
   }
}
