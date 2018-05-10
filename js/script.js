// All code wrapped in self-executing function
(function () {

    // Start main JavaScript stream
    function main() {

        activateUrlParameters(document.URL);


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
    };
    var apiValues_guide;
    var apiValues_map;
    var apiValues_map_coords;
    var apiValues_list;
    var supplementaryOn = false;


    // Declare functions

    function activateUrlParameters(url) {
        url = url.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var parameters = getParameters(url);
        if (parameters) {
            if (parameters["page"] == "list") {
                changePage_guide2list_instant();
                generateReps_listPage_apiPull(parameters["address"].replace("+", " "))
            }
        } else {
            // temporary
            changePage_guide2list_instant();
        }
    };

    function getParameters(url) {
        try {
            var parameters = {};
            var parametersList = url.split("?")[1].split("&")
            for (i in parametersList) {
                var currentParameter = parametersList[i].split("=");
                parameters[currentParameter[0]] = currentParameter[1]
            };
            return parameters
        } catch (err) {
            return false
        }
    };

    function startPersonalizedGuide(locationString) {

        Promise.all([
            apiPullReps(locationString),
            apiPullCoords(locationString)
        ]).then(function (apiValues) {

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
    $('#c-page-map-generatedReps').on("click", "#c-page-map-2ListButton", function () {
        console.log(apiValues_map);

        apiValues_map[1] = {
            results: [{
                geometry: {
                    location: {
                        lat: apiValues_map_coords["lat"],
                        lng: apiValues_map_coords["lng"]
                    }
                }
            }]
        };

        console.log(apiValues_map[1]);
        //        console.log(apiValues_list[1]);

        //        apiValues_map[1]["results"][0]["geometry"]["location"]["lat"] = apiValues_map_coords["lat"];
        //        
        //        apiValues_map[1]["results"][0]["geometry"]["location"]["lng"] = apiValues_map_coords["lng"];

        generateReps_listPage_fromMap(apiValues_map)
    });
    
    $("#c-page-list-supplementalToggle").click(function() {
        if(supplementaryOn) {
            $("#supplementaryCSS").html(
                "#c-page-list .supplemental{display: none !important}"
            );
            $(".c-page-list-panel2-text .glyphicon").removeClass("glyphicon-check").addClass("glyphicon-unchecked");
            supplementaryOn = false;
        } else {
            $("#supplementaryCSS").html(
                "#c-page-list .supplemental{display: inherit !important}"
            );
            $(".c-page-list-panel2-text .glyphicon").removeClass("glyphicon-unchecked").addClass("glyphicon-check");
            supplementaryOn = true;
        }
    })

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

            if (apiValues[0]) {
                apiValues_list = apiValues;
                console.log(apiValues[1]);
                $("#c-input-list-address").val("");
                $("#c-page-list-generatedReps").append(generateRepHtml(apiValues, 0));
                console.log(makeAddressUrlString([
                    apiValues[0]["normalizedInput"]
                ]));
                var urlString =
                    "https://beta.ourreps.org?page=list&address=" +
                    makeAddressUrlString([
                        apiValues[0]["normalizedInput"]
                    ]);
                $("#c-input-shareableUrl").val(urlString);
                $("#c-page-list-banner-content-body-panel2 a").attr("href", urlString);
                $("#c-input-list-address").attr("placeholder", "Change location");


                // update map
                try {
                    map_pageList.removeLayer(currentMarker_pageList);
                } catch {}
                var apiCoords = apiValues[1]["results"][0]["geometry"]["location"];
                console.log(apiCoords)
                var latlng_pageList = L.latLng(apiCoords["lat"], apiCoords["lng"]);
                currentMarker_pageList = new L.marker(latlng_pageList).addTo(map_pageList);

                var boundsRadius = 0.012;

                var southWest = L.latLng(apiCoords["lat"] - boundsRadius + 0.003, apiCoords["lng"] - boundsRadius);
                var northEast = L.latLng(apiCoords["lat"] + boundsRadius + 0.003, apiCoords["lng"] + boundsRadius);
                var locationBounds = L.latLngBounds(southWest, northEast);

                map_pageList.flyToBounds(locationBounds, {
                    duration: 1,
                })

            } else {
                // display "retry address" message
                console.log("Address invalid");
            }

        })
    };

    function generateReps_mapPage_apiPull(locationString) {
        $("#c-page-map-generatedReps").html("")
        Promise.all([
            apiPullReps(locationString),
            ""
//            apiPullCoords(locationString)
        ]).then(function (apiValues) {
            if (apiValues[0]) {
                apiValues_map = apiValues;
                console.log("apiValues_map");
                console.log(apiValues_map);
                //                apiValues_map[1] = 
                $("#c-page-map-generatedReps").append(generateRepHtml(apiValues, 2))
            };
            $("#c-page-map .repNameWrapper").prepend(
                "<span class='glyphicon glyphicon-user'></span> "
            );
            $(".repContactaddressDiv").append(
                "<button class='btn' id='c-page-map-2ListButton'>Full Info</button> "
            );

        })
    };

    function generateReps_listPage_fromMap(apiValues) {
        changePage_map2list()
        if (apiValues[0]) {
            $("#c-page-list-generatedReps").html("");
            apiValues_list = apiValues;
            console.log(apiValues[1]);
            $("#c-page-list-generatedReps").append(generateRepHtml(apiValues, 0));
            console.log(makeAddressUrlString([
                    apiValues[0]["normalizedInput"]
                ]));
            var urlString =
                "https://beta.ourreps.org?page=list&address=" +
                makeAddressUrlString([
                        apiValues[0]["normalizedInput"]
                    ]);
            $("#c-input-shareableUrl").val(urlString);
            $("#c-page-list-banner-content-body-panel2 a").attr("href", urlString);
            $("#c-input-list-address").attr("placeholder", "Change location");


            // update map
            try {
                map_pageList.removeLayer(currentMarker_pageList);
            } catch {};
            var apiCoords = apiValues_list[1]["results"][0]["geometry"]["location"];
            console.log(apiCoords);
            var latlng_pageList = L.latLng(apiCoords["lat"], apiCoords["lng"]);
            currentMarker_pageList = new L.marker(latlng_pageList).addTo(map_pageList);

            var boundsRadius = 0.012;

            var southWest = L.latLng(parseFloat(apiCoords["lat"]) - boundsRadius, parseFloat(apiCoords["lng"]) - boundsRadius);
            var northEast = L.latLng(parseFloat(apiCoords["lat"]) + boundsRadius, parseFloat(apiCoords["lng"]) + boundsRadius);
            var locationBounds = L.latLngBounds(southWest, northEast);

            // fix map bug
            setTimeout(function () {
                map_pageList.invalidateSize();
            }, 200);
            setTimeout(function () {
                map_pageList.flyToBounds(locationBounds, {
                    duration: 1,
                })

            }, 250);

        } else {
            // display "retry address" message
            console.log("Address invalid");
        }
    };

    function generateRepHtml(apiValues, skipVal) {

        if (true) {
            var [repsObject, locationObject] = apiValues;


            var repHtmlStringsList = [];
            var officeHtml2dArray = [];


            repHtmlStringsList.push(
                "<div class='c-generated-address'>" +
                "<div class='c-address-header'>Showing Representatives For:</div>" +
                makeRepCardString_address([
                    repsObject["normalizedInput"]
                ]) +
                "</div>"
            );

            //            for (i_office in repsObject["offices"]) {
            for (var i_office = skipVal; i_office < repsObject["offices"].length; i_office++) {

                officeHtml2dArray.push(
                    [i_office, getOfficeOrder(repsObject, i_office),
                    makeOfficeHtmlString(repsObject, i_office)]
                );


            };

            officeHtml2dArray.sort(compare)



            var currentGroupId = 10
            var lastGroupId = 0
            for (i in officeHtml2dArray) {
                currentGroupId = officeHtml2dArray[i][1];
                if (currentGroupId != lastGroupId) {
                    var groupTitleHTML =
                        "<div class='repGroupTitle'>" +
                        groupTitles[currentGroupId] +
                        "</div>" +
                        "<div class='repSupplementalTitle supplemental'>" +
                        "<div class=''>" +
                        "(Supplemental information goes here. Concise, 1-2 sentence scope summary.)" +
                        "</div>" +
                        "</div>"
                    repHtmlStringsList.push(groupTitleHTML);
                };
                repHtmlStringsList.push(officeHtml2dArray[i][2]);
                lastGroupId = currentGroupId
            };


            return repHtmlStringsList
        };
    };

    function getOfficeOrder(repsObject, i_office) {
        var divisionList = repsObject["offices"][i_office]["divisionId"].split("/");

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
                                    makeRepCardString_nameParty(officialsRepInfo),
                                "</div>",
                                // Contact info, if available (emails channels phones urls)
                                makeRepCardString_phones(officialsRepInfo),
                                makeRepCardString_address(officialsRepInfo["address"]),
                            "</div>",
                            "<div class='repContactsWrapper'>",
                                makeRepCardString_urls(officialsRepInfo),
                                makeRepCardString_channels(officialsRepInfo),
                            "</div>",
                            "<div class='repSupplementalInfo supplemental'>",
                            "(Supplemental information goes here. The information provided should be a concise, 1-2 sentence summary of this position's roles and impact on the user's life.)",
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

    function makeRepCardString_nameParty(officialsRepInfo) {
        var test = ["<span class='repName'>",
                        String(officialsRepInfo["name"]),
                    "</span>",
                    "<span class='repParty'>, ",
                        String(officialsRepInfo["party"]),
                    "</span>",
                   ];
        var returnVar = "";
        returnVar += "<span class='repName'>" +
            String(officialsRepInfo["name"]) +
            "</span>"
        if (officialsRepInfo["party"] && officialsRepInfo["party"] == "Democratic") {
            returnVar += "<span class='repParty'>, " +
                String(officialsRepInfo["party"]).slice(0, -2) +
                "</span>"
        } else if (officialsRepInfo["party"] && officialsRepInfo["party"] != "Unknown") {
            returnVar += "<span class='repParty'>, " +
                String(officialsRepInfo["party"]) +
                "</span>"
        };
        return returnVar
    };

    function makeRepCardString_address(addressInfo) {
        if (addressInfo) {
            var returnVar = "<div class='repContactAddress'>"
            for (i_contactDict in addressInfo) {
                returnVar += "" +
                    "<div class='repContactaddressDiv'>" +
                    ((addressInfo[i_contactDict]["line1"]) ? addressInfo[i_contactDict]["line1"] + "<br>" : "") +
                    ((addressInfo[i_contactDict]["line2"]) ? addressInfo[i_contactDict]["line2"] + " " : "") +
                    ((addressInfo[i_contactDict]["line3"]) ? addressInfo[i_contactDict]["line3"] + " " : "") +
                    ((addressInfo[i_contactDict]["city"]) ? addressInfo[i_contactDict]["city"] + " " : "") +
                    ((addressInfo[i_contactDict]["state"]) ? addressInfo[i_contactDict]["state"] + " " : "") +
                    ((addressInfo[i_contactDict]["zip"]) ? addressInfo[i_contactDict]["zip"] + " " : "") +
                    "</div>"
            };
            returnVar = returnVar + "</div>";
            return returnVar
        } else {
            return ""
        }
        return ""

    };

    function makeAddressUrlString(addressInfo) {
        if (addressInfo) {
            var returnVar = ""
            for (i_contactDict in addressInfo) {
                returnVar += "" +
                    "" +
                    addressInfo[i_contactDict]["line1"] + " " +
                    ((addressInfo[i_contactDict]["line2"]) ? addressInfo[i_contactDict]["line2"] + " " : "") +
                    ((addressInfo[i_contactDict]["line3"]) ? addressInfo[i_contactDict]["line3"] + " " : "") +
                    addressInfo[i_contactDict]["city"] + " " +
                    addressInfo[i_contactDict]["state"] + " " +
                    addressInfo[i_contactDict]["zip"] +
                    ""
            };
            //            returnVar = returnVar.replace(" ", "+");
            console.log(returnVar.replace(/ /g, "+"));
            return returnVar.replace(/ /g, "+")
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



    // Leaflet

    // leaflet-related functions

    // make bounds
    function leafletBounds(N, S, E, W) {
        var southWest = L.latLng(S, W);
        var northEast = L.latLng(N, E);
        return L.latLngBounds(southWest, northEast);
    };

    // PAGE: MAP

    // initialize map-page map
    var map_pageMap = L.map('c-page-map-mapFrame').setView([40, -100], 4);

    var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        //        attribution: 'Data: <a href="https://ebird.org/">eBird</a> (2012-2016) |  Illustrations &copy; <a href="http://www.sibleyguides.com/">David Allen Sibley</a> | Tiles &copy; Esri | <a id="aboutMap">About Map <span class="glyphicon glyphicon-info-sign"></span></a>',
        maxZoom: 16,
        minZoom: 3
    }).addTo(map_pageMap);

    var currentMarker_pageMap
    map_pageMap.on('click', function (ev) {
        var latlng = map_pageMap.mouseEventToLatLng(ev.originalEvent);
        var latLongString = latlng.lat + ', ' + latlng.lng;
        apiValues_map_coords = {
            lat: latlng.lat,
            lng: latlng.lng
        };
        generateReps_mapPage_input(latLongString);
        try {
            map_pageMap.removeLayer(currentMarker_pageMap);
        } catch {}
        currentMarker_pageMap = new L.marker(latlng).addTo(map_pageMap);
    });

    // fix map bug
    setTimeout(function () {
        map_pageMap.invalidateSize();
    }, 200);
    $("#c-header-tab-map").click(function () {
        setTimeout(function () {
            map_pageMap.invalidateSize();
        }, 200);
    });



    // PAGE: LIST

    // initialize list-page map
    var map_pageList = L.map('c-page-list-mapFrame', {
        zoomControl: false,
        attributionControl: false
    }).setView([40, -100], 2);


    // disable map interaction
    map_pageList.dragging.disable();
    map_pageList.touchZoom.disable();
    map_pageList.doubleClickZoom.disable();
    map_pageList.scrollWheelZoom.disable();
    map_pageList.boxZoom.disable();
    map_pageList.keyboard.disable();
    if (map_pageList.tap) map_pageList.tap.disable();

    // clicking the map opens the current location in the Map tab
    $("#c-page-list-mapFrame").click(function () {
        console.log("Map clicked.");
        changePage_list2map();
        setTimeout(function () {
            map_pageMap.invalidateSize();

        }, 200);
        try {
            if (apiValues_list[0]) {
                var apiCoords = apiValues_list[1]["results"][0]["geometry"]["location"];
                var latLongString = apiCoords["lat"] + ", " + apiCoords["lng"];
                generateReps_mapPage_input(latLongString);
                try {
                    map_pageMap.removeLayer(currentMarker_pageMap);
                } catch {}
                var latlng = L.latLng(apiCoords["lat"], apiCoords["lng"]);
                currentMarker_pageMap = new L.marker(latlng).addTo(map_pageMap);

                var boundsRadius = 0.8;
                var southWest = L.latLng(parseFloat(apiCoords["lat"]) - boundsRadius, parseFloat(apiCoords["lng"]) - boundsRadius);
                var northEast = L.latLng(parseFloat(apiCoords["lat"]) + boundsRadius, parseFloat(apiCoords["lng"]) + boundsRadius);
                var locationBounds = L.latLngBounds(southWest, northEast);

                setTimeout(function () {
                    map_pageMap.flyToBounds(locationBounds, {
                        duration: 1,
                    })

                }, 250);
            }
        } catch {}
    });

    var currentMarker_listPage;

    // add basemap
    var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        //        attribution: 'Data: <a href="https://ebird.org/">eBird</a> (2012-2016) |  Illustrations &copy; <a href="http://www.sibleyguides.com/">David Allen Sibley</a> | Tiles &copy; Esri | <a id="aboutMap">About Map <span class="glyphicon glyphicon-info-sign"></span></a>',
        maxZoom: 16,
        minZoom: 1
    }).addTo(map_pageList);

    //    var Wikimedia = L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    //        attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    //        minZoom: 1,
    //        maxZoom: 18
    //    }).addTo(map_pageList);

    // fix map bug
    setTimeout(function () {
        map_pageList.invalidateSize();
    }, 200);
    $("#c-header-tab-list").click(function () {
        setTimeout(function () {
            map_pageList.invalidateSize();
        }, 200);
    });



})();

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
        'background-color': 'white'
    });
    $("#c-header-tab-guide").css({
        'font-weight': '600',
        'background-color': 'white',
        'border-bottom': '2px solid black'
    });
    $("#c-header-tab-map").css({
        'font-weight': '800',
        'background-color': 'transparent',
        'border-bottom': '0px solid white'
    });
    $("#c-header-tab-list").css({
        'font-weight': '600',
        'background-color': 'white',
        'border-bottom': '2px solid black'
    });
    $("#c-header-tab-menu").css({
        'border-bottom': '2px solid black'
    });
};

