$(document).ready(function() {
   $(".upper_shelf_btn").attr("isOpen", "false");
});

function ShelfHover(caller) {
   if($(caller).attr("isOpen") == "false") {
      $(caller).css({"background-color": "var(--shelf-top-bg-color-hover)",
         "color": "var(--shelf-top-font-color-hover)"});
   }
}

function ShelfLeaveHover(caller) {
   if($(caller).attr("isOpen") == "false") {
      $(caller).css({"background-color": "var(--shelf-top-bg-color)",
         "color": "var(--shelf-top-font-color)"});
   }
}

function ShelfSwitch(caller) {
   var caller = $(caller);

   $(".upper_shelf_btn").attr("isOpen", "false");

   $(caller).attr("isOpen", "true");

   $(".upper_shelf_btn").css("background-color", "var(--shelf-top-bg-color)");
   $(".upper_shelf_btn").css("color", "var(--shelf-top-font-color)");

   $(caller).css("background-color", "var(--shelf-top-bg-color-open)");
   $(caller).css("color", "var(--shelf-top-font-color-hover)");

   $(".lower_shelf_iframe").hide();
   $("#" + caller.attr("frame")).show();
}
