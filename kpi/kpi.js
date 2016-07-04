/**
 * Created by Administrator on 30.06.2016.
 */

var current_page_URL = location.href;
var current_top_URL  = current_page_URL.split("kpi/")[1];


    $(document).ready(function () {
        function changeActive() {
            $(".menu-link-top").each(function () {
                if ($(this).attr("href") !== "#" && $(this).attr("href").split("kpi/")[1].substr(0,4) === current_top_URL.substr(0,4)) {
                    $('.menu-link-top').parents('li, ul').removeClass('active');
                    $(this).parent('li').addClass('active');
                }
            });
        };
        
        window.onload = changeActive();
        

    });

