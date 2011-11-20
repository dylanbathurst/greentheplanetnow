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
    url: '/projects.json',    
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
      latlng = new google.maps.LatLng(lat, lon),
      x;

  for (x in item._attachments) {
    item.imageName = x;
  }

  var markerimage = new google.maps.MarkerImage();
  markerimage.size = new google.maps.Size(50, 50);
  markerimage.scaledSize = new google.maps.Size(50, 50);
  markerimage.url = 'http://dylan.couchone.com:5984/greentheplanet/' + item._id + '/' + item.imageName;

  var marker = new google.maps.Marker({
    position:   latlng,
    map:        map
  });

  marker.setIcon(markerimage);
  google.maps.event.addListener(marker, 'click', function() {
      
    var contentString = '<div><h1><a href="/projects/' + item._id +
                        '">' + item.ProjectName + '</a></h1>' +
                        '<span>' + item.ProjectCategory + '</span>' +
                        '<span>' + item.OwnerName + '</span>' +
                        '<span>' + item.Description + '</span>' +
                        '<span>' + item.FundingReceived + '</span>' +
                        '<span>' + item.FundingNeeded + '</span>';

    if (item.ProjectVideo) {
      console.log(item.ProjectVideo.videoId);
      contentString += '<iframe src="http://player.vimeo.com/video/' + item.ProjectVideo.videoId + '?title=0&amp;byline=0&amp;portrait=0" width="400" height="300" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>'
    } else {
      contentString += '</div>';
    }

    var infoWindow = new google.maps.InfoWindow({
      content: contentString    
    });

    infoWindow.open(map, marker);
    
  });

}

