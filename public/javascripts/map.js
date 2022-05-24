// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()
mapboxgl.accessToken = mapToken;
    if (service.geometry.coordinates.length) {
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: service.geometry.coordinates, // starting position [lng, lat]
    zoom: 6 // starting zoom
    });
    map.addControl(new mapboxgl.NavigationControl());
    // Create a default Marker and add it to the map.

    const marker1 = new mapboxgl.Marker()
      .setLngLat(service.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(
          `<h4>${service.title}</h4><p>${service.location}</p>`
        )
      )
        .addTo(map);
    } else {
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-1.259026, 51.850286], // starting position [lng, lat]
    zoom: 5 // starting zoom
    });
    map.addControl(new mapboxgl.NavigationControl());
}

