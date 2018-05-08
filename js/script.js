// All code wrapped in self-executing function
(function () {

    // Start main JavaScript stream
    function main() {

        changePage_guide2map()

        //        startPersonalizedGuide("invalid input")
        //startPersonalizedGuide("1601 fieldthorn drive reston va");
        //        startPersonalizedGuide("1415 Kamehameha IV Rd Honolulu HI");
        //        startPersonalizedGuide("7409 Welton Dr Madison, WI 53719");

    };


    // Initialize variables
    var apiKey = "";
    var repsData_personalizedGuide;
    var repsData_exploreMap;
    var groupTitles = {
        10: "Federal Representatives",
        20: "State Representatives",
        30: "County Representatives",
        40: "City Representatives",
        50: "District Representatives",
        60: "Other Representatives"
    }

    // Declare functions

    function startPersonalizedGuide(locationString) {

        Promise.all([
            apiPullReps(locationString),
            apiPullCoords(locationString)
        ]).then(function (apiValues) {

            console.log(apiValues)
                // unpack the loaded data into variables
                //var [csvData, jsonStates] = apiValues

        })

    };

    // Event Listeners
    $("#c-btn-list-generate").click(function () {
        generateReps_listPage_input();
    });
    $('#c-input-list-address').keypress(function (e) {
        if (e.which == 13) {
            generateReps_listPage_input();
            return false; //<---- Add this line
        }
    });

    function generateReps_listPage_input() {

        var locationString = $("#c-input-list-address").val();
        generateReps_listPage_apiPull(locationString)

    };

    function generateReps_mapPage_input(locationString) {

        generateReps_mapPage_apiPull(locationString)

    };

    function generateReps_listPage_apiPull(locationString) {
        $("#c-page-list-generatedReps").html("")
        Promise.all([
            apiPullReps(locationString),
            apiPullCoords(locationString)
        ]).then(function (apiValues) {
            $("#c-page-list-generatedReps").append(generateRepHtml(apiValues))

        })
    };

    function generateReps_mapPage_apiPull(locationString) {
        $("#c-page-map-generatedReps").html("")
        Promise.all([
            apiPullReps(locationString),
            apiPullCoords(locationString)
        ]).then(function (apiValues) {
            $("#c-page-map-generatedReps").append(generateRepHtml(apiValues))

        })
    };

    function generateReps_listPage_fromMap(apiValues) {
        $("#c-page-list-generatedReps").append(generateRepHtml(apiValues))
    };

    function generateRepHtml(apiValues) {
        console.log("Starting generateReps_listPage_input()");

        if (true) {
            var [repsObject, locationObject] = apiValues;

            console.log("repsObject:")
            console.log(repsObject)
            console.log("locationObject:")
            console.log(locationObject)

            var repHtmlStringsList = [];
            var officeHtml2dArray = [];

            //            repHtmlStringsList.push("<p>Start of Representatives (header)</p><br><br>");

            for (i_office in repsObject["offices"]) {

                officeHtml2dArray.push(
                    [i_office, getOfficeOrder(repsObject, i_office),
                    makeOfficeHtmlString(repsObject, i_office)]
                );


            };

            officeHtml2dArray.sort(compare)


            console.log(officeHtml2dArray);

            var currentGroupId = 10
            var lastGroupId = 0
            for (i in officeHtml2dArray) {
                currentGroupId = officeHtml2dArray[i][1];
                if (currentGroupId != lastGroupId) {
                    var groupTitleHTML =
                        "<div class='repGroupTitle'>" +
                        groupTitles[currentGroupId] +
                        "</div>"
                    repHtmlStringsList.push(groupTitleHTML);
                };
                repHtmlStringsList.push(officeHtml2dArray[i][2]);
                console.log(lastGroupId, currentGroupId);
                lastGroupId = currentGroupId
            };


            return repHtmlStringsList
        };
    };

    function getOfficeOrder(repsObject, i_office) {
        //        console.log(repsObject["offices"][i_office]["name"]);
        //        console.log(repsObject["offices"][i_office]["divisionId"]);
        //        console.log("");
        var divisionList = repsObject["offices"][i_office]["divisionId"].split("/");
        console.log(divisionList);

        if (
            divisionList.length < 3 ||
            repsObject["offices"][i_office]["name"].substr(0, 19) == "United States House" ||
            repsObject["offices"][i_office]["name"].substr(0, 20) == "United States Senate"
        ) {
            return 10
        } else if (divisionList.length == 3 && divisionList[2].substr(0, 8) == "district") {
            return 50
        } else if (
            divisionList.length == 3 ||
            repsObject["offices"][i_office]["name"].substr(0, 8) == "Governor" ||
            divisionList.length == 4 &&
            divisionList[3].substr(0, 4) == "sldu" ||
            divisionList.length == 4 &&
            divisionList[3].substr(0, 4) == "sldl"
        ) {
            return 20
        } else if (
            divisionList[3].substr(0, 6) == "county"
        ) {
            return 30
        } else if (
            divisionList[3].substr(0, 5) == "place"
        ) {
            return 40
        } else {
            return 60
        } //            || 


    };

    function compare(a, b) {
        if (a[1] < b[1])
            return -1;
        if (a[1] > b[1])
            return 1;
        return a[0] - b[0];
    }

    function makeOfficeHtmlString(repsObject, i_office) {

        var officialIndicesList = repsObject["offices"][i_office]["officialIndices"]
        var returnVar = "";

        for (i_rep in officialIndicesList) {
            //            console.log(repsObject["officials"][officialIndicesList[i_rep]])

            var officialsRepInfo = repsObject["officials"][officialIndicesList[i_rep]]

            var returnVarList = [
                "<div class='repCardWrapper'>",
                    "<div class='repCard'>",
                        makeRepCardString_img(officialsRepInfo),
                        "<div class='repContentWrapper'>",
                            "<div class='repOffice'>",
                                String(repsObject["offices"][i_office]["name"]),
                            "</div>",
                            "<div class='repInfoWrapper'>",
                                "<div class='repNameWrapper'>",

                                    "<span class='repName'>",
                                        String(officialsRepInfo["name"]),
                                    "</span>",
                                    "<span class='repParty'>, ",
                                        String(officialsRepInfo["party"]),
                                    "</span>",
                                "</div>",
                                // Contact info, if available (emails channels phones urls)
                                makeRepCardString_phones(officialsRepInfo),
                                makeRepCardString_address(officialsRepInfo),
                            "</div>",
                            "<div class='repContactsWrapper'>",
                                makeRepCardString_urls(officialsRepInfo),
                                makeRepCardString_channels(officialsRepInfo),
                            "</div>",
                        "</div>",
                    "</div>",
                "</div>"
            ];

            for (i_item in returnVarList) {
                returnVar += returnVarList[i_item]
            };
        }



        return returnVar
    };
    // 1601 fieldthorn dr reston va

    function makeRepCardString_img(officialsRepInfo) {
        if (officialsRepInfo["photoUrl"]) {
            var returnVar = "<div class='repImage'><img src='" + officialsRepInfo["photoUrl"] + "'></div>"
            return returnVar
        } else {
            var returnVar = "<div class='repImage'><img src='" + "/img/portrait_placeholder.png" + "'></div>"
            return returnVar
        }

    };

    function makeRepCardString_address(officialsRepInfo) {
        if (officialsRepInfo["address"]) {
            var returnVar = "<div class='repContactAddress'>"
            for (i_contactDict in officialsRepInfo["address"]) {
                returnVar += "" +
                    "<div class='repContactaddressDiv'>" +
                    officialsRepInfo["address"][i_contactDict]["line1"] + "<br>" +
                    ((officialsRepInfo["address"][i_contactDict]["line2"]) ? officialsRepInfo["address"][i_contactDict]["line2"] + "<br>" : "") +
                    officialsRepInfo["address"][i_contactDict]["city"] + ", " +
                    officialsRepInfo["address"][i_contactDict]["state"] + " " +
                    officialsRepInfo["address"][i_contactDict]["zip"] +
                    "</div>"
            };
            returnVar = returnVar + "</div>";
            return returnVar
        } else {
            return ""
        }
        return ""

    };

    function makeRepCardString_urls(officialsRepInfo) {
        if (officialsRepInfo["urls"]) {
            var returnVar = "<div class='repContactUrls'>"
            for (i_contactDict in officialsRepInfo["urls"]) {
                returnVar += "" +
                    "<a class='repContactUrlSpan' target='_blank' href='" +
                    officialsRepInfo["urls"][i_contactDict] +
                    "' >" +
                    officialsRepInfo["urls"][i_contactDict] +
                    "</a>"
            };
            returnVar = returnVar + "</div>";
            return returnVar
        } else {
            return ""
        }

    };

    function makeRepCardString_channels(officialsRepInfo) {
        if (officialsRepInfo["channels"]) {
            var returnVar = "<div class='repContactChannels'>"
            for (i_contactDict in officialsRepInfo["channels"]) {
                returnVar += "" +
                    "<div class='repContactChannelSpan'>" +
                    "" +
                    officialsRepInfo["channels"][i_contactDict]["type"] + ": " +
                    officialsRepInfo["channels"][i_contactDict]["id"] +
                    "</div>"
            };
            returnVar = returnVar + "</div>";
            return returnVar
        } else {
            return ""
        }

    };



    function makeRepCardString_phones(officialsRepInfo) {
        if (officialsRepInfo["phones"]) {
            var returnVar = "<div class='repContactPhones'>"
            for (i_contactDict in officialsRepInfo["phones"]) {
                returnVar += "" +
                    "<span class='repContactphoneSpan'>" +
                    "" +
                    officialsRepInfo["phones"][i_contactDict] +
                    "</span>"
            };
            returnVar = returnVar + "</div>";
            return returnVar
        } else {
            return ""
        }
    };

    function apiPullReps(locationString) {
        var apiFullURLString = "https://www.googleapis.com/civicinfo/v2/" +
            "representatives" +
            "?key=" + apiKey +
            "&address=" + locationString
        return Promise.resolve($.ajax({
                url: apiFullURLString,
            })
            .catch(function (err) {
                console.log("^ A location could not be found.")
            })
        );
    };

    function apiPullCoords(locationString) {
        var apiFullURLString = "https://maps.googleapis.com/maps/api/geocode/json?" +
            "address=" + locationString +
            "&key=" + apiKey;
        return Promise.resolve($.ajax({
            url: apiFullURLString
        }));
    };


    main()


    // Page changing animations

    function changePage_guide2map() {
        $("#c-page-guide").hide("slide", {
            direction: "left"
        }, 300);
        $("#c-page-map").delay(100).show("slide", {
            direction: "right"
        }, 300);
        $("#c-header-tab-guide").attr("onclick", "changePage_map2guide()")
        $("#c-header-tab-map").attr("onclick", "")
        $("#c-header-tab-list").attr("onclick", "changePage_map2list()");
        $("#c-header-tab-guide").css({
            'font-weight': '600',
            'color': 'black',
            'background-color': 'transparent'
        });
        $("#c-header-tab-map").css({
            'font-weight': '800',
            'background-color': 'white',
            'border-bottom': '2px solid white'
        });
        setTimeout(function () {
            map_pageMap.invalidateSize();
        }, 200);
    };

    function changePage_guide2list() {
        $("#c-page-guide").hide("slide", {
            direction: "left"
        }, 300);
        $("#c-page-list").delay(100).show("slide", {
            direction: "right"
        }, 300);
        $("#c-header-tab-guide").attr("onclick", "changePage_list2guide()");
        $("#c-header-tab-map").attr("onclick", "changePage_list2map()");
        $("#c-header-tab-list").attr("onclick", "");
        $("#c-header-tab-guide").css({
            'font-weight': '600',
            'color': 'black',
            'background-color': 'transparent',
            'border-bottom': '0px'
        });
        $("#c-header-tab-list").css({
            'font-weight': '800',
            'color': 'white',
            'background-color': '#112e51',
            'border-bottom': '0px'
        });
    };

    function changePage_map2guide() {
        $("#c-page-map").hide("slide", {
            direction: "right"
        }, 300);
        $("#c-page-guide").delay(100).show("slide", {
            direction: "left"
        }, 300);
        $("#c-header-tab-guide").attr("onclick", "");
        $("#c-header-tab-map").attr("onclick", "changePage_guide2map()");
        $("#c-header-tab-list").attr("onclick", "changePage_guide2list()");
        $("#c-header-tab-map").css({
            'font-weight': '600',
            'color': 'black',
            'background-color': 'transparent',
            'border-bottom': '0px'
        });
        $("#c-header-tab-guide").css({
            'font-weight': '800',
            'color': 'white',
            'background-color': '#981b1e',
            'border-bottom': '0px'
        });
    };

    function changePage_map2list() {
        $("#c-page-map").hide("slide", {
            direction: "left"
        }, 300);
        $("#c-page-list").delay(100).show("slide", {
            direction: "right"
        }, 300);
        $("#c-header-tab-guide").attr("onclick", "changePage_list2guide()");
        $("#c-header-tab-map").attr("onclick", "changePage_list2map()");
        $("#c-header-tab-list").attr("onclick", "");
        $("#c-header-tab-map").css({
            'font-weight': '600',
            'color': 'black',
            'background-color': 'transparent',
            'border-bottom': '0px'
        });
        $("#c-header-tab-list").css({
            'font-weight': '800',
            'color': 'white',
            'background-color': '#112e51',
            'border-bottom': '0px'
        });
    };

    function changePage_list2map() {
        $("#c-page-list").hide("slide", {
            direction: "right"
        }, 300);
        $("#c-page-map").delay(100).show("slide", {
            direction: "left"
        }, 300);
        $("#c-header-tab-guide").attr("onclick", "changePage_map2guide()");
        $("#c-header-tab-map").attr("onclick", "");
        $("#c-header-tab-list").attr("onclick", "changePage_map2list()");
        $("#c-header-tab-list").css({
            'font-weight': '600',
            'color': 'black',
            'background-color': 'transparent'
        });
        $("#c-header-tab-map").css({
            'font-weight': '800',
            'background-color': 'white',
            'border-bottom': '2px solid white'
        });
        setTimeout(function () {
            map_pageMap.invalidateSize();
        }, 200);
    };

    function changePage_list2guide() {
        $("#c-page-list").hide("slide", {
            direction: "right"
        }, 300);
        $("#c-page-guide").delay(100).show("slide", {
            direction: "left"
        }, 300);
        $("#c-header-tab-guide").attr("onclick", "");
        $("#c-header-tab-map").attr("onclick", "changePage_guide2map()");
        $("#c-header-tab-list").attr("onclick", "changePage_guide2list()");
        $("#c-header-tab-list").css({
            'font-weight': '600',
            'color': 'black',
            'background-color': 'transparent',
            'border-bottom': '0px'
        });
        $("#c-header-tab-guide").css({
            'font-weight': '800',
            'color': 'white',
            'background-color': '#981b1e',
            'border-bottom': '0px'
        });
    }

    // Leaflet

    var map_pageMap = L.map('c-page-map-mapFrame').setView([40, -100], 4);

    var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        //        attribution: 'Data: <a href="https://ebird.org/">eBird</a> (2012-2016) |  Illustrations &copy; <a href="http://www.sibleyguides.com/">David Allen Sibley</a> | Tiles &copy; Esri | <a id="aboutMap">About Map <span class="glyphicon glyphicon-info-sign"></span></a>',
        maxZoom: 16,
        minZoom: 3
    }).addTo(map_pageMap);

    map_pageMap.on('click', function (ev) {
        var latlng = map_pageMap.mouseEventToLatLng(ev.originalEvent);
        var latLongString = latlng.lat + ', ' + latlng.lng
        console.log(latLongString);
        generateReps_mapPage_input(latLongString)
    });

})();
