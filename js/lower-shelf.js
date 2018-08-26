async function CreateFontFamilyOptions() {
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



}



function CreateFontSizeOptions() {
   console.log("Loaded font data!")
}
