// All code wrapped in self-executing function
(function () {

    // Start main JavaScript stream
    function main() {

        //        startPersonalizedGuide("invalid input")
        //startPersonalizedGuide("1415 Kamehameha IV Rd Honolulu HI");

    };


    // Initialize variables
    var apiKey = "";
    var repsData_personalizedGuide
    var repsData_exploreMap

    // Declare functions

    function startPersonalizedGuide(locationString) {

        try {
            Promise.all([
            apiPullReps(locationString),
            apiPullCoords(locationString)
        ]).then(function (promiseValues) {

                console.log(promiseValues)
                    // unpack the loaded data into variables
                    //var [csvData, jsonStates] = promiseValues

            })
        } catch {
            console.log("error in promise.all")
        }
    }

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
    }

    function apiPullCoords(locationString) {
        var apiFullURLString = "https://maps.googleapis.com/maps/api/geocode/json?" +
            "address=" + locationString +
            "&key=" + apiKey;
        return Promise.resolve($.ajax({
            url: apiFullURLString
        }));
    }


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
    $("#header-tab-sheet").attr("onclick", "changePage_map2sheet()")
}

function changePage_guide2sheet() {
    $("#page-guide").hide("slide", {
        direction: "left"
    }, 300);
    $("#page-sheet").delay(100).show("slide", {
        direction: "right"
    }, 300);
    $("#header-tab-guide").attr("onclick", "changePage_sheet2guide()")
    $("#header-tab-map").attr("onclick", "changePage_sheet2map()")
    $("#header-tab-sheet").attr("onclick", "")
}

function changePage_map2guide() {
    $("#page-map").hide("slide", {
        direction: "right"
    }, 300);
    $("#page-guide").delay(100).show("slide", {
        direction: "left"
    }, 300);
    $("#header-tab-guide").attr("onclick", "")
    $("#header-tab-map").attr("onclick", "changePage_guide2map()")
    $("#header-tab-sheet").attr("onclick", "changePage_guide2sheet()")
}

function changePage_map2sheet() {
    $("#page-map").hide("slide", {
        direction: "left"
    }, 300);
    $("#page-sheet").delay(100).show("slide", {
        direction: "right"
    }, 300);
    $("#header-tab-guide").attr("onclick", "changePage_sheet2guide()")
    $("#header-tab-map").attr("onclick", "changePage_sheet2map()")
    $("#header-tab-sheet").attr("onclick", "")
}

function changePage_sheet2map() {
    $("#page-sheet").hide("slide", {
        direction: "right"
    }, 300);
    $("#page-map").delay(100).show("slide", {
        direction: "left"
    }, 300);
    $("#header-tab-guide").attr("onclick", "changePage_map2guide()")
    $("#header-tab-map").attr("onclick", "")
    $("#header-tab-sheet").attr("onclick", "changePage_map2sheet()")
}

function changePage_sheet2guide() {
    $("#page-sheet").hide("slide", {
        direction: "right"
    }, 300);
    $("#page-guide").delay(100).show("slide", {
        direction: "left"
    }, 300);
    $("#header-tab-guide").attr("onclick", "")
    $("#header-tab-map").attr("onclick", "changePage_guide2map()")
    $("#header-tab-sheet").attr("onclick", "changePage_guide2sheet()")
}
