// All code wrapped in self-executing function
(function () {

    // Start main JavaScript stream
    function main() {
        //        apiPullReps("38.990875, -77.345688")
        //        apiPullCoords("1601 fieldthorn drive reston va");


    };





    // Declare functions

    var apiUrlKey = "";

    function apiPullCoords(locationString) {
        //https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY

        var apiFullURLString = "https://maps.googleapis.com/maps/api/geocode/json?" +
            "address=" + locationString +
            "&key=" + apiUrlKey;
        console.log(apiFullURLString);
        $.ajax({
            url: apiFullURLString,
            success: function (returnObject) {
                console.log(returnObject);
            }
        });
    }

    function apiPullReps(locationString) {
        var apiFullURLString = "https://www.googleapis.com/civicinfo/v2/" +
            "representatives" +
            "?key=" + apiUrlKey +
            "&address=" + locationString
        $.ajax({
            url: apiFullURLString,
            success: function (returnObject) {
                console.log(returnObject);
            }
        });
    }



    main()

})();
