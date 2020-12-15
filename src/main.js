
mapboxgl.accessToken =
  "pk.eyJ1Ijoia2FwaWxiaGlzZSIsImEiOiJja2c3cjdyaHgwNmgyMnFsc2JrNTkya29vIn0.bbAfECAiS8BjLLSANMhsew";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v9",
  center: [0, 0],
  maxBounds: [
    [-180, -85],
    [180, 85],
  ],
  zoom: 1,
});

var url = "/findiss";

map.on("load", function () {
  window.setInterval(function () {
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        var data = json,
          issLastSeen = data.features[0].geometry.coordinates,
          details = data.features[0].properties,
          resultingDOM = "";
        for (var prop in details) {
          resultingDOM +=
            "<span class='title'>" +
            prop.toUpperCase() +
            "</span>" +
            " " +
            details[prop] +
            "</br>";
        }

        document.getElementById("details").innerHTML = resultingDOM;
        document
          .getElementById("locate")
          .setAttribute("data-coordinate", JSON.stringify(issLastSeen));

        map.getSource("iss").setData(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, 1000);
  console.log(url);
  map.addSource("iss", { type: "geojson", data: url });
  map.addLayer({
    id: "iss",
    type: "symbol",
    source: "iss",
    layout: {
      "icon-image": "rocket-15",
    },
  });

  map.addControl(new mapboxgl.FullscreenControl());

  document.getElementById("locate").addEventListener("click", function (e) {
    var lastSeenLocaton = JSON.parse(this.getAttribute("data-coordinate"));
    map.flyTo({
      center: lastSeenLocaton,
    });
  });
});
