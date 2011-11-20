$(document).ready(function () {
  initialize();    
});


function initialize() {
  var canvas = document.getElementById("mapCanvas"),
      latlng = new google.maps.LatLng(37.3,-0.6);

  var myOptions = {
    zoom: 2,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };

  var map = new google.maps.Map(canvas, myOptions);

  getItems(map);

}

function getItems(map) {
  $.ajax({
    url: '/items.json',    
    success: function (res) {

      console.log(res);

      var items = res.rows,
          len   = items.length,
          buffer = [],
          i;

      for (var i = 0; i < len; i++) {
        var item = items[i].value;
        
        buffer.push('<li>', item.OwnerName, '</li>');
        plotItem(item, map);
      }

      $('#itemList').html(buffer.join(''));

    }
  });
}

function plotItem(item, map) {
  var resi = item,
      lat = resi.ProjectLatitude,
      lon = resi.ProjectLongitude,
      latlng = new google.maps.LatLng(lat, lon);

  // var markerimage = new google.maps.MarkerImage();
  // markerimage.size = new google.maps.Size(80, 80);
  // markerimage.scaledSize = new google.maps.Size(80, 80);
  // markerimage.url = '';

  var marker = new google.maps.Marker({
        position:   latlng,
        map:        map
      });

  // marker.setIcon(markerimage);

}
