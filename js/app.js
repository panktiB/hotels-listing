

// $(document).ready(function() {
//
// 	$.ajax({
// 		url: 'http://localhost:3000/hotel-search-response',
// 		dataType: 'jsonp',
// 		success:  function (res) {
// 			let o = res.hotels;
// 			// console.log(o["basic-info"]["hotel-info:hotel-name"]);
// 			// console.log(o);
// 			console.log(o.hotel);
// 			// console.log(o.hotel[0]["room-rates"]["room-rate"]);
// 			let roomRateArr = o.hotel[0]["room-rates"]["room-rate"]; // to get common:pricing-element
// 			// console.log(roomRateArr[0]["rate-breakdown"]["common:rate"]["common:pricing-elements"]);
// 			let commonPricing = roomRateArr[0]["rate-breakdown"]["common:rate"]["common:pricing-elements"];
// 			// console.log(commonPricing);
// 			let thumbnailimg = o.hotel[0]["basic-info"]["thumb-nail-image"];
// 		}
//
// 	});
//
// 	})
