/**
 * Created by Administrator on 30.06.2016.
 */

//Current URL
var current_page_URL = location.href;

//Current path in hierarchy
var current_sideMenu_path  = current_page_URL.split("skatteetaten.no/")[1];
var current_subSideMenu_path  = current_page_URL.split("person/")[1];

//Side menu link & sub side menu link/Selectors of <a>
var menulink = $('.sidemenu-link');
var submenulink =  $('.sub-sidemenu-link');


$(document).ready(function () {
    
    //Changes active class on buttons in side menu and sub side menu
    $(function changeActive() {
        menulink.parents('li, ul').removeClass('active');
        submenulink.parents('li, ul').removeClass('active');
        menulink.each(function () {
            if ($(this).attr("href") !== "#" && $(this).attr("href").split("skatteetaten.no/")[1].substr(0, 4) === current_sideMenu_path.substr(0, 4)) {
                $(this).parent('li').addClass('active');
                $('div.subHeaderDate h2.subHeader').text($(this).text());
            }
        });
        submenulink.each(function () {
            if ($(this).attr("href") !== "#" && $(this).attr("href").split("person/")[1].substr(0, 4) === current_subSideMenu_path.substr(0, 4)) {
                $(this).parent('li').addClass('active');
                $(this).children('.sidebar-dot').css("border", "2px solid #000");
            }
        });
    });
    //window.onload = changeActive();


    //DatePicker
    $(function () {
        $("#datepickerInput").daterangepicker({
            "opens": "left",
            "maxDate": new Date(),
            locale: {
                format: 'DD/MM/YYYY',
                applyLabel: 'Velg',
                cancelLabel: '<i class="fa fa-times" aria-hidden="true"></i>'
            }
        });
    });

    
    //box with tables and drag down
    $(function() {
        $( "#accordion" ).accordion();
    });




    $(function createHeader(){
        $("#usersAmount").text("heihei");
        $("#sessionsAmount").text("heihei");
        $("#pagesPerSession").text("heihei");
        $("#pageviews").text("heihei");
        $("#uniquePageviews").text("heihei");
    });

    
    
    
    
    
    


});