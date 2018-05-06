// All code wrapped in self-executing function
(function () {

    // Start main JavaScript stream
    function main() {

        //changePage_list2guide()

        //        startPersonalizedGuide("invalid input")
        //startPersonalizedGuide("1601 fieldthorn drive reston va");
        //        startPersonalizedGuide("1415 Kamehameha IV Rd Honolulu HI");
        //startPersonalizedGuide("7409 Welton Dr Madison, WI 53719");

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
    $("#page-guide").hide("slide", {
        direction: "left"
    }, 300);
    $("#page-map").delay(100).show("slide", {
        direction: "right"
    }, 300);
    $("#header-tab-guide").attr("onclick", "changePage_map2guide()")
    $("#header-tab-map").attr("onclick", "")
    $("#header-tab-list").attr("onclick", "changePage_map2list()");
    $("#header-tab-guide").css({
        'font-weight': '600',
        'color': 'black',
        'background-color': 'transparent'
    });
    $("#header-tab-map").css({
        'font-weight': '800',
        'background-color': 'white',
        'border-bottom': '2px solid white'
    });
};

function changePage_guide2list() {
    $("#page-guide").hide("slide", {
        direction: "left"
    }, 300);
    $("#page-list").delay(100).show("slide", {
        direction: "right"
    }, 300);
    $("#header-tab-guide").attr("onclick", "changePage_list2guide()");
    $("#header-tab-map").attr("onclick", "changePage_list2map()");
    $("#header-tab-list").attr("onclick", "");
    $("#header-tab-guide").css({
        'font-weight': '600',
        'color': 'black',
        'background-color': 'transparent',
        'border-bottom': '0px'
    });
    $("#header-tab-list").css({
        'font-weight': '800',
        'color': 'white',
        'background-color': '#112e51',
        'border-bottom': '0px'
    });
};

function changePage_map2guide() {
    $("#page-map").hide("slide", {
        direction: "right"
    }, 300);
    $("#page-guide").delay(100).show("slide", {
        direction: "left"
    }, 300);
    $("#header-tab-guide").attr("onclick", "");
    $("#header-tab-map").attr("onclick", "changePage_guide2map()");
    $("#header-tab-list").attr("onclick", "changePage_guide2list()");
    $("#header-tab-map").css({
        'font-weight': '600',
        'color': 'black',
        'background-color': 'transparent',
        'border-bottom': '0px'
    });
    $("#header-tab-guide").css({
        'font-weight': '800',
        'color': 'white',
        'background-color': '#981b1e',
        'border-bottom': '0px'
    });
};

function changePage_map2list() {
    $("#page-map").hide("slide", {
        direction: "left"
    }, 300);
    $("#page-list").delay(100).show("slide", {
        direction: "right"
    }, 300);
    $("#header-tab-guide").attr("onclick", "changePage_list2guide()");
    $("#header-tab-map").attr("onclick", "changePage_list2map()");
    $("#header-tab-list").attr("onclick", "");
    $("#header-tab-map").css({
        'font-weight': '600',
        'color': 'black',
        'background-color': 'transparent',
        'border-bottom': '0px'
    });
    $("#header-tab-list").css({
        'font-weight': '800',
        'color': 'white',
        'background-color': '#112e51',
        'border-bottom': '0px'
    });
};

function changePage_list2map() {
    $("#page-list").hide("slide", {
        direction: "right"
    }, 300);
    $("#page-map").delay(100).show("slide", {
        direction: "left"
    }, 300);
    $("#header-tab-guide").attr("onclick", "changePage_map2guide()");
    $("#header-tab-map").attr("onclick", "");
    $("#header-tab-list").attr("onclick", "changePage_map2list()");
    $("#header-tab-list").css({
        'font-weight': '600',
        'color': 'black',
        'background-color': 'transparent'
    });
    $("#header-tab-map").css({
        'font-weight': '800',
        'background-color': 'white',
        'border-bottom': '2px solid white'
    });

};

function changePage_list2guide() {
    $("#page-list").hide("slide", {
        direction: "right"
    }, 300);
    $("#page-guide").delay(100).show("slide", {
        direction: "left"
    }, 300);
    $("#header-tab-guide").attr("onclick", "");
    $("#header-tab-map").attr("onclick", "changePage_guide2map()");
    $("#header-tab-list").attr("onclick", "changePage_guide2list()");
    $("#header-tab-list").css({
        'font-weight': '600',
        'color': 'black',
        'background-color': 'transparent',
        'border-bottom': '0px'
    });
    $("#header-tab-guide").css({
        'font-weight': '800',
        'color': 'white',
        'background-color': '#981b1e',
        'border-bottom': '0px'
    });
}
