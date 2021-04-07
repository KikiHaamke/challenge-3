mapboxgl.accessToken = 'pk.eyJ1Ijoia2lraWhhYW1rZSIsImEiOiJja24zZjB2YnIwdWNsMm5vdTIycXZlYmM4In0.TEn26F_1TdNmQP7Zlcmw1w';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/kikihaamke/ckmlxufnw11oi17rm0512tfa6', // style URL
    center: [5.7, 52.22], // starting position [lng, lat]
    zoom: 5 // starting zoom
});

var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    types: 'country,region,place,postcode,locality,neighborhood'
});
var features = [];

geocoder.addTo('#geocoder');

// Add geocoder result to container.
geocoder.on('result', function (e) {
    let coords = e.result.geometry.coordinates;

    //update map, go to coordinates
    map.flyTo({
        center: coords,
        zoom: 15
    });

    features = [];
    getRestaurants(coords);
    getCultural(coords);
});


function getRestaurants(coords) {
    const openTripMapKey = '5ae2e3f221c38a28845f05b65370e244b3b310f07de647889ddf591c';
    let url = 'https://api.opentripmap.com/0.1/en/places/radius',
        qString = '?radius=1500&lon=' + coords[0] + '&lat=' + coords[1] + '&kinds=restaurants&limit=25&apikey=' + openTripMapKey;

    fetch(url + qString)
        .then(resp => {
            return resp.json();
        }).then(data => {
        let restaurants = data.features;

        for (let i = 0; i < restaurants.length; i++) {
            let restaurant = restaurants[i];

            let obj = {};
            obj.id = restaurant.id;
            obj.type = 'Feature';
            obj.properties = {};
            obj.properties.description = '<strong>' + restaurant.properties.name + '</strong>';
            obj.properties.icon = 'restaurant';
            obj.geometry = {};
            obj.geometry.type = 'Point';
            obj.geometry.coordinates = restaurant.geometry.coordinates;

            features.push(obj);
        }
        placeMarkers();
    }).catch((error) => {
        alert(error);
    })
}

function getCultural(coords) {
    const openTripMapKey = '5ae2e3f221c38a28845f05b65370e244b3b310f07de647889ddf591c';
    let url = 'https://api.opentripmap.com/0.1/en/places/radius',
        qString = '?radius=1500&lon=' + coords[0] + '&lat=' + coords[1] + '&kinds=cultural&limit=5&apikey=' + openTripMapKey;

    fetch(url + qString)
        .then(resp => {
            return resp.json();
        }).then(data => {
        let culturals = data.features;

        for (let i = 0; i < culturals.length; i++) {
            let url2 = 'https://api.opentripmap.com/0.1/en/places/xid/' + culturals[i].id,
                qString2 = '?apikey=' + openTripMapKey;

            fetch(url2 + qString2)
                .then(resp => {
                    return resp.json();
                }).then(data => {
                var childNodes = document.querySelectorAll('#cultural' + (i + 1) + '> *');
                childNodes[0].innerHTML = data.name;
                childNodes[1].src = data.preview ? data.preview.source : '';
                childNodes[2].innerHTML = data.wikipedia_extracts ? data.wikipedia_extracts.text : '';
            }).catch((error) => {
                alert(error);
            })
        }
    }).catch((error) => {
        alert(error);
    })
}

function placeMarkers() {
    map.addSource('places', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': features
        }
    });

    // Add a layer showing the places.
    map.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'places',
        'layout': {
            'icon-image': '{icon}-15',
            'icon-size': 2,
            'icon-allow-overlap': true
        }
    });

    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'places', function (e) {

        const openTripMapKey = '5ae2e3f221c38a28845f05b65370e244b3b310f07de647889ddf591c';
        let url = 'https://api.opentripmap.com/0.1/en/places/xid/' + e.features[0].id,
            qString = '?apikey=' + openTripMapKey;
        fetch(url + qString)
            .then(resp => {
                return resp.json();
            }).then(data => {
            let address = '<p>' + data.address.road + ' ' + data.address.house_number + '<br>' + data.address.postcode + ' ' + data.address.city + '<br>' + data.address.country + '</p>';
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description + address;

            // Populate the popup and set its coordinates based on the feature found.
            popup.setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        }).catch((error) => {
            alert(error);
        })
    });

    map.on('mouseleave', 'places', function () {
        popup.remove();
    });
}