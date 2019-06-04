  var map;
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });
	google.maps.event.addListener(map, 'click',function(event){
		console.log(event);
		
		fetch('https://api.openweathermap.org/data/2.5/weather?lat='+event.latLng.lat()+'&lon='+event.latLng.lng()+'&appid=1b5ee5a1a74d624a74750350327ea372')
			.then(function(response) {
				response.json().then(function(data) {
					console.log(data);
					var marker = new google.maps.Marker({
						position:{lat:event.latLng.lat(), lng:event.latLng.lng()},
						map:map,
						icon:'http://openweathermap.org/img/w/'+data.weather[0].icon+'.png'
					});
					
					var infoWindow = new google.maps.InfoWindow({
						content: data.name + ' temp = ' + data.main.temp 	
					});
					
					marker.addListener('click',function(){
						infoWindow.open(map, marker);
					});
				});
			});
	});
  }
  
