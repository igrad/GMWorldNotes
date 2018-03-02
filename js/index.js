function ShelfSwitch(caller) {
   var caller = $(caller);

   $(".lower_shelf_iframe").hide();
   $("#" + caller.attr("frame")).show();
}
