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

    var data = {"OkPercent": 43.333333333333336, "KoPercent": 56.666666666666664};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "http://automationpractice.com/modules/blocklayered/blocklayered-ajax.php?id_category_layered=3&layered_id_attribute_group_14=14_3&layered_price_slider=16_53&orderby=position&orderway=asc&_=1536759755324"], "isController": false}, {"data": [0.0, 500, 1500, "http://automationpractice.com/modules/blocklayered/blocklayered-ajax.php?id_category_layered=3&layered_price_slider=16_53&orderby=price&orderway=desctrue&_=1536759755326"], "isController": false}, {"data": [0.0, 500, 1500, "http://automationpractice.com/index.php?id_category=3&controller=category"], "isController": false}, {"data": [0.0, 500, 1500, "http://automationpractice.com/index.php?id_category=8&controller=category"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "http://automationpractice.com/modules/blocklayered/blocklayered-ajax.php?id_category_layered=3&layered_id_attribute_group_14=14_3&layered_price_slider=16_53&orderby=position&orderway=asctrue&_=1536759755323"], "isController": false}, {"data": [0.0, 500, 1500, "http://automationpractice.com/index.php?controller=contact"], "isController": false}, {"data": [0.0, 500, 1500, "http://automationpractice.com/index.php"], "isController": false}, {"data": [0.0, 500, 1500, "http://automationpractice.com/modules/blocklayered/blocklayered-ajax.php?id_category_layered=3&layered_price_slider=16_53&orderby=position&orderway=asctrue&_=1536759755325"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 90, 51, 56.666666666666664, 4867.922222222226, 1193, 12636, 10345.2, 11232.9, 12636.0, 1.0009676020152813, 219.8448083147042, 34.313920991680845], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["http://automationpractice.com/modules/blocklayered/blocklayered-ajax.php?id_category_layered=3&layered_id_attribute_group_14=14_3&layered_price_slider=16_53&orderby=position&orderway=asc&_=1536759755324", 10, 10, 100.0, 2735.7, 1553, 3417, 3416.3, 3417.0, 3417.0, 0.7434944237918215, 33.30441159386617, 2.4658747676579926], "isController": false}, {"data": ["http://automationpractice.com/modules/blocklayered/blocklayered-ajax.php?id_category_layered=3&layered_price_slider=16_53&orderby=price&orderway=desctrue&_=1536759755326", 10, 10, 100.0, 3915.6, 1755, 4709, 4697.3, 4709.0, 4709.0, 0.6786102062975027, 51.70552505344055, 5.010184454736699], "isController": false}, {"data": ["http://automationpractice.com/index.php?id_category=3&controller=category", 10, 1, 10.0, 6888.600000000001, 1193, 9907, 9890.0, 9907.0, 9907.0, 0.714847380084352, 130.2490321636643, 39.7113077686039], "isController": false}, {"data": ["http://automationpractice.com/index.php?id_category=8&controller=category", 10, 0, 0.0, 6208.099999999999, 4491, 8340, 8338.8, 8340.0, 8340.0, 0.5842486562280906, 67.83708865243048, 36.708274604171535], "isController": false}, {"data": ["Test", 10, 10, 100.0, 43811.3, 36277, 48874, 48845.0, 48874.0, 48874.0, 0.20303744010395516, 401.3422043774872, 62.64248310982295], "isController": true}, {"data": ["http://automationpractice.com/modules/blocklayered/blocklayered-ajax.php?id_category_layered=3&layered_id_attribute_group_14=14_3&layered_price_slider=16_53&orderby=position&orderway=asctrue&_=1536759755323", 10, 10, 100.0, 2487.2000000000003, 1862, 3765, 3657.6000000000004, 3765.0, 3765.0, 0.8, 35.85671875, 2.65640625], "isController": false}, {"data": ["http://automationpractice.com/index.php?controller=contact", 20, 10, 50.0, 3653.2000000000007, 2283, 5169, 5130.3, 5167.75, 5169.0, 0.7096476599368414, 54.10359996496115, 39.60679421104921], "isController": false}, {"data": ["http://automationpractice.com/index.php", 10, 0, 0.0, 11169.900000000001, 10248, 12636, 12633.8, 12636.0, 12636.0, 0.7882705344474223, 1012.0767048813653, 45.022718203137316], "isController": false}, {"data": ["http://automationpractice.com/modules/blocklayered/blocklayered-ajax.php?id_category_layered=3&layered_price_slider=16_53&orderby=position&orderway=asctrue&_=1536759755325", 10, 10, 100.0, 3099.7999999999997, 2458, 3995, 3984.1, 3995.0, 3995.0, 0.709622480840193, 54.0491169635254, 5.240534301376667], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: automationpractice.com:80 failed to respond", 1, 1.9607843137254901, 1.1111111111111112], "isController": false}, {"data": ["Assertion failed", 50, 98.03921568627452, 55.55555555555556], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 90, 51, "Assertion failed", 50, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: automationpractice.com:80 failed to respond", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["http://automationpractice.com/modules/blocklayered/blocklayered-ajax.php?id_category_layered=3&layered_id_attribute_group_14=14_3&layered_price_slider=16_53&orderby=position&orderway=asc&_=1536759755324", 10, 10, "Assertion failed", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["http://automationpractice.com/modules/blocklayered/blocklayered-ajax.php?id_category_layered=3&layered_price_slider=16_53&orderby=price&orderway=desctrue&_=1536759755326", 10, 10, "Assertion failed", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["http://automationpractice.com/index.php?id_category=3&controller=category", 10, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: automationpractice.com:80 failed to respond", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://automationpractice.com/modules/blocklayered/blocklayered-ajax.php?id_category_layered=3&layered_id_attribute_group_14=14_3&layered_price_slider=16_53&orderby=position&orderway=asctrue&_=1536759755323", 10, 10, "Assertion failed", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["http://automationpractice.com/index.php?controller=contact", 20, 10, "Assertion failed", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["http://automationpractice.com/modules/blocklayered/blocklayered-ajax.php?id_category_layered=3&layered_price_slider=16_53&orderby=position&orderway=asctrue&_=1536759755325", 10, 10, "Assertion failed", 10, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
