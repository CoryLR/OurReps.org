// All code wrapped in self-executing function
(function () {

    // Start main JavaScript stream
    function main() {

        startPersonalizedGuide("invalid input")
            //        startPersonalizedGuide("1415 Kamehameha IV Rd Honolulu HI")

    };


    // Initialize variables
    var apiUrlKey = "";
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
            "?key=" + apiUrlKey +
            "&address=" + locationString
        return Promise.resolve($.ajax({
                url: apiFullURLString,
                //            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //                console.log("XMLHttpRequest, textStatus, errorThrown")
                //                console.log(XMLHttpRequest.status)
                //            }
            })
            .catch(function (err) {
                //                console.log(err)
                //                console.log("test")
            })
        );
    }

    function apiPullCoords(locationString) {
        var apiFullURLString = "https://maps.googleapis.com/maps/api/geocode/json?" +
            "address=" + locationString +
            "&key=" + apiUrlKey;
        return Promise.resolve($.ajax({
            url: apiFullURLString
        }));
    }


    main()

})();
