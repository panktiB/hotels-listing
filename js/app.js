// hotelBasicInfo;
// hotelRoomRate;
var basicInfoArr = [];
var rateArr = [];
var likeStatus = [];
var baseUrl;

$(document).ready(function() {
//
	$.ajax({
		url: 'http://localhost:3000/hotel-search-response',
		dataType: 'jsonp',
		success: (response) => callSuccess(response),
    error: (error) => callError(error)

	 });
})

function callError(error) {
  console.log(error);
}

var basicInfoObj = {};

function callSuccess(response) {
  baseUrl = response["base-url"];
  let hotelArr = response.hotels.hotel;
  let count=0;
  let row;
  // console.log(response);

  for(let i=0; i<hotelArr.length; i++){
    count++;
    let basicInfo = hotelArr[i]["basic-info"];
    basicInfoArr.push(basicInfo);
    likeStatus.push(false);
    // rateArr.push(loopPrices(hotelArr[i]["room-rates"]["room-rate"]));
    loopPrices(hotelArr[i]["room-rates"]["room-rate"]);
    // console.log(hotelArr[i]["basic-info"]);
    // document.getElementById('hotelName').innerHTML = hotelArr[i]["basic-info"]["hotel-info:hotel-name"];
    // locality = hotelArr[i]["basic-info"]["hotel-info:locality"];
    // rating = hotelArr[i]["basic-info"]["hotel-info:star-rating"];
    // prices = hotelArr[i]["room-rates"]["room-rate"];
    // // console.log(name, locality, rating);
    // let min = loopPrices(prices);
    //
    // row = "<div class='row'><div class='col-md-12'>" + name + locality + rating + '    '+ min + "</div></div>"
    //
    // elt.innerHTML += innerHTML;
  }

  populatepage();

}

function toggleLike(event) {
  console.log(event.target.innerHTML);
  if (event.target.innerHTML=='false') {
    event.target.innerHTML = true;
  } else if(event.target.innerHTML=='true') {
    event.target.innerHTML = false;
  }
}

function loopPrices(arr) {
  let minprice = 0;
  // let rateArr = [];
  for(let i=0; i< arr.length; i++) {
    // console.log(arr[i]["rate-breakdown"]["common:rate"]["common:pricing-elements"]["common:pricing-element"]);
    let temp = arr[i]["rate-breakdown"]["common:rate"]["common:pricing-elements"]["common:pricing-element"];
    // console.log(temp);
    rateArr.push(temp);
    // rateArr.push(loopPrices(hotelArr[i]["room-rates"]["room-rate"]));
    // temp.forEach(function (item) {
    //   // console.log(item["common:amount"]);
    //   minprice += item["common:amount"];
    // })
    // console.log(minprice);
  }
  // return rateArr;
}

function populatepage() {
  let elt = document.getElementById('add');
  var start = "<div class='row'><div class='col-xs-12'>";
  let innerHTML = elt.innerHTML;
  console.log(basicInfoArr[0]);
  console.log(rateArr[0]);
  // var hotelName = '<h3>';
  // var localityName = "<div class='col-xs-6'>";
  // var rating = "<div class='col-xs-6'>";
  // var rent = "<div class='col-xs-6'>";
  // basicInfoArr.forEach(function (item) {
  //
  // });
  for(let i=0; i<10; i++) {
    // var start = "<div class='row'><div class='col-xs-12'>";
    // <a target="_blank" href="https://www.cleartrip.com/hotels/info/shivas-gateway-1361272/1361/1361272/images/LRM_EXPORT_20160903_230653_tn.jpg">
    //     <img src="img-try.jpg" alt="Forest">
    //   </a>
    var hotelName = '<h3>';
    var localityName = "<div class='col-xs-6'>";
    var rating = "<div class='col-xs-6'>";
    var rent = "<div class='col-xs-6'>";
    var thumbnail = "<a target='_blank' href='https://www.cleartrip.com'" + baseUrl + basicInfoArr[i]["thumb-nail-image"] + "'><img src='./images/web-img.png' alt='cleartrip image'></a>";
    hotelName += basicInfoArr[i]["hotel-info:hotel-name"] + "</h3>";
    localityName += basicInfoArr[i]["hotel-info:locality"] + "</div>";
    rating += basicInfoArr[i]["hotel-info:star-rating"] + "</div>";

    var like = "<div class='col-xs-6' onclick='toggleLike(event)'>";
    like += likeStatus[i] + "</div>"

    //document.getElementById('one').innerHTML = hotelName + localityName;
    let minprice = 0;
    rateArr[i].forEach(function (item) {
      minprice += item["common:amount"];
    });
    if(i==9) {
      start += hotelName + localityName + rating + "min price is " + minprice + "</div></div>";
    }
    else {
      start += hotelName + localityName + rating + "min price is " + minprice + like + thumbnail + "</div></div><div class='row'><div class='col-xs-12'>";
    }





    elt.innerHTML = start;
    // start = "<div class='row'><div class='col-xs-12'>";
  }



}