function changePage_guide2list_instant() {
    $("#c-page-guide").hide();
    $("#c-page-list").show();
    $("#c-header-tab-guide").attr("onclick", "changePage_list2guide()");
    $("#c-header-tab-map").attr("onclick", "changePage_list2map()");
    $("#c-header-tab-list").attr("onclick", "");
    $("#c-header-tab-guide").css({
        'font-weight': '600',
        'color': 'black',
        'background-color': 'white',
        'border-bottom': '0px'
    });
    $("#c-header-tab-list").css({
        'font-weight': '800',
        'color': 'white',
        'background-color': '#112e51',
        'border-bottom': '0px'
    });
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
        'background-color': 'white',
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
        'background-color': 'white',
        'border-bottom': '0px'
    });
    $("#c-header-tab-guide").css({
        'font-weight': '800',
        'color': 'white',
        'background-color': '#981b1e',
        'border-bottom': '0px'
    });
    $("#c-header-tab-list").css({
        'border-bottom': '0px'
    });
    $("#c-header-tab-menu").css({
        'border-bottom': '0px'
    });
};

function changePage_map2list() {
    $("#c-page-map").hide("slide", {
        direction: "right"
    }, 300);
    $("#c-page-list").delay(100).show("slide", {
        direction: "left"
    }, 300);
    $("#c-header-tab-guide").attr("onclick", "changePage_list2guide()");
    $("#c-header-tab-map").attr("onclick", "changePage_list2map()");
    $("#c-header-tab-list").attr("onclick", "");
    $("#c-header-tab-map").css({
        'font-weight': '600',
        'color': 'black',
        'background-color': 'white',
        'border-bottom': '0px'
    });
    $("#c-header-tab-list").css({
        'font-weight': '800',
        'color': 'white',
        'background-color': '#112e51',
        'border-bottom': '0px'
    });
    $("#c-header-tab-menu").css({
        'border-bottom': '0px'
    });
    $("#c-header-tab-guide").css({
        'border-bottom': '0px'
    });
};

