/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9596153846153846, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8833333333333333, 500, 1500, "GET Activties"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Activities"], "isController": false}, {"data": [1.0, 500, 1500, "POST Books"], "isController": false}, {"data": [1.0, 500, 1500, "POST Activities"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE User By ID"], "isController": false}, {"data": [0.38333333333333336, 500, 1500, "GET Books"], "isController": false}, {"data": [1.0, 500, 1500, "GET Users"], "isController": false}, {"data": [1.0, 500, 1500, "GET Author By ID"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Author By ID"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Cover Photos"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Authors"], "isController": false}, {"data": [1.0, 500, 1500, "GET Cover By ID"], "isController": false}, {"data": [1.0, 500, 1500, "GET Activity By ID"], "isController": false}, {"data": [1.0, 500, 1500, "GET Book By ID"], "isController": false}, {"data": [1.0, 500, 1500, "POST Authors"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Book By ID"], "isController": false}, {"data": [1.0, 500, 1500, "POST Cover Photos"], "isController": false}, {"data": [1.0, 500, 1500, "POST User"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Activity By ID"], "isController": false}, {"data": [1.0, 500, 1500, "PUT User"], "isController": false}, {"data": [1.0, 500, 1500, "GET CoverPhotos"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Cover Photo By ID"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Books"], "isController": false}, {"data": [0.6833333333333333, 500, 1500, "GET Authors"], "isController": false}, {"data": [1.0, 500, 1500, "GET Cover Photo By ID"], "isController": false}, {"data": [1.0, 500, 1500, "GET User By ID"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 780, 0, 0.0, 304.15769230769246, 236, 4733, 246.0, 488.9, 588.3999999999992, 1538.7499999999868, 65.3649543283332, 1047.5026908049108, 14.863505483742562], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Activties", 30, 0, 0.0, 502.43333333333334, 472, 577, 494.0, 559.0, 572.05, 577.0, 22.20577350111029, 67.33293625092524, 4.011785251665433], "isController": false}, {"data": ["PUT Activities", 30, 0, 0.0, 247.1, 238, 309, 245.0, 250.0, 277.09999999999997, 309.0, 7.158196134574087, 2.3970170454545454, 2.201285119899785], "isController": false}, {"data": ["POST Books", 30, 0, 0.0, 246.19999999999996, 238, 258, 245.0, 255.0, 256.9, 258.0, 7.532011046949536, 2.90762106138589, 2.716378593396937], "isController": false}, {"data": ["POST Activities", 30, 0, 0.0, 247.43333333333328, 238, 268, 246.0, 258.40000000000003, 264.15, 268.0, 7.526342197691922, 2.520295644129453, 2.2997973375564476], "isController": false}, {"data": ["DELETE User By ID", 30, 0, 0.0, 244.93333333333337, 237, 265, 245.0, 249.8, 256.75, 265.0, 7.270964614638876, 1.4982163414929712, 1.4492225369607368], "isController": false}, {"data": ["GET Books", 30, 0, 0.0, 1093.6, 532, 4733, 689.5, 1803.9, 3166.599999999998, 4733.0, 6.338474540460596, 2143.9149406428273, 1.1141849778153392], "isController": false}, {"data": ["GET Users", 30, 0, 0.0, 258.4666666666666, 237, 309, 251.0, 293.6, 304.05, 309.0, 7.522567703109328, 5.7594658976930795, 1.3223263540621866], "isController": false}, {"data": ["GET Author By ID", 30, 0, 0.0, 245.03333333333333, 237, 254, 245.0, 249.0, 254.0, 254.0, 7.539582809751193, 2.4319572285750186, 1.3555050735109324], "isController": false}, {"data": ["DELETE Author By ID", 30, 0, 0.0, 244.23333333333335, 236, 250, 244.5, 248.9, 250.0, 250.0, 7.343941248470013, 1.5132535189718483, 1.4781116126070992], "isController": false}, {"data": ["PUT Cover Photos", 30, 0, 0.0, 249.53333333333336, 238, 309, 247.0, 258.7, 283.15, 309.0, 6.850879196163508, 1.9890296728705186, 1.7682493862754056], "isController": false}, {"data": ["PUT Authors", 30, 0, 0.0, 246.73333333333332, 237, 308, 245.0, 251.8, 278.29999999999995, 308.0, 7.052186177715092, 2.1741945081100145, 1.9538136900564176], "isController": false}, {"data": ["GET Cover By ID", 30, 0, 0.0, 244.76666666666665, 236, 253, 246.0, 249.0, 251.35, 253.0, 7.524454477050414, 2.6335590669676447, 1.360133323927765], "isController": false}, {"data": ["GET Activity By ID", 30, 0, 0.0, 245.29999999999998, 237, 259, 244.5, 255.5, 257.9, 259.0, 7.539582809751193, 2.589277299572757, 1.3775936950238754], "isController": false}, {"data": ["GET Book By ID", 30, 0, 0.0, 249.46666666666667, 240, 271, 249.0, 255.9, 262.75, 271.0, 7.520681875156681, 5.444415502005516, 1.3374181342441716], "isController": false}, {"data": ["POST Authors", 30, 0, 0.0, 245.4333333333333, 237, 254, 246.5, 250.0, 252.35, 254.0, 7.526342197691922, 2.3203771795032613, 2.0704790987205217], "isController": false}, {"data": ["DELETE Book By ID", 30, 0, 0.0, 245.33333333333331, 236, 268, 246.0, 248.9, 258.09999999999997, 268.0, 7.304601899196494, 1.50514746165084, 1.45592699963477], "isController": false}, {"data": ["POST Cover Photos", 30, 0, 0.0, 245.66666666666669, 238, 256, 246.0, 249.9, 252.7, 256.0, 7.532011046949536, 2.186784066658298, 1.9293422828270148], "isController": false}, {"data": ["POST User", 30, 0, 0.0, 244.99999999999994, 236, 263, 245.0, 250.70000000000002, 258.05, 263.0, 7.537688442211055, 2.276764682788945, 1.9749627041457287], "isController": false}, {"data": ["DELETE Activity By ID", 30, 0, 0.0, 247.76666666666665, 236, 347, 245.0, 249.0, 293.0999999999999, 347.0, 7.343941248470013, 1.5132535189718483, 1.4996270654834762], "isController": false}, {"data": ["PUT User", 30, 0, 0.0, 248.26666666666662, 237, 305, 246.0, 258.0, 280.24999999999994, 305.0, 6.7598017124831005, 2.0418033883506084, 1.7843500028165842], "isController": false}, {"data": ["GET CoverPhotos", 30, 0, 0.0, 282.1333333333332, 241, 374, 269.5, 332.5, 359.15, 374.0, 7.385524372230428, 149.57850581610043, 1.3415112629246675], "isController": false}, {"data": ["DELETE Cover Photo By ID", 30, 0, 0.0, 244.2, 237, 251, 245.0, 248.0, 249.9, 251.0, 7.3081607795371495, 1.5058807856272836, 1.4994575974421436], "isController": false}, {"data": ["PUT Books", 30, 0, 0.0, 246.9, 237, 304, 245.0, 249.9, 279.24999999999994, 304.0, 6.952491309385863, 2.6839060689455385, 2.5209570538818076], "isController": false}, {"data": ["GET Authors", 30, 0, 0.0, 602.9666666666667, 478, 839, 520.0, 763.2, 803.25, 839.0, 19.569471624266143, 933.6230532452707, 3.4781678082191783], "isController": false}, {"data": ["GET Cover Photo By ID", 30, 0, 0.0, 244.7, 237, 252, 245.0, 248.0, 250.35, 252.0, 7.52823086574655, 2.6201772271016313, 1.3828713143036386], "isController": false}, {"data": ["GET User By ID", 30, 0, 0.0, 244.49999999999997, 237, 250, 245.0, 248.0, 249.45, 250.0, 7.530120481927711, 2.281832407756024, 1.3390966208584338], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 780, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
