// Set api token
mapboxgl.accessToken = 'pk.eyJ1Ijoia2lraWhhYW1rZSIsImEiOiJja24zZjB2YnIwdWNsMm5vdTIycXZlYmM4In0.TEn26F_1TdNmQP7Zlcmw1w';

// Initialate map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/kikihaamke/ckmlxufnw11oi17rm0512tfa6',
  center: [4.322840, 52.067101],
  zoom: 15,
});

// var popup = new mapboxgl.Popup().setHTML('<h3>De Haagse Hogeschool</h3><p>Is momenteel dicht.</p>');
//
// // Adding a marker based on lon lat coordinates
// var marker = new mapboxgl.Marker()
//   .setLngLat([4.324439, 52.067200])
//   .setPopup(popup)
//   .addTo(map);

map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    }),
    'top-right'
);



