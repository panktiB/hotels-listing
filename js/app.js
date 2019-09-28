//initialising empty arrays to store data from hotelresponse
var basicInfoArr = [];
var rateArr = [];
var likeStatus = [];
var baseUrl;
var yes = "yeseses";

//get request to fetch the json hosted over local server
$(document).ready(function() {

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

//function populates the data arrays hotelArr, basicInfo, likeStatus
function callSuccess(response) {
  baseUrl = response["base-url"];
  let hotelArr = response.hotels.hotel;
  let count=0;
  let row;

  for(let i=0; i<hotelArr.length; i++){
    count++;
    let basicInfo = hotelArr[i]["basic-info"];
    basicInfoArr.push(basicInfo);
    likeStatus.push(false);
    loopPrices(hotelArr[i]["room-rates"]["room-rate"]);

  }

  //function to populate the data to html
  populatepage();

}


function filterLikes() {
  var rows = document.getElementsByClassName('row');

  var filtered = $('.row').filter(function() {
    return !$(this).children('.active').length;
  });
  console.log(filtered[0].children);
}

// room rates are in an array, function loops over it and populates rateArr
function loopPrices(arr) {
  let minprice = 0;
  for(let i=0; i< arr.length; i++) {
    let temp = arr[i]["rate-breakdown"]["common:rate"]["common:pricing-elements"]["common:pricing-element"];
    rateArr.push(temp);
  }
}

//populate the html
function populatepage() {
  let elt = document.getElementById('add');
  var start = "<div class='row'>";
  let innerHTML = elt.innerHTML;


  for(let i=0; i< 300; i++) {

    var hotelName = '<h3>';
    var localityName = "<div class='col-xs-6'>Locality - ";
    var rating = "<div class='col-xs-4 offset-1 text-center'> Rating - ";
    var rent = "<div class='col-xs-4'> minimum rate per night - ";
    var thumbnail = "<div class='col-xs-4 text-right'><a target='_blank' href='https://www.cleartrip.com'" + baseUrl + basicInfoArr[i]["thumb-nail-image"] + "'><img src='./images/web-img.png' alt='cleartrip image'></a></div>";
    hotelName += basicInfoArr[i]["hotel-info:hotel-name"] + "</h3>";
    localityName += basicInfoArr[i]["hotel-info:locality"] + "</div>";
    rating += basicInfoArr[i]["hotel-info:star-rating"] + "</div>";

    var like = "<div class='col-xs-6 text-right'><button type='button'class='btn btn-primary btn-sm likebtn'><span class='glyphicon glyphicon-thumbs-up'></span></button>";
    like += "</div>"
    let minprice = 0;
    rateArr[i].forEach(function (item) {
      minprice += item["common:amount"];
    });

    rent += minprice + "</div>"

    start += hotelName + localityName + like + rent + rating + thumbnail;

    if(i==9) {
      start += "</div></div>";
    }
    else {
      start += "</div></div><div class='row'><div class='col-xs-12'>";
    }




    //rows are appended to html
    elt.innerHTML = start;

  }

  // button functionality to ensure that a liked hotel remains 'liked'
  $('.btn').click(function(e) {

      e.preventDefault();
      $(this).addClass('active');
  })


}
