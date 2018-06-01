function GetTextSelection () {
   var field = getSelection()
   var start = field.anchorOffset
   var end = field.extentOffset

   switch (true) {
      case (start == end): return start;
      case (start > end): return [end, start];
      case (end > start): return [start, end];
      default: return null;
   }
}



function InsertTagOnSelection (tag) {
   var bounds = GetTextSelection()

   if (bounds.length != undefined) {
      var start = bounds[0]
      var end = bounds[1]

      // Insert tag at the end before doing the one at the beginning so that the new char doesn't bump the end char back
      var pre = $("#content_view")[0].innerHTML.substring(0, start)
      var sel = $("#content_view")[0].innerHTML.substring(start, end)
      var post = $("#content_view")[0].innerHTML.substring(end)

      var openTag, closeTag = "<>"

      switch (tag) {
         case "b":
            openTag = "<b>"
            closeTag = "</b>"
            break;
         case "i":
            openTag = "<i>"
            closeTag = "</i>"
            break;
         case "u":
            openTag = "<u>"
            closeTag = "</u>"
            break;
         case "s":
            openTag = "<s>"
            closeTag = "</s>"
            break;
      }

      $("#content_view")[0].innerHTML = pre + openTag + sel + closeTag + post
   }
}
