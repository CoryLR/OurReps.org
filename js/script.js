// All code wrapped in self-executing function
(function () {

    // Start main JavaScript stream
    function main() {

        activateUrlParameters(document.URL);


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
    var govScopeDescriptions = {
        federal: "The Federal Government governs all United States, Districts and Territories. It is made up of three parts: the Executive, Legislative and Judicial branches. You vote directly for your federal representatives in the Executive branch (the President & Vice-President) and the Legislative branch (House & Senate representatives in Congress). The Legislative Branch makes laws, the Executive Branch carries out the laws and the Judicial branch evaluates the laws; all Federal laws supersede State and Local laws.",
        state: "States are granted all powers not reserved to the federal government. These State Governments are typically modeled after the federal government with three distinct branches of government. You vote directly for state representatives in their respective executive and legislative branches.",
        county: "The County level is the lowest level of government besides Cities; it typically provides everyday services including police protection, fire protection, libraries and street management. You vote directly for local candidates.",
        city: "City government is the lowest level of government; it typically provides everyday services including police protection, fire protection, libraries and street management. Depending on the state, a City can either have seperate or shared authority with the surrounding County. You vote directly for local candidates."
    };
    var govOfficeDescriptions = {
        potus: "As head of the Executive Branch, this person serves as the chief of our country. They administer the executive branch of the government. The President serves a four-year term and can be elected no more than two times.",
        vpotus: "This person is the next in line to the President. In addition to supporting the president, the Vice-President presides over the Senate and has tie-breaking privileges.",
        ushouse: "Legislative member of the U.S. House of Representatives. Special duties include impeachment and introducing revenue bills. There are 435 Representatives. The number of representatives each state gets is determined by its population; some states have just 2 representatives while others have as many as 40. There are additional non-voting delegates who represent the District of Columbia and the territories. A Representative serves a two-year term, and there is no limit to the number of terms an individual can serve.",
        ussenate: "Legislative member of the U.S. Senate. Special duties include ratifying treaties and approving or rejecting presidential appointments. There are exactly two elected Senators per state, regardless of population. A Senate term is six years and there is no limit to the number of terms an individual can serve.",
        governor: "This person leads a state and is elected by the people who reside in that state. The Governor sends proposed legislation to the state's legislative body. The governor has veto power for all state legislation. ",
        lgovernor: "The second ranking state official behind the state governor. In about half of the states in the country, a lieutenant governor presides over the senate and can break ties the way a Vice-President can in the U.S. Senate.",
        stateattorneygeneral: "Chief legal officers of their state or territory. They advise and represent their legislature and state agencies and act as the 'People's Lawyer' for the citizens. Most are elected, though a few are appointed by the governor.",
        statedelegate: "A member of the state legislature. During legislative session, this person works with other state legislature members to approve the state budget, and considers legislation introduced by the state governor or other members of the legislative body among other duties. Each state's Constitution sets out the term limits and eligibility of state legislative members.",
        statesenator: "A member of the state legislature. During legislative session, this person works with other state legislature members to approve the state budget, and considers legislation introduced by the state governor or other members of the legislative body among other duties. Each state's Constitution sets out the term limits and eligibility of state legislative members.",
        sheriff: "An elected officer of a city, town, or village who serves as the chief of all police protection and local correctional operations. A sheriff enforces county law.",
        mayor: "This person leads a town or city. They carry out the state budget and decisions made by the Town/City Council or County Commission.",
        commissioner: "An elected officer who serves as local legislators and make laws about budgets for city or county.",
        councilmember: "An elected officer who serves as local legislators and make laws about budgets for city or county.",
        treasurer: "The treasurer is an elected constitutional officer charged with the collection, custody, and disbursement of funds. Duties also include collection and reporting on funds, though exact roles vary by state and locality.",
        commissionerofrevenue: "The commissioner of the revenue, an elected constitutional officer, prepares real estate and personal property tax books and bills; assesses personal property, machinery and tools, merchants' capital, and some business taxes; and, in some cities, assesses real estate. They are also the receiving point for state income tax forms. Terms vary by state and locality.",
        clerkcircuitcourt: "The clerk of the circuit court-an elected constitutional officer- works with the judge on coordinating trial schedules, maintaining jury lists, and handling other duties related to circuit court trials. The Clerk of Circuit Court also handles general record keeping for the locality: recordings of all documents relating to land transfers, deeds of trust, mortgages, births, deaths, wills and divorces – as well as recording election results and issuing hunting, fishing, and marriage licenses. Terms vary by state and locality."
    };


    // Declare functions

    // Detects URL parameters and executes accordingly
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

    // Helps activateUrlParameters(url)
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


    // Event Listeners
    
//    $("#c-header-tab-menu").click(function () {
//        $("#dropdownMenu1").click()
//    });
    
    // "Find Representatives" button, executes address-find
    $("#c-btn-list-generate").click(function () {
        generateReps_listPage_input();
    });
    
    // If you hit Enter on the keyboard for the List page Address Search, this works too
    $('#c-input-list-address').keypress(function (e) {
        if (e.which == 13) {
            generateReps_listPage_input();
            return false; //<---- Add this line
        }
    });
    
    // "Full Representative Info" button on the Map page after selecting a location
    $('#c-page-map-generatedReps').on("click", "#c-page-map-2ListButton", function () {

        if (true) {
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
        };

        generateReps_listPage_fromMap(apiValues_map)
    });

    // Toggles supplemental information on the list page
    $(".c-page-list-panel2-text").click(function () {
        if (supplementaryOn) {
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

    // helper function, gets the Address value and passes it to the html generator
    function generateReps_listPage_input() {

        var locationString = $("#c-input-list-address").val();
        generateReps_listPage_apiPull(locationString)

    };

    // passes command along from map page to generate the "snapshot" html
    function generateReps_mapPage_input(locationString) {

        generateReps_mapPage_apiPull(locationString)

    };

    // helper function for displaying the representatives, activates both google APIs
    function generateReps_listPage_apiPull(locationString) {
        Promise.all([
            apiPullReps(locationString),
            apiPullCoords(locationString)
        ]).then(function (apiValues) {

            // if the pull was successful
            if (apiValues[0]) {
                
                // Add elements to the list page now that there is data to work with
                $("#c-page-list-generatedReps").html("");
                $("#c-page-list-banner-content-body-panel2").css("display", "inline-block");
                $(".c-page-list-panel2-text").show();


                apiValues_list = apiValues;
                console.log("TEST");
                console.log(apiValues);
                console.log(apiValues_list);
                $("#c-input-list-address").val("");
                
                // generate the HTML
                $("#c-page-list-generatedReps").append(generateRepHtml(apiValues, 0));
                
                // Set up the URL sharing functionality
                var urlString =
                    "https://ourreps.org?page=list&address=" +
                    makeAddressUrlString([
                        apiValues[0]["normalizedInput"]
                    ]);
                $("#c-input-shareableUrl").val(urlString);
                $("#c-page-list-banner-content-body-panel2 a").attr("href", urlString);
                $("#c-input-list-address").attr("placeholder", "Change location");


                // update map
                try {
                    map_pageList.removeLayer(currentMarker_pageList);
                } catch (err) {}
                
                var apiCoords = apiValues[1]["results"][0]["geometry"]["location"];
                var latlng_pageList = L.latLng(apiCoords["lat"], apiCoords["lng"]);
                currentMarker_pageList = new L.marker(latlng_pageList).addTo(map_pageList);
                var boundsRadius = 0.012;
                var southWest = L.latLng(apiCoords["lat"] - boundsRadius + 0.003, apiCoords["lng"] - boundsRadius);
                var northEast = L.latLng(apiCoords["lat"] + boundsRadius + 0.003, apiCoords["lng"] + boundsRadius);
                var locationBounds = L.latLngBounds(southWest, northEast);
                map_pageList.flyToBounds(locationBounds, {
                    duration: 2,
                });

                applySupplementaryInformation()

            } else {
                // display "retry address" message
                console.log("Address invalid");
            }

        })
    };
    
    // helper function for displaying the representatives in snapshot format
    function generateReps_mapPage_apiPull(locationString) {

        Promise.all([
            apiPullReps(locationString),
            ""
//            apiPullCoords(locationString)
        ]).then(function (apiValues) {
            
            // if the pull was successful
            if (apiValues[0]) {
                $("#c-page-map-generatedReps").html("");
                apiValues_map = apiValues;
                //                apiValues_map[1] = 
                
                // generate the HTML
                $("#c-page-map-generatedReps").append(generateRepHtml(apiValues, 2))
            };
            
            // set up the snapshot info panel
            $("#c-page-map .repNameWrapper").prepend(
                "<span class='glyphicon glyphicon-user'></span> "
            );
            $(".repContactaddressDiv").append(
                "<button class='btn' id='c-page-map-2ListButton'>Full Representative Info</button> "
            );

        })
    };
    
    // helper function, gets the Address value and passes it to the html generator
    function generateReps_listPage_fromMap(apiValues) {
        changePage_map2list()
        
        // if pull is successful
        if (apiValues[0]) {
            
            // add elements to work with listed info
            $("#c-page-list-generatedReps").html("");
            $("#c-page-list-banner-content-body-panel2").css("display", "inline-block");
            $(".c-page-list-panel2-text").show();
            $("#c-page-list-generatedReps").append(generateRepHtml(apiValues, 0));
            
            // set up url functionality
            var urlString =
                "https://ourreps.org?page=list&address=" +
                makeAddressUrlString([
                        apiValues[0]["normalizedInput"]
                    ]);
            $("#c-input-shareableUrl").val(urlString);
            $("#c-page-list-banner-content-body-panel2 a").attr("href", urlString);
            $("#c-input-list-address").attr("placeholder", "Change location");


            // update map
            try {
                map_pageList.removeLayer(currentMarker_pageList);
            } catch (err) {};
            console.log("PROBLEM AREA ?");
            console.log(apiValues_map);
            var apiCoords = apiValues_map[1]["results"][0]["geometry"]["location"];
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
                    duration: 2,
                })

            }, 250);

            applySupplementaryInformation()

        } else {
            // display "retry address" message
            console.log("Address invalid");
        }
    };

    // Backbone for creating the HTML string
    function generateRepHtml(apiValues, skipVal) {

        if (true) {
            var [repsObject, locationObject] = apiValues;

            // prep lists for populating
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
                        "" +
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

    // function which sorts by one column of a 2d array, but keeps the order for items already in order
    function compare(a, b) {
        if (a[1] < b[1])
            return -1;
        if (a[1] > b[1])
            return 1;
        return a[0] - b[0];
    }

    // creates the HTML string for each repCard (each rep)
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
                            "",
                            "</div>",
                        "</div>",
                    "</div>",
                "</div>"
            ];

            // concatenate entire list into the returnVar string
            for (i_item in returnVarList) {
                returnVar += returnVarList[i_item]
            };
        }

        return returnVar
    };

    // helper function, makes one part of the repCard
    function makeRepCardString_img(officialsRepInfo) {
        if (officialsRepInfo["photoUrl"]) {
            var returnVar = "<div class='repImage'><img src='" + officialsRepInfo["photoUrl"] + "'></div>"
            return returnVar
        } else {
            var returnVar = "<div class='repImage'><img src='" + "/img/portrait_placeholder.png" + "'></div>"
            return returnVar
        }

    };
    
    // helper function, makes one part of the repCard
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

    // helper function, makes one part of the repCard
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

    // helper function, makes one part of the repCard
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
            return returnVar.replace(/ /g, "+")
        } else {
            return ""
        }
        return ""

    };

    // helper function, makes one part of the repCard
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

    // helper function, makes one part of the repCard
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

    // helper function, makes one part of the repCard
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

    // backbone for actually making contact with the API
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
    
    // backbone for actually making contact with the API
    function apiPullCoords(locationString) {
        var apiFullURLString = "https://maps.googleapis.com/maps/api/geocode/json?" +
            "address=" + locationString +
            "&key=" + apiKey;
        return Promise.resolve($.ajax({
            url: apiFullURLString
        }));
    };

    // populated the HTML after-the-fact with appropriate supplemental information
    function applySupplementaryInformation() {
        console.log("Starting applySupplementaryInformation()");

        var currentScopeTitle = "";

        $("#c-page-list-generatedReps").children().each(function (index) {

            if ($(this).hasClass("repGroupTitle")) {
                currentScopeTitle = $(this).text()
            } else if ($(this).hasClass("repSupplementalTitle")) {
                $(this).children().text(getScopeSupplementalInfo(currentScopeTitle))
            } else if ($(this).hasClass("repCardWrapper")) {

                var currentOfficeName = $(this).children(".repCard")
                    .children(".repContentWrapper")
                    .children(".repOffice").text();
                $(this).children(".repCard")
                    .children(".repContentWrapper")
                    .children(".repSupplementalInfo")
                    .text(getRepSupplementalInfo(currentOfficeName))
            }
        });
    };

    // helper function, determines the appropriate description to give
    function getScopeSupplementalInfo(scopeName) {

        if (scopeName.indexOf("Federal") >= 0) {
            return govScopeDescriptions["federal"]
        } else if (scopeName.indexOf("State") >= 0) {
            return govScopeDescriptions["state"]
        } else if (scopeName.indexOf("County") >= 0) {
            return govScopeDescriptions["county"]
        } else if (scopeName.indexOf("City") >= 0) {
            return govScopeDescriptions["city"]
        } else {
            return ""
        }

        return "scope supplemental info for " + scopeName
    };

    // helper function, determines the appropriate description to give
    function getRepSupplementalInfo(officeName) {
        if (officeName.indexOf("Vice-President of the United States") >= 0) {
            return govOfficeDescriptions["vpotus"]
        } else if (officeName.indexOf("President of the United States") >= 0) {
            return govOfficeDescriptions["potus"]
        } else if (officeName.indexOf("United States House") >= 0) {
            return govOfficeDescriptions["ushouse"]
        } else if (officeName.indexOf("United States Senate") >= 0) {
            return govOfficeDescriptions["ussenate"]
        } else if (officeName.indexOf("Governor") >= 0 && officeName.indexOf("nant") >= 0) {
            return govOfficeDescriptions["lgovernor"]
        } else if (officeName.indexOf("Governor") >= 0) {
            return govOfficeDescriptions["governor"]
        } else if (officeName.indexOf("Attorney General") >= 0) {
            return govOfficeDescriptions["stateattorneygeneral"]
        } else if (officeName.indexOf("State House") >= 0 && officeName.indexOf("District") >= 0) {
            return govOfficeDescriptions["statedelegate"]
        } else if (officeName.indexOf("Assembly") >= 0 && officeName.indexOf("District") >= 0) {
            return govOfficeDescriptions["statedelegate"]
        } else if (officeName.indexOf("State Senate") >= 0 && officeName.indexOf("District") >= 0) {
            return govOfficeDescriptions["statesenator"]
        } else if (officeName.indexOf("Sheriff") >= 0) {
            return govOfficeDescriptions["sheriff"]
        } else if (officeName.indexOf("Mayor") >= 0) {
            return govOfficeDescriptions["mayor"]
        } else if (officeName.indexOf("Commissioner") >= 0) {
            return govOfficeDescriptions["commissioner"]
        } else if (officeName.indexOf("Council Member") >= 0) {
            return govOfficeDescriptions["councilmember"]
        } else if (officeName.indexOf("Treasurer") >= 0) {
            return govOfficeDescriptions["treasurer"]
        } else if (officeName.indexOf("Clerk") >= 0 && officeName.indexOf("Court") >= 0) {
            return govOfficeDescriptions["clerkcircuitcourt"]
        } else {
            return "Visit the provided website or contact the office-holder for more information."
        }

    };


    // Start of the main loop
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
    var map_pageMap = L.map('c-page-map-mapFrame',{
        attributionControl: false
    }).setView([40, -100], 4);

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
        } catch (err) {}
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


    //    var districts;
    //    var states;

    Promise.all([
        getDistricts(),
        getStates()
    ]).then(function (layerVals) {

    })


    function getDistricts() {
        $.ajax("data/districts_115th_congress.geojson", {
            dataType: "json",
            success: function (response) {

                var myStyle = {
                    "color": "#94bfa2",
                    "weight": 1,
                    "fillColor": "transparent"
                };
                //Creates the symbology & popups using functions above in this function
                var districts = new L.geoJson(response, {
                    style: myStyle
                }).addTo(map_pageMap);

                return districts

            }
        });
    };

    function getStates() {
        $.ajax("data/states.geojson", {
            dataType: "json",
            success: function (response) {

                var myStyle = {
                    "color": "#2e8540",
                    "weight": 2,
                    "fillColor": "transparent"
                };
                //Creates the symbology & popups using functions above in this function
                var states = L.geoJson(response, {
                    style: myStyle
                }).addTo(map_pageMap);

                return states

            }
        });
    };



    //    console.log(districts);
    //    console.log(states);
    console.log(map_pageMap);
    console.log("map_pageMap.eachLayer");

    map_pageMap.eachLayer(function (layer) {
        console.log(layer)
    });

    //    if (map_pageMap.hasLayer(districts)) {
    //        map_pageMap.removeLayer(districts);
    //    } else {
    //        map_pageMap.addLayer(districts);
    //    }

    //    var overlayMaps = {
    //        "States": states,
    //        "Congressional Districts": congressionalDistricts
    //    };
    //
    //    L.control.layers(overlayMaps).addTo(map);

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
                //                apiValues_map = apiValues_list;
                apiValues_map_coords = apiValues_list[1]["results"][0]["geometry"]["location"];
                var apiCoords = apiValues_list[1]["results"][0]["geometry"]["location"];
                var latLongString = apiCoords["lat"] + ", " + apiCoords["lng"];
                generateReps_mapPage_input(latLongString);
                try {
                    map_pageMap.removeLayer(currentMarker_pageMap);
                } catch (err) {}
                var latlng = L.latLng(apiCoords["lat"], apiCoords["lng"]);
                currentMarker_pageMap = new L.marker(latlng).addTo(map_pageMap);

                var boundsRadius = 0.8;
                var southWest = L.latLng(parseFloat(apiCoords["lat"]) - boundsRadius, parseFloat(apiCoords["lng"]) - boundsRadius);
                var northEast = L.latLng(parseFloat(apiCoords["lat"]) + boundsRadius, parseFloat(apiCoords["lng"]) + boundsRadius);
                var locationBounds = L.latLngBounds(southWest, northEast);

                setTimeout(function () {
                    map_pageMap.flyToBounds(locationBounds, {
                        duration: 2,
                    })
                }, 250);
            }
        } catch (err) {
            console.log(err)
        }
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


// Functions to ensure proper page changing animations

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
        'background-color': '#112e51', //oldred
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
        'background-color': '#112e51', //oldred
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
