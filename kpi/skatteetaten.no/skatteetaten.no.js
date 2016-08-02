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

//dates
var start_date = moment().subtract(29, 'days');
var end_date = moment();

var compareToStartDate = moment(start_date).subtract(1, 'year');
var compareToEndDate = moment(end_date).subtract(1, 'year');

var start_dateJSONformat = moment().subtract(29, 'days').format('MM.DD.YY');
var end_dateJSONformat = moment().format('MM.DD.YY');


$(document).ready(function () {
    //Changes active class on buttons in side menu and sub side menu
    $(function changeActive() {
        menulink.parents('li, ul').removeClass('active');
        submenulink.parents('li, ul').removeClass('active');
        menulink.each(function () {
            if ($(this).attr("href") !== "#" && $(this).attr("href").split("skatteetaten.no/")[1].substr(0, 4) === current_sideMenu_path.substr(0, 4)) {
                $(this).parent('li').addClass('active');
                $('div.subHeaderDate h2.subHeader').text($(this).text().toUpperCase());
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
    var datePicker = $("#datepickerInput");
    $(function () {
        datePicker.daterangepicker({
            "opens": "left",
            "maxDate": moment(),
            "startDate": start_date,
            "endDate": end_date,
            locale: {
                format: 'DD.MM.YYYY',
                applyLabel: 'Velg',
                cancelLabel: '<i class="fa fa-times" aria-hidden="true"></i>',
                customRangeLabel: 'Egendefinert',
                firstDay: 1,
                daysOfWeek: [
                    "Søn",
                    "Man",
                    "Tir",
                    "Ons",
                    "Tor",
                    "Fre",
                    "Lør"
                ],
                monthNames: [
                    "Januar",
                    "Februar",
                    "Mars",
                    "April",
                    "Mai",
                    "Juni",
                    "Juli",
                    "August",
                    "September",
                    "Oktober",
                    "November",
                    "Desember"
                ],
            },
            autoUpdateInput: true,
            ranges: {
                'I dag': [moment(), moment()],
                'I går': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Siste 7 dager': [moment().subtract(6, 'days'), moment()],
                'Siste 30 dager': [moment().subtract(29, 'days'), moment()],
                'Denne måned': [moment().startOf('month'), moment().endOf('month')],
                'Forrige måned': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        },
            function(start, end, label) {
                start_date = start;
                end_date = end;

                compareToStartDate = moment(start).subtract(1, 'year');
                compareToEndDate = moment(end).subtract(1, 'year');

                start_dateJSONformat = start.format('MM.DD.YY');
                end_dateJSONformat = end.format('MM.DD.YY');
            }
        );
    });

    
    //Update date in header
        datePicker.change(function() {
            var dateInput = datePicker.val();
            var compareToDate = compareToStartDate.format('DD.MM.YYYY') + ' - ' + compareToEndDate.format('DD.MM.YYYY');
            $("#dateInHeader").text(dateInput);
            $("#dateInHeaderCompareTo").text(compareToDate);
        });
    
    //Show last year if compare to is checked --  note that the default value is set to hide after creating the accordion
    $('#compareToInput').change(function() {
        if ($(this).is(':checked')) {
            $(".compareTo").show();
        } else {
            $(".compareTo").hide();
        }
    });
    
    //Read JSON object
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8000/standard-report-1month.json',
        data: { get_param: 'value' },
        dataType: 'json',
        success: function (data) {

            /*create top header*/
            $(function createHeader(){
                $("#usersAmount").text("heihei");
                $("#sessionsAmount").text("heihei");
                $("#pagesPerSession").text("heihei");
                $("#pageviews").text("heihei");
                $("#uniquePageviews").text("heihei");

                $("#usersAmountCompare").text("heihei");
                $("#sessionsAmountCompare").text("heihei");
                $("#pagesPerSessionCompare").text("heihei");
                $("#pageviewsCompare").text("heihei");
                $("#uniquePageviewsCompare").text("heihei");
            });




            /*create content of table/accordion Jquery UI*/
            var statusName = ["Bra", "Advarsel", "Kritisk"];
            var statusColor = ["#328279", "#FFB72E", "#b70202"];
            var acc = $("#accordion");

            $.each(data.top_pages, function (index, element) {


                //Note that values are set in the bottom of this loop

                /*--CREATE HEADER--*/
                var accordionH4 = document.createElement('h4');
                accordionH4.className = 'accordion-H4';

                //Number of URL
                var accordionNumberSpan = document.createElement('span');
                accordionNumberSpan.className = 'accordionNumberSpan font-helvetica-medium';

                //URL
                var pageURLSpan = document.createElement('span');
                pageURLSpan.className = 'accordionLink font-helvetica-small';

                //Smily
                var smilySpan = document.createElement('span');
                var smily = document.createElement('i');
                smilySpan.className = 'smilyIcon';
                smily.setAttribute("aria-hidden", "true");
                smilySpan.appendChild(smily);

                //Number of users
                var amountPageviewsSpan = document.createElement('span');
                var amountPageviewsP = document.createElement('p');
                var amountPageviewsPCompareTo = document.createElement('p');
                amountPageviewsPCompareTo.className = 'compareTo pageviewsPCompareTo font-helvetica-small';
                amountPageviewsSpan.className = 'accordionUniquePageviews font-helvetica-small';
                amountPageviewsSpan.appendChild(amountPageviewsP);
                amountPageviewsSpan.appendChild(amountPageviewsPCompareTo);

                //Append to header
                accordionH4.appendChild(accordionNumberSpan);
                accordionH4.appendChild(pageURLSpan);
                accordionH4.appendChild(smilySpan);
                accordionH4.appendChild(amountPageviewsSpan);

                /*--INNER CONTENT/TABLE--*/
                //Create column labels
                var accordionTableDiv = document.createElement('div');
                accordionTableDiv.className = 'accordionDiv';
                var accordionTable = document.createElement('table');
                accordionTable.className = 'table font-helvetica-small';
                var thead = document.createElement('thead');
                var trHead = document.createElement('tr');
                var empty_th = document.createElement('th');
                var actual = document.createElement('th');
                var actualCompareTo = document.createElement('th');
                var goal = document.createElement('th');
                var trend = document.createElement('th');
                var status = document.createElement('th');
                actualCompareTo.className = 'compareTo actualCompareTo';

                //Append labels to table head (thead)
                trHead.appendChild(empty_th);
                trHead.appendChild(actual);
                trHead.appendChild(actualCompareTo);
                trHead.appendChild(goal);
                trHead.appendChild(trend);
                trHead.appendChild(status);
                thead.appendChild(trHead);

                //Create table body
                var tbody = document.createElement('tbody');

                //Pageviews VS unique row
                var trPageviews = document.createElement('tr');
                var thPageviews = document.createElement('th');
                var tdPV_actual = document.createElement('td');
                var tdPV_actualCompareTo = document.createElement('td');
                var tdPV_goal = document.createElement('td');
                var tdPV_trend = document.createElement('td');
                var tdPV_status = document.createElement('td');
                tdPV_actualCompareTo.className = 'compareTo actualCompareTo';
                thPageviews.setAttribute("scope", "row");
                trPageviews.appendChild(thPageviews);
                trPageviews.appendChild(tdPV_actual);
                trPageviews.appendChild(tdPV_actualCompareTo);
                trPageviews.appendChild(tdPV_goal);
                trPageviews.appendChild(tdPV_trend);
                trPageviews.appendChild(tdPV_status);

                //Average time spent on page
                var trAverageTime = document.createElement('tr');
                var thAverageTime = document.createElement('th');
                var tdAT_actual = document.createElement('td');
                var tdAT_actualCompareTo = document.createElement('td');
                tdAT_actualCompareTo.className = 'compareTo actualCompareTo';
                var tdAT_goal = document.createElement('td');
                var tdAT_trend = document.createElement('td');
                var tdAT_status = document.createElement('td');
                thAverageTime.setAttribute("scope", "row");
                trAverageTime.appendChild(thAverageTime);
                trAverageTime.appendChild(tdAT_actual);
                trAverageTime.appendChild(tdAT_actualCompareTo);
                trAverageTime.appendChild(tdAT_goal);
                trAverageTime.appendChild(tdAT_trend);
                trAverageTime.appendChild(tdAT_status);

                //Bounce rate row
                var trBounceRate = document.createElement('tr');
                var thBounceRate = document.createElement('th');
                var tdBR_actual = document.createElement('td');
                var tdBR_actualCompareTo = document.createElement('td');
                var tdBR_goal = document.createElement('td');
                var tdBR_trend = document.createElement('td');
                var tdBR_status = document.createElement('td');
                tdBR_actualCompareTo.className = 'compareTo actualCompareTo';
                thBounceRate.setAttribute("scope", "row");
                trBounceRate.appendChild(thBounceRate);
                trBounceRate.appendChild(tdBR_actual);
                trBounceRate.appendChild(tdBR_actualCompareTo);
                trBounceRate.appendChild(tdBR_goal);
                trBounceRate.appendChild(tdBR_trend);
                trBounceRate.appendChild(tdBR_status);

                //Append rows to body
                tbody.appendChild(trPageviews);
                tbody.appendChild(trAverageTime);
                tbody.appendChild(trBounceRate);
                accordionTable.appendChild(thead);
                accordionTable.appendChild(tbody);
                accordionTableDiv.appendChild(accordionTable);

                //Append header and table to accordion
                acc.append(accordionH4);
                acc.append(accordionTableDiv);

                //Set values of header
                accordionNumberSpan.innerHTML = index + 1;
                pageURLSpan.innerHTML = element.url;
                smily.className = 'fa fa-smile-o'; /*******ENDRE*/
                amountPageviewsP.innerHTML = 'Unike sidevisninger: ' + element.unique_pageviews;
                amountPageviewsPCompareTo.innerHTML = 'Unike sidevisninger: ' + element.unique_pageviews;

                //Set values of inner content
                    //Column labels
                actual.innerHTML = 'FAKTISK';
                actualCompareTo.innerHTML = 'FORRIGE ÅR';
                goal.innerHTML = 'MÅL';
                trend.innerHTML = 'TREND';
                status.innerHTML = 'STATUS';

                    //Pageviews
                var pageviews = Math.round((element.pageviews / element.unique_pageviews) * 10) / 10;
                var pv_calculateStatus = calculateStatusPageviews(pageviews);
                thPageviews.innerHTML = "Sidevisninger ÷ Unike";
                tdPV_actual.innerHTML = pageviews;
                tdPV_actualCompareTo.innerHTML = "heiehie";
                tdPV_goal.innerHTML = "< 1.3";

                //average time on page trend div
                var pv_trendDivMin = document.createElement('div');
                var pv_trendDivMax = document.createElement('div');
                var pv_trendExit = document.createElement('i');
                pv_trendExit.setAttribute("aria-hidden", "true");
                pv_trendDivMin.className = "pageviewTrend trendMinimized pvTrend_click";
                pv_trendDivMax.className = "pageviewTrend trendMaximized pvTrendMax";
                pv_trendExit.className = "pvTrendExit trendExit fa fa-times";
                tdPV_trend.appendChild(pv_trendDivMin);
                pv_trendDivMax.appendChild(pv_trendExit);
                document.getElementById("accordion-wrapper").appendChild(pv_trendDivMax);
                $(".pvTrend_click").click(function(){
                    openPvTrend();
                });
                $(".pvTrendExit").click(function(){
                    closePvTrend();
                });

                //averagetime status
                tdPV_status.innerHTML = statusName[pv_calculateStatus];
                tdPV_status.style.cssText = 'color: ' + statusColor[pv_calculateStatus];






                    //Average time on page
                var avg_time_on_page = moment.duration(Math.round(element.avg_time_on_page), "seconds").format("mm:ss", {trim: false});
                thAverageTime.innerHTML = "Gjennomsnittstid";
                tdAT_actual.innerHTML = avg_time_on_page;
                tdAT_actualCompareTo.innerHTML = "heiehie";
                $.ajax({ //get URL using ajax
                    url: element.url,
                    type: 'GET',
                    success: function (response) {
                        //removes all blank spaces and tags
                        var text = response.responseText.replace(/[\n\r]/g, '').replace(/&#xd;/g, '').replace(/\//g, '').replace(/<.*?>/g, '').replace(/  +/g, ' ');
                        //count the words
                        var wordsCount = text.split(' ').length;
                        tdAT_goal.innerHTML = (moment.duration((wordsCount / 500), "minutes").format("mm:ss", {trim: false}))
                            + " - "
                            + moment.duration((wordsCount / 150), "minutes").format("mm:ss", {trim: false});
                        /*********Set manually*/
                        var at_calculateStatus = calculateStatusAverageTime(element.avg_time_on_page, (wordsCount / 500) * 60, (wordsCount / 150) * 60);
                        tdAT_status.innerHTML = statusName[at_calculateStatus];
                        tdAT_status.style.cssText = 'color: ' + statusColor[at_calculateStatus];
                    }
                });
                //average time on page trend div
                var at_trendDivMin = document.createElement('div');
                var at_trendDivMax = document.createElement('div');
                var at_trendExit = document.createElement('i');
                at_trendExit.setAttribute("aria-hidden", "true");
                at_trendDivMin.className = "averageTimeTrend trendMinimized atTrend_click";
                at_trendDivMax.className = "averageTimeTrend trendMaximized atTrendMax";
                at_trendExit.className = "atTrendExit trendExit fa fa-times";
                tdAT_trend.appendChild(at_trendDivMin);
                at_trendDivMax.appendChild(at_trendExit);
                document.getElementById("accordion-wrapper").appendChild(at_trendDivMax);
                $(".atTrend_click").click(function(){
                    openAtTrend();
                });
                $(".atTrendExit").click(function(){
                    closeAtTrend();
                });


                //Bounce Rate
                var bounceRate = Math.round(element.bounce_rate * 10) / 10;
                var br_calculateStatus = calculateStatusBounceRate(bounceRate);
                thBounceRate.innerHTML = "Fluktfrekvens";
                tdBR_actual.innerHTML = bounceRate + '%';
                tdBR_actualCompareTo.innerHTML = "heiheiheiehi";
                tdBR_goal.innerHTML = "< 25%";

                //bounce rate trend div
                var br_trendDivMin = document.createElement('div');
                var br_trendDivMax = document.createElement('div');
                var br_trendExit = document.createElement('i');
                br_trendExit.setAttribute("aria-hidden", "true");
                br_trendDivMin.className = "bouncerateTrend trendMinimized bouncerateTrend_click";
                br_trendDivMax.className = "bouncerateTrend trendMaximized brTrendMax";
                br_trendExit.className = "brTrendExit trendExit fa fa-times";
                tdBR_trend.appendChild(br_trendDivMin);
                br_trendDivMax.appendChild(br_trendExit);
                document.getElementById("accordion-wrapper").appendChild(br_trendDivMax);
                $(".bouncerateTrend_click").click(function(){
                    openBrTrend();
                });
                $(".brTrendExit").click(function(){
                    closeBrTrend();
                });

                //bounce rate status
                tdBR_status.innerHTML = statusName[br_calculateStatus];
                tdBR_status.style.cssText = 'color: ' + statusColor[br_calculateStatus];

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

            });
            //Create the final accordion from Jquery UI
            $(function () {
                acc.accordion();
                limitRowsAccordion(5);
            });

            //Hide compare to values by default
            $(function(){
                $(".compareTo").hide();
                $('.pvTrendMax').hide();
                $('.atTrendMax').hide();
                $('.brTrendMax').hide();


            });

        }});


    //Trend view open and close functions
    function disableFuntions(){
        $("#accordion" ).accordion( "disable" );
        $('#sortPagesBy').prop('disabled', 'disabled');
        $('#searchLink').prop('disabled', 'disabled');
        $('#showPages').prop('disabled', 'disabled');
        $('#datepickerInput').prop('disabled', 'disabled');
        $('#compareToInput').prop('disabled', 'disabled');
        $('.compareToLabel').css("cursor", "auto");
        $('.compareToLabel').css("color", "#bababa");
        $('#showPagesLabel').css("color", "#bababa");
    }

    function enableFunctions(){
        $("#accordion" ).accordion( "enable" );
        $('#sortPagesBy').prop('disabled', false);
        $('#searchLink').prop('disabled', false);
        $('#showPages').prop('disabled', false);
        $('#datepickerInput').prop('disabled', false);
        $('#compareToInput').prop('disabled', false);
        $('.compareToLabel').css("cursor", "pointer");
        $('.compareToLabel').css("color", "#000");
        $('#showPagesLabel').css("color", "#000");
    }

    function openBrTrend (){
        var activeAcc = $('#accordion').accordion('option', 'active');
        $('.brTrendMaxBg').eq(activeAcc).show();
        $('.brTrendMax').eq(activeAcc).show();
        disableFuntions();
    }

    function closeBrTrend (){
        var activeAcc = $('#accordion').accordion('option', 'active');
        $('.brTrendMaxBg').eq(activeAcc).hide();
        $('.brTrendMax').eq(activeAcc).hide();
        enableFunctions()
    }

    function openAtTrend () {
        var activeAcc = $('#accordion').accordion('option', 'active');
        $('.atTrendMaxBg').eq(activeAcc).show();
        $('.atTrendMax').eq(activeAcc).show();
        disableFuntions();
    }

    function closeAtTrend (){
        var activeAcc = $('#accordion').accordion('option', 'active');
        $('.atTrendMaxBg').eq(activeAcc).hide();
        $('.atTrendMax').eq(activeAcc).hide();
        enableFunctions()
    }

    function openPvTrend (){
        var activeAcc = $('#accordion').accordion('option', 'active');
        $('.pvTrendMaxBg').eq(activeAcc).show();
        $('.pvTrendMax').eq(activeAcc).show();
        disableFuntions();
    }

    function closePvTrend (){
        var activeAcc = $('#accordion').accordion('option', 'active');
        $('.pvTrendMaxBg').eq(activeAcc).hide();
        $('.pvTrendMax').eq(activeAcc).hide();
        enableFunctions()
    }




    //Show int amount of rows in accordion
    function limitRowsAccordion(int){
        $("#accordion").show();
        var count = 0;
        $('.accordion-H4').each(function (index) {
            if(count < int){
                $(this).show();
                $( "#accordion" ).accordion( "option", "active", 0);
            }
            else{
                $(this).hide();
                $('.accordionDiv').eq(index).hide();
            }
            count ++;
            });
        }


    $('#showPages').change(function() {
        limitRowsAccordion($(this).val());
    });



  $("#searchLink").keyup(function(){

        var searchTerm = $("#searchLink").val().toLowerCase();

        if(searchTerm == ''){
            $('#showPages').show();
            $('#showPagesLabel').show();
            limitRowsAccordion($('#showPages').val());
            return false;
        }

        else{
            b = true;
            $('#showPages').hide();
            $('#showPagesLabel').hide();
            $('.accordionLink').each(function (index) {
                urlText = $(this).text().toLowerCase();
                if(urlText.indexOf(searchTerm) != -1){
                    $(".accordion-H4").eq(index).show();
                    if(b == true){
                        $( "#accordion" ).accordion( "option", "active", index);
                        $('.accordionDiv').eq(index).show();
                        b = false;
                    }
                }
                else{
                    $(".accordion-H4").eq(index).hide();
                    $(".accordionDiv").eq(index).hide();
                }
            });
        }
    });

    
    //calculate status of accordion
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