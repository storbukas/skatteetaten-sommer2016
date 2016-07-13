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

    

    //Read JSON object
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8000/standard-report-1month.json',
        data: { get_param: 'value' },
        dataType: 'json',
        success: function (data) {


            var statusName = ["Bra", "Advarsel", "Kritisk"];
            var statusColor = ["green", "#ffaa00", "red"];

            /*create content of accordion*/
            $.each(data.top_pages, function(index, element){
                
                /*--CREATE HEADER--*/
                var accordionH4 = document.createElement('h4');

                //Number of URL
                var accordionNumberSpan = document.createElement('span');
                accordionNumberSpan.className = 'accordionNumberSpan font-helvetica-medium';
                accordionNumberSpan.innerHTML = index+1;

                //URL
                var pageURLSpan = document.createElement('span');
                pageURLSpan.className = 'accordionLink font-helvetica-small';
                pageURLSpan.innerHTML = element.title; /************************************************ENDRE TIL URL*************/

                //Smily
                var smilySpan = document.createElement('span');
                var smily = document.createElement('i'); /**********************************************ENDRE I FORHOLD TIL MÅL*/
                smilySpan.className = 'smilyIcon';
                smily.className = 'fa fa-frown-o';
                smily.setAttribute("aria-hidden", "true");
                smilySpan.appendChild(smily);

                //Number of users
                var amountUsersSpan = document.createElement('span');
                var amountUsersP = document.createElement('p');
                amountUsersSpan.className = 'accordionBrukere font-helvetica-small';
                amountUsersP.innerHTML = 'Brukere: ' + element.sessions; /*******************************ENDRE TIL BRUKERE*/
                amountUsersSpan.appendChild(amountUsersP);

                //Append to header
                accordionH4.appendChild(accordionNumberSpan);
                accordionH4.appendChild(pageURLSpan)
                accordionH4.appendChild(smilySpan);
                accordionH4.appendChild(amountUsersSpan);
                
                
                /*--INNER CONTENT/TABLE--*/
                //Create column labels
                var accordionTableDiv = document.createElement('div');
                var accordionTable = document.createElement('table');
                var thead = document.createElement('thead');
                var trHead = document.createElement('tr');
                var empty_th = document.createElement('th');
                var actual = document.createElement('th');
                var goal = document.createElement('th');
                var trend = document.createElement('th');
                var goalDeviation = document.createElement('th');
                accordionTable.className = 'table font-helvetica-small';
                actual.innerHTML = 'Faktiske';
                goal.innerHTML = 'Mål';
                trend.innerHTML = 'Trend';
                goalDeviation.innerHTML = 'Status';

                //Append labels to table head (thead)
                trHead.appendChild(empty_th);
                trHead.appendChild(actual);
                trHead.appendChild(goal);
                trHead.appendChild(trend);
                trHead.appendChild(goalDeviation);
                thead.appendChild(trHead);

                //Create table body
                var tbody = document.createElement('tbody');

                //Bounce rate row
                var trBounceRate = document.createElement('tr');
                var thBounceRate = document.createElement('th');
                var tdBR_actual = document.createElement('td');
                var tdBR_goal = document.createElement('td');
                var tdBR_trend = document.createElement('td'); /*************************LAGE TREND****/
                var tdBR_status = document.createElement('td'); /*********************LAGE MÅL AVVIK*/
                var bounceRate = Math.round(element.bounce_rate* 10) / 10;
                var br_calculateStatus = calculateStatusBounceRate(bounceRate);
                thBounceRate.setAttribute("scope", "row");

                thBounceRate.innerHTML = "Fluktfrekvens";
                tdBR_actual.innerHTML = bounceRate + '%';
                tdBR_goal.innerHTML = "< 25%"; /*********Set manually********/
                tdBR_status.innerHTML = statusName[br_calculateStatus];
                tdBR_status.style.cssText = 'color: ' + statusColor[br_calculateStatus];

                trBounceRate.appendChild(thBounceRate);
                trBounceRate.appendChild(tdBR_actual);
                trBounceRate.appendChild(tdBR_goal);
                trBounceRate.appendChild(tdBR_trend);
                trBounceRate.appendChild(tdBR_status);

                //Pageviews VS unique row
                var trPageviews = document.createElement('tr');
                var thPageviews = document.createElement('th');
                var tdPV_actual = document.createElement('td');
                var tdPV_goal = document.createElement('td');
                var tdPV_trend = document.createElement('td'); /*************************LAGE TREND****/
                var tdPV_status = document.createElement('td'); /*********************LAGE MÅL AVVIK*/
                var pageviews =  Math.round((element.pageviews/element.unique_pageviews) *10)/ 10;
                var pv_calculateStatus = calculateStatusPageviews(pageviews);
                thPageviews.setAttribute("scope", "row");

                thPageviews.innerHTML = "Sidevisninger ÷ Unike";
                tdPV_actual.innerHTML = pageviews;
                tdPV_goal.innerHTML = "< 1.3"; /*********Set manually********/
                tdPV_status.innerHTML = statusName[pv_calculateStatus];
                tdPV_status.style.cssText = 'color: ' + statusColor[pv_calculateStatus];

                trPageviews.appendChild(thPageviews);
                trPageviews.appendChild(tdPV_actual);
                trPageviews.appendChild(tdPV_goal);
                trPageviews.appendChild(tdPV_trend);
                trPageviews.appendChild(tdPV_status);

                //Average time spent on page
                var trAverageTime = document.createElement('tr');
                var thAverageTime = document.createElement('th');
                var tdAT_actual = document.createElement('td');
                var tdAT_goal = document.createElement('td');
                var tdAT_trend = document.createElement('td'); /*************************LAGE TREND****/
                var tdAT_status = document.createElement('td'); /*********************LAGE MÅL AVVIK*/
                var avg_time_on_page = moment.duration(Math.round(element.avg_time_on_page), "seconds").format("mm:ss", { trim: false });
                thAverageTime.setAttribute("scope", "row");
                thAverageTime.innerHTML = "Gjennomsnittstid";
                tdAT_actual.innerHTML = avg_time_on_page;

                //get URL using ajax
                $.ajax({
                    url: element.url,
                    type: 'GET',
                    async: false,
                    success: function (response) {
                        //removes all blank spaces and tags
                        var text = response.responseText.replace(/[\n\r]/g, '').replace(/&#xd;/g, '').replace(/\//g, '').replace(/<.*?>/g, '').replace(/  +/g, ' ');
                        //count the words
                        var wordsCount = text.split(' ').length;
                        tdAT_goal.innerHTML = (moment.duration((wordsCount/500), "minutes").format("mm:ss", {trim: false}))
                            + " - "
                            + moment.duration((wordsCount/150), "minutes").format("mm:ss", {trim: false}); /*********Set manually*/
                        var at_calculateStatus = calculateStatusAverageTime(element.avg_time_on_page, (wordsCount/500)*60, (wordsCount/150)*60);
                        tdAT_status.innerHTML = statusName[at_calculateStatus];
                        tdAT_status.style.cssText = 'color: ' + statusColor[at_calculateStatus];
                    }
                });




                trAverageTime.appendChild(thAverageTime);
                trAverageTime.appendChild(tdAT_actual);
                trAverageTime.appendChild(tdAT_goal)
                trAverageTime.appendChild(tdAT_trend);
                trAverageTime.appendChild(tdAT_status);

                //Append rows to body
                tbody.appendChild(trBounceRate);
                tbody.appendChild(trPageviews);
                tbody.appendChild(trAverageTime);

                accordionTable.appendChild(thead);
                accordionTable.appendChild(tbody);
                accordionTableDiv.appendChild(accordionTable);

                //Append header and table to accordion
                $("#accordion").append(accordionH4);
                $("#accordion").append(accordionTableDiv);






                /*
                 //VOC
                 //Number of answered "YES"
                    <tr>
                        <th scope="row">VOC</th>
                        <td>20,42%</td>
                        <td>30%</td>
                        <td></td>
                        <td>5%</td>
                    </tr>
                    <tr class="VOCyes">
                        <th scope="row">"JA"</th>
                        <td>20,42%</td>
                        <td>30%</td>
                        <td></td>
                        <td>5%</td>
                    </tr>

                */

            })
            //Create the final accordion from Jquery UI
            $(function() {
                $( "#accordion" ).accordion();
            });

          
        }
    });

    $(function createHeader(){
        $("#usersAmount").text("heihei");
        $("#sessionsAmount").text("heihei");
        $("#pagesPerSession").text("heihei");
        $("#pageviews").text("heihei");
        $("#uniquePageviews").text("heihei");
    });







    function calculateStatusBounceRate(actualPercentage){
        var status;
        if(actualPercentage < 25){
            status = 0;
        }
        else if(actualPercentage >= 25 && actualPercentage < 30){
            status = 1;
        }
        else if(actualPercentage >= 30){
            status = 2;
        }
        else{
            return false;
        }
        return status;
    }



    function calculateStatusPageviews(actualPageviews){
        var status;
        if(actualPageviews < 1.3){
            status = 0;
        }
        else if(actualPageviews >= 1.3 && actualPageviews < 1.5){
            status = 1;
        }
        else if(actualPageviews >= 1.5){
            status = 2;
        }
        else{
            return false;
        }
        return status;
    }

    function calculateStatusAverageTime(actualAT, goalMinAT, goalMaxAT){
        var status;
        if((actualAT > goalMinAT && actualAT < goalMaxAT) || actualAT == goalMinAT || actualAT == goalMaxAT){
            status = 0;
        }
        else if((actualAT > goalMinAT-10 && actualAT < goalMinAT) || (actualAT > goalMaxAT && actualAT < goalMaxAT+10)){
            status = 1;
        }
        else if(actualAT <= goalMinAT-10 || actualAT >= goalMaxAT){
            status = 2;
        }
        else{
            return false;
        }
        return status;
    }





