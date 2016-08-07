/**
 * Created by Administrator on 30.06.2016.
 */

var active_sideMenu_url = location.href.split("/kpi")[1];

//dates
var start_date = moment().subtract(29, 'days');
var end_date = moment();
var compareToStartDate = moment(start_date).subtract(1, 'year');
var compareToEndDate = moment(end_date).subtract(1, 'year');
var start_dateJSONformat = moment().subtract(29, 'days').format('MM.DD.YY');
var end_dateJSONformat = moment().format('MM.DD.YY');

//Url lists with data
var top_pages_list = [];
var top_pages_data = [];
var top_pages_data_last_year = [];
var numberOfWordsMap = new Map();

//Jquery UI widget - accordion
var acc = $("#accordion");

$(document).ready(function () {

    $(function activeButtonsControl(){ /*Sets active class on buttons in side menu and sub side menu*/
        $(".sub-sidemenu-link").each(function(){
            if($(this).attr("href") == location.href){
                $(this).addClass('activeSubSideMenu');
            }
        });
        if(active_sideMenu_url == "/"){
            $(".menu-link-side").eq(0).addClass('activeSideMenu');
            $(".menu-button-side").eq(0).css("border-right", "none");
        }
        else if(active_sideMenu_url == "/person.html"
            || active_sideMenu_url == "/skattekort.html"
            || active_sideMenu_url == "/selvangivelse.html"){
            $(".menu-link-side").eq(1).addClass('activeSideMenu');
            $(".menu-button-side").eq(1).css("border-right", "none");
        }
        else if(active_sideMenu_url == "/bedrift_og_organisasjon.html"){
            $(".menu-link-side").eq(2).addClass('activeSideMenu');
            $(".menu-button-side").eq(2).css("border-right", "none");
        }
        else if(active_sideMenu_url == "/radgiver.html"){
            $(".menu-link-side").eq(3).addClass('activeSideMenu');
            $(".menu-button-side").eq(3).css("border-right", "none");
        }
        else if(active_sideMenu_url == "/om_skatteetaten.html"){
            $(".menu-link-side").eq(4).addClass('activeSideMenu');
            $(".menu-button-side").eq(4).css("border-right", "none");
        }
    });

    //Hide content and show loading gif until loading is done
    $("#accordion-wrapper").hide();

    //Control of toggle button of menu in left corner
    $("#wrapper").toggleClass("toggled");
    $("#menu-toggle-open").hide();

    $("#menu-toggle-open").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        $("#menu-toggle-open").hide(100, "easeOutSine");
    });

    $("#menu-toggle-close").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        $("#menu-toggle-open").show(250, "easeInSine");
    });

    //Date Range Picker
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
            /*Set values of all dates*/
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

    //Synchronize date in main header
    datePicker.change(function() {
        var dateInput = datePicker.val();
        var compareToDate = compareToStartDate.format('DD.MM.YYYY') + ' - ' + compareToEndDate.format('DD.MM.YYYY');
        $("#dateInHeader").text(dateInput);
        $("#dateInHeaderCompareTo").text(compareToDate);
        hideCompareTo();
    });
    
    //Show last year if compare to is checked /*note that the default value is set to hide*/
    $('#compareToInput').change(function() {
        if ($(this).is(':checked')) {
            $(".compareTo").show(100, "easeOutSine");
        } else {
            $(".compareTo").hide(100, "easeInSine");
        }
    });

    function hideCompareTo(){
        $(".compareTo").hide();
    }


    $(function createMainHeader (){
        //Read JSON object with top pages and values for main header
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8000/json/report.json',
            data: {get_param: 'value'},
            dataType: 'json',
            success: function (data) {
                $(function createHeader(){
                    $("#usersAmount").text(data.users);
                    $("#sessionsAmount").text(data.sessions);
                    $("#pagesPerSession").text(data.pages_per_session);
                    $("#pageviews").text(data.pageviews);
                    $("#uniquePageviews").text(data.unique_pageviews);
                });

                $.each(data.top_pages, function (index, element) {
                    top_pages_list.push(element.url);
                });
                /*Read JSON file for each url with containing data*/
                topPagesData();
            }
        });

        //Read JSON object with top pages and values for main header a year ago - "Compare to last year"
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8000/json/report_last_year.json',
            data: { get_param: 'value' },
            dataType: 'json',
            success: function (data) {
                $("#usersAmountCompare").text(data.users);
                $("#sessionsAmountCompare").text(data.sessions);
                $("#pagesPerSessionCompare").text(data.pages_per_session);
                $("#pageviewsCompare").text(data.pageviews);
                $("#uniquePageviewsCompare").text(data.unique_pageviews);
                hideCompareTo();
            }
        });
    });

    //Read Json object per page. Stores values in lists.
    function topPagesData() { /*Read JSON for chose date*/
        $.each(top_pages_list, function (index, url) {
            var JSONurl = url.replace(/\//g, "") + ".json";
            var JSONurl_lastyear = url.replace(/\//g, "") + "_lastyear.json";

            //Chosen date input
            $.ajax({
                type: 'GET',
                url: 'http://localhost:8000/json/' + JSONurl,
                data: {get_param: 'value'},
                dataType: 'json',
                success: function (data) {
                    var dataMap = new Map();
                    dataMap.set("url", data.url);
                    dataMap.set("pageviews", data.pageviews);
                    dataMap.set("unique_pageviews", data.unique_pageviews);
                    dataMap.set("avg_time_on_page", data.avg_time_on_page);
                    dataMap.set("bounce_rate", data.bounce_rate);
                    dataMap.set("external_link", data.external_link);
                    dataMap.set("voc", data.voc);
                    dataMap.set("chat", data.chat);
                    dataMap.set("contact_us", data.contact_us);
                    dataMap.set("search", data.search);
                    top_pages_data.push(dataMap);
                }
            });

            $.ajax({ /*Read JSON for last year*/
                type: 'GET',
                url: 'http://localhost:8000/json/' + JSONurl_lastyear,
                data: {get_param: 'value'},
                dataType: 'json',
                success: function (data) {
                    var dataMap = new Map();
                    dataMap.set("url", data.url);
                    dataMap.set("pageviews", data.pageviews);
                    dataMap.set("unique_pageviews", data.unique_pageviews);
                    dataMap.set("avg_time_on_page", data.avg_time_on_page);
                    dataMap.set("bounce_rate", data.bounce_rate);
                    dataMap.set("external_link", data.external_link);
                    dataMap.set("voc", data.voc);
                    dataMap.set("chat", data.chat);
                    dataMap.set("contact_us", data.contact_us);
                    dataMap.set("search", data.search);
                    top_pages_data_last_year.push(dataMap);
                }
            });
        });
    }

    //An ajax call to each page to count the amount of words of the content
    /*note that this takes a few seconds to load, and the main content is set be created when loading is done at the end of this call*/
    function wordCounter(){
        $.each(top_pages_list, function(index, element){
            $.ajax({ //get URL using ajax
                url: "http://skatteetaten.no" + element,
                data: {get_param: 'value'},
                type: 'GET',
                success: function(response){
                    var text = response.responseText.replace(/[\n\r]/g, '').replace(/&#xd;/g, '').replace(/\//g, '').replace(/<.*?>/g, '').replace(/  +/g, ' ');
                    var wordsCount = text.split(' ').length;
                    numberOfWordsMap.set(element, wordsCount);
                    if(top_pages_list.length == numberOfWordsMap.size){
                        createContent(); /*creates content when loading and counting of all pages is done*/
                    }
                }
            });
        });
    }

    //Creates content - note that the content is a Jquery UI accordion widget containing element of <h4><div>
    function createContent(){
        $.each(top_pages_data, function(index, element){

            /*List of values from last year*/
            var last_year = top_pages_data_last_year[index];

            /*Set header values*/
            var page_number = index + 1;
            var page_url = element.get("url");
            var page_smily = 'fa fa-smile-o';
            var unique_pageviews = element.get("unique_pageviews");
            var unique_pageviews_last_year = last_year.get("unique_pageviews");

            /*Creates <h4> element*/
            createHeaderOfAccordion(page_number, page_url, page_smily, unique_pageviews, unique_pageviews_last_year);

            /*Set div content values*/

            var noOfWords = numberOfWordsMap.get(page_url); /*number of words for the url*/

            /*Pageviews*/
            var pageviewsName = "Sidevisninger ÷ Unike";
            var pvActual = (element.get("pageviews") / unique_pageviews).toFixed(1);
            var pvActualCompareTo = +(((last_year.get("pageviews") / (last_year.get("unique_pageviews"))) * 10) / 10).toFixed(1);
            var pvGoal = "< 1.3";
            var pvTrend = ["pageviewTrend trendMinimized pvTrend_click", "pageviewTrend trendMaximized pvTrendMax", "pvTrendExit trendExit fa fa-times"]
            var pvStatus = calculateStatusPageviews(pvActual);

            /*Average time on page*/
            var averageTimeName = "Gjennomsnittstid";
            var aTActual = moment.duration(Math.round(element.get("avg_time_on_page")), "seconds").format("mm:ss", {trim: false});
            var aTActualCompareTo = moment.duration(Math.round(last_year.get("avg_time_on_page")), "seconds").format("mm:ss", {trim: false});
            var aTGoal = (moment.duration((noOfWords / 500), "minutes").format("mm:ss", {trim: false}))
                + " - "
                + moment.duration((noOfWords / 150), "minutes").format("mm:ss", {trim: false});
            var aTTrend = ["aTTrend trendMinimized aTTrend_click", "aTTrend trendMaximized aTTrendMax", "aTTrendExit trendExit fa fa-times"]
            var aTStatus = calculateStatusAverageTime(element.get("avg_time_on_page"), (noOfWords / 500) * 60, (noOfWords / 150) * 60);

            /*Bounce rate*/
            var bounceRateName = "Fluktfrekvens";
            var bRActual = (+element.get("bounce_rate")).toFixed(2) + "%";
            var bRActualCompareTo = (+last_year.get("bounce_rate")).toFixed(2) + "%";
            var bRGoal = "< 25%";
            var bRTrend = ["bRTrend trendMinimized bRTrend_click", "bRTrend trendMaximized bRTrendMax", "bRTrendExit trendExit fa fa-times"]
            var bRStatus = calculateStatusBounceRate((+last_year.get("bounce_rate")).toFixed(2));

            /*External link*/
            var externalClickRows = [];
            $.each(element.get("external_link"), function(index, item){
                last_year_external = last_year.get("external_link");
                var externalClickName = item.type;
                var eCActual = +(item.amount/unique_pageviews*100).toFixed(2) + "%";
                var eCActualCompareTo = +(last_year_external[index].amount/unique_pageviews_last_year*100).toFixed(2) + "%";
                var eCGoal = "> 70%";
                var eCTrend = "";
                var eCStatus = calculateStatusExternalClick((item.amount/unique_pageviews*100).toFixed(2));
                var row = createRowOfTable(externalClickName, eCActual, eCActualCompareTo, eCGoal, eCTrend, eCStatus);
                externalClickRows.push(row);
            });

            /*Question box/VOC*/
            var questionBoxName = "Spørreboks - \"Nei\"";
            var noAnswer = element.get("voc")[0].antall;
            var yesAnswer = element.get("voc")[1].antall;
            var noAnswerLastYear = last_year.get("voc")[0].antall;
            var yesAnswerLastYear = last_year.get("voc")[1].antall;
            var calcQBpercentage = +((noAnswer * 100) / (+noAnswer + +yesAnswer)).toFixed(2) + "%";
            var calcQBpercentageLastYear = +((noAnswerLastYear * 100) / (+noAnswerLastYear + +yesAnswerLastYear)).toFixed(2) + "%";
            var qBActual = noAnswer + " (" + calcQBpercentage + ")";
            var qBActualCompareTo = noAnswerLastYear + " (" + calcQBpercentageLastYear + ")";
            var qBGoal = "< 70%";
            var qBTrend = "";
            var qBStatus = calculateStatusVOC(+((noAnswer * 100) / (+noAnswer + +yesAnswer)).toFixed(2));

            /*Chat*/
            var chatName = "Chat";
            var chatActual = element.get("chat") + " (" + (element.get("chat")/unique_pageviews*100).toFixed(2) + "%)";
            var chatActualCompareTo = last_year.get("chat") + " (" + (last_year.get("chat")/unique_pageviews_last_year*100).toFixed(2) + "%)";
            var chatGoal = "< 1.5%";
            var chatTrend = "";
            var chatStatus = calculateStatusChatContactSearch((element.get("chat")/unique_pageviews*100).toFixed(2));

            /*Contact us*/
            var contactUsName = "Kontakt oss";
            var cUActual = element.get("contact_us") + " (" + (element.get("contact_us")/unique_pageviews*100).toFixed(2) + "%)";
            var cUActualCompareTo = last_year.get("contact_us") + " (" + (last_year.get("contact_us")/unique_pageviews_last_year*100).toFixed(2) + "%)";
            var cUGoal = "< 1.5%";
            var cUTrend = "";
            var cUStatus = calculateStatusChatContactSearch((element.get("contact_us")/unique_pageviews*100).toFixed(2));

            /*Search*/
            var searchName = "Søk";
            var searchActual = element.get("search") + " (" + (element.get("search")/unique_pageviews*100).toFixed(2) + "%)";
            var searchActualCompareTo = last_year.get("search") + " (" + (last_year.get("search")/unique_pageviews_last_year*100).toFixed(2) + "%)";
            var searchGoal = "< 1.5%";
            var searchTrend = "";
            var searchStatus = calculateStatusChatContactSearch((element.get("search")/unique_pageviews*100).toFixed(2));

            /*SUM*/
            var sumName = "Sum:";
            var calcSum = +noAnswer + +element.get("chat") + +element.get("contact_us") + +element.get("search");
            var calcSumLastYear = +noAnswerLastYear + +last_year.get("chat") + +last_year.get("contact_us") + +last_year.get("search");
            var sumActual = calcSum + " (" + (calcSum/unique_pageviews*100).toFixed(2) + "%)";
            var sumActualCompareTo = calcSumLastYear + " (" + (calcSumLastYear/unique_pageviews_last_year*100).toFixed(2) + "%)";
            var sumGoal = "< 2%";
            var sumTrend = "";
            var sumStatus = calculateStatusSum((calcSum/unique_pageviews*100).toFixed(2));

            /*Create rows of table*/
            var pageviewsRow = createRowOfTable(pageviewsName, pvActual, pvActualCompareTo, pvGoal, pvTrend, pvStatus);
            var averageTimeRow = createRowOfTable(averageTimeName, aTActual, aTActualCompareTo, aTGoal, aTTrend, aTStatus);
            var bounceRateRow = createRowOfTable(bounceRateName, bRActual, bRActualCompareTo, bRGoal, bRTrend, bRStatus);
            var questionBoxRow = createRowOfTable(questionBoxName, qBActual, qBActualCompareTo, qBGoal, qBTrend, qBStatus);
            var chatRow = createRowOfTable(chatName, chatActual, chatActualCompareTo, chatGoal, chatTrend, chatStatus);
            var contactUsRow = createRowOfTable(contactUsName, cUActual, cUActualCompareTo, cUGoal, cUTrend, cUStatus);
            var searchRow = createRowOfTable(searchName, searchActual, searchActualCompareTo, searchGoal, searchTrend, searchStatus);
            var sumRow = createRowOfTable(sumName, sumActual, sumActualCompareTo, sumGoal, sumTrend, sumStatus);



            /*Creates <div> element*/
            createContentOfAccordion(pageviewsRow, averageTimeRow, bounceRateRow, externalClickRows, questionBoxRow,
            chatRow, contactUsRow, searchRow, sumRow);

            /*Control of trend boxes*/
            $(function openCloseTrendControl(){
                $(".pvTrend_click").click(function () {
                    openPvTrend();
                });
                $(".pvTrendExit").click(function () {
                    closePvTrend();
                });
                $(".aTTrend_click").click(function () {
                    openAtTrend();
                });
                $(".aTTrendExit").click(function () {
                    closeAtTrend();
                });
                $(".bRTrend_click").click(function () {
                    openBrTrend();
                });
                $(".bRTrendExit").click(function () {
                    closeBrTrend();
                });
            });
        });

        /*Create final accordion widget of all <h4><div> elements*/
        $(function createAccordion(){
            acc.accordion({
                heightStyle: "content",
                autoHeight: false,
                clearStyle: true
            });
            limitRowsAccordion(5); /*Sets the accordion to show 5 elements by default*/
            $("#accordion-wrapper").show(100);
            $("#loading").hide();
        });
    }


    //Run wordCounter() when other ajax calls are finished
    $(document).ajaxStop(function( event, xhr, settings ) {
        wordCounter();
    });

    //Creates header <h4> of each accordion element
    function createHeaderOfAccordion(number, url, smileIndicator, unique_pageviews, unique_pageviews_last_year){
        /*<h4>*/
        var accordionH4 = document.createElement('h4');
        accordionH4.className = 'accordion-H4';

        /*<span> with number of the element in the accordion*/
        var accordionNumberSpan = document.createElement('span');
        accordionNumberSpan.className = 'accordionNumberSpan font-helvetica-medium';
        accordionNumberSpan.innerHTML = number;

        /*<span> with URL*/
        var pageURLSpan = document.createElement('span');
        pageURLSpan.className = 'accordionLink font-helvetica-small';
        pageURLSpan.innerHTML = url;

        /* <span><i> with smily indicator */
        var smilySpan = document.createElement('span');
        var smily = document.createElement('i');
        smilySpan.className = 'smilyIcon';
        smily.setAttribute("aria-hidden", "true");
        smilySpan.appendChild(smily);
        smily.className = smileIndicator;

        /*<span> with unique pageviews*/
        var amountPageviewsSpan = document.createElement('span');

        /*<p> with number of unique pageviews*/
        var amountPageviewsP = document.createElement('p');
        amountPageviewsSpan.className = 'accordionUniquePageviews font-helvetica-small';
        amountPageviewsSpan.appendChild(amountPageviewsP);
        amountPageviewsP.innerHTML = 'Unike sidevisninger: ' + unique_pageviews;

        /*<p> with number of unique pageviews - last year*/
        var amountPageviewsPCompareTo = document.createElement('p');
        amountPageviewsPCompareTo.className = 'compareTo pageviewsPCompareTo font-helvetica-small';
        amountPageviewsSpan.appendChild(amountPageviewsPCompareTo);
        amountPageviewsPCompareTo.innerHTML = 'Unike sidevisninger: ' + unique_pageviews_last_year;

        /*Append all tags to <h4>*/
        accordionH4.appendChild(accordionNumberSpan);
        accordionH4.appendChild(pageURLSpan);
        accordionH4.appendChild(smilySpan);
        accordionH4.appendChild(amountPageviewsSpan);

        /*Append <h4> to accordion*/
        acc.append(accordionH4);
    }

    function createContentOfAccordion(pageviews_row, averageTime_row, bounceRate_row, externalClick_rows, questionBox_row,
    chat_row, contactUs_row, search_row, sum_row){
        /*<div>*/
        var accordionContentDiv = document.createElement('div');
        accordionContentDiv.className = 'accordionDiv';

        /*<table>*/
        var table = document.createElement('table');

        /*<thead><tr><th> - Column labels*/
        var thead = document.createElement('thead');
        var tr = document.createElement('tr');
        var empty_th = document.createElement('th');
        var actual = document.createElement('th');
        var actualCompareTo = document.createElement('th');
        var goal = document.createElement('th');
        var trend = document.createElement('th');
        var status = document.createElement('th');
        table.className = 'table font-helvetica-small';
        actualCompareTo.className = 'compareTo actualCompareTo';

        /*Column label values*/
        actual.innerHTML = 'FAKTISK';
        actualCompareTo.innerHTML = 'FORRIGE ÅR';
        goal.innerHTML = 'MÅL';
        trend.innerHTML = 'TREND';
        status.innerHTML = 'STATUS';

        /*Append labels to table head <thead>*/
        tr.appendChild(empty_th);
        tr.appendChild(actual);
        tr.appendChild(actualCompareTo);
        tr.appendChild(goal);
        tr.appendChild(trend);
        tr.appendChild(status);
        thead.appendChild(tr);

        /*<tbody>*/
        var tbody = document.createElement('tbody');
        tbody.appendChild(pageviews_row);
        tbody.appendChild(averageTime_row);
        tbody.appendChild(bounceRate_row);

        $.each(externalClick_rows, function(index, row){
            tbody.appendChild(row);
            if(index == externalClick_rows.length-1){
                row.className = 'boldTableBorder';
            }
        });

        questionBox_row.className = 'noBorder';
        chat_row.className = 'noBorder';
        contactUs_row.className = 'noBorder';
        search_row.className = 'noBorder';
        sum_row.className = 'boldTableBorder'
        
        tbody.appendChild(questionBox_row);
        tbody.appendChild(chat_row);
        tbody.appendChild(contactUs_row);
        tbody.appendChild(search_row);
        tbody.appendChild(sum_row);

        /*Append <thead> and <tbody> to <table>*/
        table.appendChild(thead);
        table.appendChild(tbody);
        
        /*Append <table> to <div>*/
        accordionContentDiv.appendChild(table);

        /*Append <div> to accordion widget*/
        acc.append(accordionContentDiv);

        hideCompareTo();
    }

    //Create row of table
    function createRowOfTable(type, actual, actualCompareTo, goal, trend, status){

        /*Status colors and values*/
        var statusName = ["Bra", "Advarsel", "Kritisk"];
        var statusColor = ["#328279", "#FFB72E", "#b70202"];

        /*Create row element <tr><th><td>*/
        var tr = document.createElement('tr');
        var th = document.createElement('th');
        var actualEntry = document.createElement('td');
        var actualCompareToEntry = document.createElement('td');
        var goalEntry = document.createElement('td');
        var trendEntry = document.createElement('td');
        var statusEntry = document.createElement('td');

        /*Set type/name of row*/
        th.innerHTML = type;
        th.setAttribute("scope", "row");

        /*Set actual, actual last year and goal values*/
        actualEntry.innerHTML = actual;
        actualCompareToEntry.innerHTML = actualCompareTo;
        actualCompareToEntry.className = 'compareTo actualCompareTo';
        goalEntry.innerHTML = goal;

        /*Create trend <div> elements*/
        var trendDivMin = document.createElement('div');
        var trendDivMax = document.createElement('div');
        var trendExit = document.createElement('i');
        trendDivMin.className = trend[0];
        trendDivMax.className = trend[1];
        trendExit.className = trend[2];
        trendExit.setAttribute("aria-hidden", "true");
        trendEntry.appendChild(trendDivMin);
        trendDivMax.appendChild(trendExit);
        document.getElementById("accordion-wrapper").appendChild(trendDivMax);

        /*Hide maximized trends by default*/
        $('.pvTrendMax').hide();
        $('.aTTrendMax').hide();
        $('.bRTrendMax').hide();

        /*Set status*/
        statusEntry.innerHTML = statusName[status];
        statusEntry.style.cssText = 'color: ' + statusColor[status];

        /*Append entries to row*/
        tr.appendChild(th);
        tr.appendChild(actualEntry);
        tr.appendChild(actualCompareToEntry);
        tr.appendChild(goalEntry);
        tr.appendChild(trendEntry);
        tr.appendChild(statusEntry);
        hideCompareTo();

        return tr;
    }

    //Calculate status of rows
    function calculateStatusPageviews(actualPageviews){
        var status;
        if(actualPageviews < 1.3){
            status = 0;}
        else if(actualPageviews >= 1.3 && actualPageviews < 1.5){
            status = 1;}
        else if(actualPageviews >= 1.5){
            status = 2;}
        else{
            return false;}
        return status;
    }

    function calculateStatusAverageTime(actualAT, goalMinAT, goalMaxAT){
        var status;
        if((actualAT > goalMinAT && actualAT < goalMaxAT) || actualAT == goalMinAT || actualAT == goalMaxAT){
            status = 0;}
        else if((actualAT > goalMinAT-10 && actualAT < goalMinAT) || (actualAT > goalMaxAT && actualAT < goalMaxAT+10)){
            status = 1;}
        else if(actualAT <= goalMinAT-10 || actualAT >= goalMaxAT){
            status = 2;}
        else{
            return false;}
        return status;
    }

    function calculateStatusBounceRate(actualPercentage){
        var status;
        if(actualPercentage < 25){
            status = 0;}
        else if(actualPercentage >= 25 && actualPercentage < 30){
            status = 1;}
        else if(actualPercentage >= 30){
            status = 2;}
        else{
            return false;}
        return status;
    }

    function calculateStatusExternalClick(actualPercentage){
        var status;
        if(actualPercentage > 70){
            status = 0;}
        else if(actualPercentage <= 70 && actualPercentage > 60){
            status = 1;}
        else if(actualPercentage <= 60){
            status = 2;}
        else{
            return false;}
        return status;
    }

    function calculateStatusVOC(actualPercentage){
        var status;
        if(actualPercentage < 70){
            status = 0;}
        else if(actualPercentage >= 70 && actualPercentage < 80){
            status = 1;}
        else if(actualPercentage >= 80){
            status = 2;}
        else{
            return false;}
        return status;
    }

    function calculateStatusChatContactSearch(actualPercentage){
        var status;
        if(actualPercentage < 1.5){
            status = 0;}
        else if(actualPercentage >= 1.5 && actualPercentage < 2){
            status = 1;}
        else if(actualPercentage >= 2){
            status = 2;}
        else{
            return false;}
        return status;
    }

    function calculateStatusSum(actualPercentage){
        var status;
        if(actualPercentage < 2){
            status = 0;}
        else if(actualPercentage >= 2 && actualPercentage < 2.5){
            status = 1;}
        else if(actualPercentage >= 2.5){
            status = 2;}
        else{
            return false;}
        return status;
    }



    //Disable functions - used when trend is clicked/maximized
    function disableFunctions(){
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

    //Enable functions - used when trendExit is clicked
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

    //Functions for opening and closing trend <div> elements
    function openBrTrend (){
        var activeAcc = $('#accordion').accordion('option', 'active');
        $('.brTrendMax').eq(activeAcc).show();
        disableFunctions();
    }
    function closeBrTrend (){
        var activeAcc = $('#accordion').accordion('option', 'active');
        $('.brTrendMax').eq(activeAcc).hide();
        enableFunctions()
    }
    function openAtTrend () {
        var activeAcc = $('#accordion').accordion('option', 'active');
        $('.aTTrendMax').eq(activeAcc).show();
        disableFunctions();
    }
    function closeAtTrend (){
        var activeAcc = $('#accordion').accordion('option', 'active');
        $('.aTTrendMax').eq(activeAcc).hide();
        enableFunctions()
    }
    function openPvTrend (){
        var activeAcc = $('#accordion').accordion('option', 'active');
        $('.pvTrendMax').eq(activeAcc).show();
        disableFunctions();
    }
    function closePvTrend (){
        var activeAcc = $('#accordion').accordion('option', 'active');
        $('.pvTrendMax').eq(activeAcc).hide();
        enableFunctions()
    }

    //Limit amount of accordion elements shown
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

    //Search function
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