/**
 * Created by Administrator on 30.06.2016.
 */



$(document).ready(function () {



   /* $(function changeActive(){
        var current_page_URL = location.href;
        $(".sidemenu-link").each(function() {
            if ($(this).attr("href") !== "#") {
                var target_URL = $(this).prop("href");
                if (target_URL == current_page_URL) {
                    $('.sidemenu-link').parents('li, ul').removeClass('active');
                    $(this).parent('li').addClass('active');
                    showSideSubMenu();
                }
            }
        });
    });*/

    function showSideSubMenu(){
        if($("#person").hasClass('active')){
            $("#person ul").css( "display", "block" );
        };
    };


});