//Temporary function to work around 'no Access-Control-Allow-Origin' from ajax calls
    window.onload = function urlWordCounter() {
        // jquery.xdomainajax.js  ------ from padolsey
        jQuery.ajax = (function (_ajax) {
            var protocol = location.protocol,
                hostname = location.hostname,
                exRegex = RegExp(protocol + '//' + hostname),
                YQL = 'http' + (/^https/.test(protocol) ? 's' : '') + '://query.yahooapis.com/v1/public/yql?callback=?',
                query = 'select * from html where url="{URL}" and xpath="*"';
            function isExternal(url) {
                return !exRegex.test(url) && /:\/\//.test(url);
            }
            return function (o) {
                var url = o.url;
                if (/get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url)) {
                    // Manipulate options so that JSONP-x request is made to YQL
                    o.url = YQL;
                    o.dataType = 'json';
                    o.data = {
                        q: query.replace(
                            '{URL}',
                            url + (o.data ?
                            (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                                : '')),
                        format: 'xml'
                    };
                    // Since it's a JSONP request
                    // complete === success
                    if (!o.success && o.complete) {
                        o.success = o.complete;
                        delete o.complete;
                    }
                    o.success = (function (_success) {
                        return function (data) {
                            if (_success) {
                                // Fake XHR callback.
                                _success.call(this, {
                                    responseText: data.results[0]
                                    // YQL screws with <script>s
                                    // Get rid of them
                                        .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                                }, 'success');
                            }};
                    })(o.success);
                }
                return _ajax.apply(this, arguments);
            };
        })(jQuery.ajax);
    }



});