function changePage_list2map() {
    $("#c-page-list").hide("slide", {
        direction: "left"
    }, 300);
    $("#c-page-map").delay(100).show("slide", {
        direction: "right"
    }, 300);
    $("#c-header-tab-guide").attr("onclick", "changePage_map2guide()");
    $("#c-header-tab-map").attr("onclick", "");
    $("#c-header-tab-list").attr("onclick", "changePage_map2list()");

    $("#c-header-tab-map").css({
        'font-weight': '800',
        'background-color': 'transparent',
        'border-bottom': '0px solid white'
    });
    $("#c-header-tab-guide").css({
        'font-weight': '600',
        'background-color': 'white',
        'border-bottom': '2px solid black'
    });
    $("#c-header-tab-list").css({
        'font-weight': '600',
        'color': 'black',
        'background-color': 'white',
        'border-bottom': '2px solid black'
    });
    $("#c-header-tab-menu").css({
        'border-bottom': '2px solid black'
    });
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
        'background-color': 'white',
        'border-bottom': '0px'
    });
    $("#c-header-tab-guide").css({
        'font-weight': '800',
        'color': 'white',
        'background-color': '#981b1e',
        'border-bottom': '0px'
    });
}

function copyShareableUrl() {
    /* Get the text field */
    var copyText = document.getElementById("c-input-shareableUrl");

    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand("Copy");

}
