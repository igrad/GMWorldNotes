function CreateFontFamilyOptions() {
   var fontList = sysFonts.getFonts().then(
      function(res) { return res },
      function(err) { throw "Failed to load fonts" }
   )
}



function CreateFontSizeOptions() {
   console.log("Loaded font data!")
}
