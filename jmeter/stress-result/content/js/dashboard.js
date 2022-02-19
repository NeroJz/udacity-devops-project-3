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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.941025641025641, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6833333333333333, 500, 1500, "GET Activties"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Activities"], "isController": false}, {"data": [1.0, 500, 1500, "POST Books"], "isController": false}, {"data": [1.0, 500, 1500, "POST Activities"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE User By ID"], "isController": false}, {"data": [0.13333333333333333, 500, 1500, "GET Books"], "isController": false}, {"data": [1.0, 500, 1500, "GET Users"], "isController": false}, {"data": [1.0, 500, 1500, "GET Author By ID"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Author By ID"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Cover Photos"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Authors"], "isController": false}, {"data": [1.0, 500, 1500, "GET Cover By ID"], "isController": false}, {"data": [1.0, 500, 1500, "GET Activity By ID"], "isController": false}, {"data": [1.0, 500, 1500, "GET Book By ID"], "isController": false}, {"data": [1.0, 500, 1500, "POST Authors"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Book By ID"], "isController": false}, {"data": [1.0, 500, 1500, "POST Cover Photos"], "isController": false}, {"data": [1.0, 500, 1500, "POST User"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Activity By ID"], "isController": false}, {"data": [1.0, 500, 1500, "PUT User"], "isController": false}, {"data": [1.0, 500, 1500, "GET CoverPhotos"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Cover Photo By ID"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Books"], "isController": false}, {"data": [0.65, 500, 1500, "GET Authors"], "isController": false}, {"data": [1.0, 500, 1500, "GET Cover Photo By ID"], "isController": false}, {"data": [1.0, 500, 1500, "GET User By ID"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 780, 0, 0.0, 322.7410256410256, 237, 1630, 248.0, 493.0, 735.9499999999999, 1609.19, 43.71217215870881, 1630.9107096573077, 9.939823522612642], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Activties", 30, 0, 0.0, 508.7333333333333, 483, 574, 506.0, 535.6, 554.1999999999999, 574.0, 2.960623704727129, 8.9859555413007, 0.5348783060298037], "isController": false}, {"data": ["PUT Activities", 30, 0, 0.0, 245.96666666666667, 238, 259, 244.5, 255.5, 257.9, 259.0, 3.1302170283806343, 1.0481947451481637, 0.9626028732783807], "isController": false}, {"data": ["POST Books", 30, 0, 0.0, 246.8666666666667, 239, 258, 245.5, 255.8, 257.45, 258.0, 3.089280197713933, 1.1925707638245289, 1.1141320088044486], "isController": false}, {"data": ["POST Activities", 30, 0, 0.0, 249.46666666666664, 241, 271, 247.5, 263.5, 269.9, 271.0, 3.0718820397296747, 1.0286604994368216, 0.9386639553041163], "isController": false}, {"data": ["DELETE User By ID", 30, 0, 0.0, 247.53333333333333, 238, 269, 246.0, 256.8, 262.4, 269.0, 3.1282586027111576, 0.6445923488008342, 0.6235132625130344], "isController": false}, {"data": ["GET Books", 30, 0, 0.0, 1521.4666666666672, 1310, 1630, 1561.0, 1616.9, 1625.6, 1630.0, 2.7056277056277054, 2403.6601012919373, 0.47559862012987014], "isController": false}, {"data": ["GET Users", 30, 0, 0.0, 248.9666666666666, 239, 274, 247.5, 258.0, 272.9, 274.0, 3.0690537084398977, 2.3497442455242967, 0.5394820971867007], "isController": false}, {"data": ["GET Author By ID", 30, 0, 0.0, 247.50000000000003, 240, 255, 247.0, 253.9, 255.0, 255.0, 3.0962947672618433, 0.9987364859634638, 0.5566678385282279], "isController": false}, {"data": ["DELETE Author By ID", 30, 0, 0.0, 248.13333333333333, 238, 274, 247.0, 260.5, 267.4, 274.0, 3.117530915514912, 0.6423818585680142, 0.6274639860230697], "isController": false}, {"data": ["PUT Cover Photos", 30, 0, 0.0, 246.26666666666662, 239, 255, 246.0, 252.8, 254.45, 255.0, 3.1384035987027934, 0.9111790916936918, 0.8100391319698714], "isController": false}, {"data": ["PUT Authors", 30, 0, 0.0, 246.6, 238, 262, 246.0, 254.9, 259.8, 262.0, 3.1305436710842116, 0.9651490595325054, 0.8673195698111239], "isController": false}, {"data": ["GET Cover By ID", 30, 0, 0.0, 249.16666666666669, 241, 280, 248.0, 259.9, 272.3, 280.0, 3.105911585050212, 1.087069054767574, 0.5614299163992131], "isController": false}, {"data": ["GET Activity By ID", 30, 0, 0.0, 248.5, 239, 263, 248.0, 256.0, 261.35, 263.0, 3.097573567372225, 1.06378258905524, 0.5659726703665462], "isController": false}, {"data": ["GET Book By ID", 30, 0, 0.0, 303.63333333333327, 288, 325, 300.0, 324.9, 325.0, 325.0, 3.080714725816389, 14.363431274388992, 0.5478497573937153], "isController": false}, {"data": ["POST Authors", 30, 0, 0.0, 248.19999999999996, 240, 273, 247.0, 259.8, 270.8, 273.0, 3.080398398192833, 0.9496892327240989, 0.8474103796591025], "isController": false}, {"data": ["DELETE Book By ID", 30, 0, 0.0, 248.7, 239, 265, 247.0, 261.6, 263.9, 265.0, 3.1214233690562896, 0.6431839168660909, 0.622150888305067], "isController": false}, {"data": ["POST Cover Photos", 30, 0, 0.0, 250.7, 239, 274, 249.0, 263.3, 269.6, 274.0, 3.0934213239843267, 0.8981192965044339, 0.7923871223448133], "isController": false}, {"data": ["POST User", 30, 0, 0.0, 250.00000000000003, 241, 274, 248.0, 260.7, 269.6, 274.0, 3.096934035305048, 0.9354313448436049, 0.8114330094456489], "isController": false}, {"data": ["DELETE Activity By ID", 30, 0, 0.0, 247.10000000000002, 238, 260, 247.0, 253.0, 259.45, 260.0, 3.112356053532524, 0.6413155539993776, 0.6355406746031746], "isController": false}, {"data": ["PUT User", 30, 0, 0.0, 246.26666666666665, 237, 261, 246.0, 251.8, 257.15, 261.0, 3.1384035987027934, 0.9479572588659902, 0.8284282155560205], "isController": false}, {"data": ["GET CoverPhotos", 30, 0, 0.0, 254.53333333333336, 242, 305, 252.0, 278.00000000000006, 293.45, 305.0, 3.0634126416828344, 62.043080835801085, 0.5564401868681712], "isController": false}, {"data": ["DELETE Cover Photo By ID", 30, 0, 0.0, 248.9, 239, 281, 247.0, 260.3, 275.5, 281.0, 3.126302626094206, 0.644189310650271, 0.6414415837328054], "isController": false}, {"data": ["PUT Books", 30, 0, 0.0, 246.63333333333338, 237, 258, 246.0, 255.8, 257.45, 258.0, 3.1357792411414236, 1.2105210293195359, 1.1370262033552838], "isController": false}, {"data": ["GET Authors", 30, 0, 0.0, 595.7333333333333, 480, 787, 520.0, 761.8, 777.1, 787.0, 2.9847776340662624, 140.33332348771268, 0.5304975873047458], "isController": false}, {"data": ["GET Cover Photo By ID", 30, 0, 0.0, 248.40000000000003, 241, 260, 247.0, 259.0, 259.45, 260.0, 3.105911585050212, 1.081002821203023, 0.5705292667460399], "isController": false}, {"data": ["GET User By ID", 30, 0, 0.0, 247.3, 240, 260, 246.0, 256.8, 258.9, 260.0, 3.1091304798424706, 0.9421515506788269, 0.5529029886516738], "isController": false}]}, function(index, item){
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
