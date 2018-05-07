// All code wrapped in self-executing function
(function () {

    // Start main JavaScript stream
    function main() {

        changePage_guide2list()

        //        startPersonalizedGuide("invalid input")
        //startPersonalizedGuide("1601 fieldthorn drive reston va");
        //        startPersonalizedGuide("1415 Kamehameha IV Rd Honolulu HI");
        //        startPersonalizedGuide("7409 Welton Dr Madison, WI 53719");

    };


    // Initialize variables
    var apiKey = "";
    var repsData_personalizedGuide;
    var repsData_exploreMap;

    // Declare functions

    function startPersonalizedGuide(locationString) {

        Promise.all([
            apiPullReps(locationString),
            apiPullCoords(locationString)
        ]).then(function (promiseValues) {

            console.log(promiseValues)
            // unpack the loaded data into variables
            //var [csvData, jsonStates] = promiseValues

        })

    };

    $("#c-btn-list-generate").click(function () {
        generateReps_listPage_input();
    });

    function generateReps_listPage_input() {
        var locationString = $("#c-input-list-address").val();
        generateReps_listPage_apiPull(locationString)
        
    };
    
    function generateReps_listPage_apiPull(locationString){
        Promise.all([
            apiPullReps(locationString),
            apiPullCoords(locationString)
        ]).then(function (apiValues) {
            $("#c-page-list-generatedReps").append(generateRepHtml(apiValues))

        })
    };
    
    function generateReps_listPage_fromMap(apiValues){
        $("#c-page-list-generatedReps").append(generateRepHtml(apiValues))
    };
    
    function generateRepHtml(apiValues){
            console.log("Starting generateReps_listPage_input()");

            if (true) {
                var [repsObject, locationObject] = promiseValues;

                console.log("repsObject:")
                console.log(repsObject)
                console.log("locationObject:")
                console.log(locationObject)

                var repHtmlStringsList = [];
                
                    repHtmlStringsList.push("<p>Start of Representatives</p>");

                for (i_office in repsObject["offices"]) {
                    
                    repHtmlStringsList.push(
                        makeOfficeHtml(repsObject, i_office)
                    )
                    
//                        "<p>" + repsObject["offices"][i_office]["name"] + "</p>" +
//                        "<br>"

                };
                
                return repHtmlStringsList
            };
    };
    
    function makeOfficeHtml(repsObject, i_office){
        
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
        'background-color': 'transparent'
    });
    $("#c-header-tab-map").css({
        'font-weight': '800',
        'background-color': 'white',
        'border-bottom': '2px solid white'
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
