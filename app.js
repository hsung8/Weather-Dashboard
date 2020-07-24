var citySearch = document.getElementById("citySearch")
var searchArray = []
var today = moment().format("M" + "/" + "D" + "/" + "YYYY")
var api = "c579d0da1a725ebe94f2273b287a623c";

function searchWeather(city) {

    for (var i = 0; i <= 4; i++) {
        $("#forecast" + i).empty();
    }

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + api

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var weatherImg = 'https://openweathermap.org/img/wn/' + response.weather[0].icon + '.png';
        $("#current-city").html(response.name + " (" + today + ") " + "<img src=" + weatherImg + "> </img>")

        var temp = parseFloat(((response.main.temp) - 273.15) * 1.8 + 32).toFixed(1)
        $("#temp").html("Current Temperature: " + temp + "<span>&deg</span> F")

        var humidity = response.main.humidity
        $("#humidity").html("Current Humidity: " + humidity + "%")

        var windSpeed = parseFloat(response.wind.speed).toFixed(1);
        $("#wind").html("Current Wind Speed: " + windSpeed + " MPH")

        //UV
        var lon = response.coord.lon;
        var lat = response.coord.lat

        var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?cnt=5&lat=" + lat + "&lon=" + lon + "&APPID=" + api

        $.ajax({
            url: uvUrl,
            method: "GET"
        }).then(function(response) {
            console.log(response.value)
            $("#uv").html("UV Index: ").append(response.value);
        })

        //forecast
        queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + api
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            $("#forecast").removeClass("d-none");

            for (var i = 0; i <= 4; i++) {

                $("<h6>").html(moment().add(i + 1, "days").format("M" + "/" + "D" + "/" + "YYYY")).appendTo("#forecast" + i);

                $("#forecast" + i).removeClass("d-none");

                weatherImg = 'https://openweathermap.org/img/wn/' + response.list[i].weather[0].icon + '@2x.png'
                
                $("<img>").attr("src", weatherImg).appendTo("#forecast" + i);

                $("<p>").html("Temp: " + parseFloat(((response.list[i].main.temp) - 273.15) * 1.8 + 32).toFixed(2) + "<span>&deg</span> F").appendTo("#forecast" + i);

                $("<p>").html("Humidity: " + parseInt(response.list[i].main.humidity) + "%").appendTo("#forecast" + i);
            }
        })

    })
}

function renderBtns() {
    for (var i = 0; i < searchArray.length; i++) {
        var cityHistory = $("<div>");
        var newCityBtn = $("<button>").addClass("cities").text(searchArray[i]).appendTo(cityHistory);
        $("#city-history").prepend(newCityBtn);
    }
}

function initSearch() {
    searchArray = JSON.parse(localStorage.getItem("searchArray"));
    if (!searchArray) {
        searchArray = [];
    }
    else {
        renderBtns();
    }
}

$("#searchBtn").on("click", function () {
    city = citySearch.value;
    if (city !== "") {
        searchArray.push(city);
        localStorage.setItem("searchArray", JSON.stringify(searchArray));

        var cityHistory = $("<div>");
        var newCityBtn = $("<button>").addClass("cities").text(city).appendTo(cityHistory);
        $("#city-history").prepend(newCityBtn);

        searchWeather(city);
    } else {
        $("#current-city").html("Please type valid city name");
        $("#temp").empty()
        $("#humidity").empty()
        $("#wind").empty()
        $("#uv").empty()
        $("#forecast-card").empty()
    }
});

$(document).on("click", ".cities", function () {
    city = $(this).html();
    searchWeather(city);
});

initSearch();