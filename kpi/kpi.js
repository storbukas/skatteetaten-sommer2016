/**
 * Created by Administrator on 30.06.2016.
 */




var topMenuActive;
var sideMenuActive;
var subSideMenuActive;


var topMenuLinks=[];
var sideMenuLinks=[];




















    $(document).ready(function () {
        console.log(document.querySelector("#skatteetaten.no"));


        $(".menu-link-top").each(function() {
            topMenuLinks.push($(this).prop("href"));
        });

        $(".sidemenu-link").each(function() {
            sideMenuLinks.push($(this).prop("href"));
        });




        var current_page_URL = location.href;

        var split  = current_page_URL.split("kpi/");


        console.log(split);



        if(/^skatteetaten/.test(split[1])){
            document.querySelector("#skatteetaten.no").classList.add('active');

        }







        
       /* $(function changeActive(){
            var current_page_URL = location.href;
            $(".menu-link-top").each(function() {
                if ($(this).attr("href") !== "#") {
                    var target_URL = $(this).prop("href");
                    if (target_URL == current_page_URL) {
                        $('.menu-link-top').parents('li, ul').removeClass('active');
                        $(this).parent('li').addClass('active');

                    }
                }
            });
            
            



        });*/


    });

