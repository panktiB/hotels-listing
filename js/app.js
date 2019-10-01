//initialising empty arrays to store data from hotelresponse
/*
var basicInfoArr = [];
var rateArr = [];
var likeStatus = [];
var baseUrl;

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
  if(document.getElementsByClassName('filterLike')[0].classList.contains('active')) {
    console.log('active');

  }
  var rows = document.getElementsByClassName('row');
  var activerow = '';
  // console.log(rows);
  var filtered = $('.row').filter(function() {
    return !$(this).children('active').length;
  });
  // console.log(filtered);
  for(let i=0; i< filtered.length; i++) {
    // console.log(filtered[i].innerHTML);
    if(filtered[i].classList.contains('active')) {
      activerow += filtered[i].innerHTML;

    }

  }
  document.getElementById('add').innerHTML = activerow;
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
  var start = "<div class='row filterFun'>";
  let innerHTML = elt.innerHTML;

  // creating rows and columns for each data set
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
      start += "</div></div><div class='row filterFun'>";
    }




    //rows are appended to html
    elt.innerHTML = start;

  }

  // button functionality to ensure that a liked hotel remains 'liked'
  $('.btn').click(function(e) {

      e.preventDefault();
      $(this).addClass('active');
      $(this).parent().parent().addClass('active');
  })


}
*/
var data;
var hotelName;
var rating;
var locality;
var totalCost;
var thumbnailUrl;

var currentPage = 1;
var numberPerPage = 10;
var list = new Array();
var pageList = new Array();
var numberOfPages = 0;
var filteredHotelNames = new Array();

$(document).ready(function() {

	$.ajax({
		url: 'http://localhost:3000/hotel-search-response',
		dataType: 'jsonp',
		success: (response) => callSuccess(response),
    error: (error) => callError(error)

	 });
})
function callSuccess(response) {
	// using a promise object to begin loading the webpage only after data is saved to varibles.
	new Promise(function (resolve, reject) {
		data = response;
		hotelsArr = data["hotels"]["hotel"]; //assign hotel data to hotelsArr
		resolve(data);
	}).then(function (result) {

		window.onload = load; //once the data has been fetched, functions are loaded

	}).catch(function (error) {
		console.log(error);
	});
}

function callError(error) {
  console.log(error);
}

//console.log(hotelsArr[0]["room-rates"]);
//console.log(hotelsArr[0]["room-rates"]["room-rate"]);
//console.log(hotelsArr[0]["room-rates"]["room-rate"][0]["rate-breakdown"]["common:rate"]["common:pricing-elements"]["common:pricing-element"]); //array of the actual prices for 1 this should added up for cost
//console.log(hotelsArr[0]["room-rates"]["room-rate"][1]);

// assigns the number of pages to the variable ["hotel-search-response"]
function numOfPages() {
	currency = data["currency"];
	baseurl = data["base-url"];
  numberOfPages = Math.ceil(hotelsArr.length / numberPerPage)
}

// function triggered on click of next
function nextPage() {
    currentPage += 1;
    loadList();
}

// function triggered on click of previoud
function previousPage() {
    currentPage -= 1;
    loadList();
}

// function triggered on click of first
function firstPage() {
    currentPage = 1;
    loadList();
}

// function triggered on click of last
function lastPage() {
    currentPage = numberOfPages;
    loadList();
}

// loads the hotels list according to the page numbers
function loadList() {
    var begin = ((currentPage - 1) * numberPerPage);
    var end = begin + numberPerPage;

    pageList = hotelsArr.slice(begin, end);
    getDetails();
    check();
}

// function that parses through the json data object and populates the HTML
function getDetails() {
	var hotelcardHTML = "";

  // assign the correct value data to the variable
  for(let i=0; i< pageList.length; i++) {
    // console.log(pageList[i]);
   hotelName = pageList[i]["basic-info"]["hotel-info:hotel-name"];
   rating = pageList[i]["basic-info"]["hotel-info:star-rating"];
   locality = pageList[i]["basic-info"]["hotel-info:locality"];
   thumbnailUrl = pageList[i]["basic-info"]["hotel-info:thumb-nail-image"];

   //console.log(hotelName, rating, locality, thumbnailUrl);

   // calling the getRate(i) function to fetch the room rent details
   totalCost = getRate(i);

   if(isNaN(totalCost)) {
     totalCost = "unknown";
   }
   else {
     totalCost = 'Rs. ' + totalCost;
   }

   // creating and assigning local variables with HTML content to keep the scope of each iteration separate
   let hotelNameHTML = "<h3 class='card-title'>" + hotelName + "</h3>";
   let starRating = "<div>" + rating + "</div>";
   let localityHTML = "<div>" + locality + "</div>";
   let costHTML = "<div>" + totalCost + "</div>";
   let likeButton = "<button type='button'class='btn btn-primary btn-sm likebtn' onclick='hotelLiked(event)'><span class='glyphicon glyphicon-thumbs-up'></span></button>";
   let thumbnailHTML = "<a target='_blank' href='https://www.cleartrip.com'" + baseurl + thumbnailUrl + "><img src='https://www.cleartrip.com'" + baseurl + thumbnailUrl + " salt='hotelimg'></a>";

   hotelcardHTML += "<div class='card'><div class='row no-gutters'><div class='col-xs-2'>" + thumbnailHTML + "</div><div class='col-xs-8'><div class='card-body'>" + hotelNameHTML + starRating + localityHTML + "</div></div><div class='col-xs-2 text-right'><div class='card-body'><br>" + costHTML + "<small>1 room/night</small><div>" + likeButton + "</div></div></div></div></div>"

   // append the data to the document
   document.getElementsByClassName('cardHTML')[0].innerHTML = hotelcardHTML;

  }
}

// function parses through the room-rates array/object, fetches the values, calculates the room rent total and return it
function getRate(i) {
  // console.log(hotelsArr[i]["room-rates"]["room-rate"]);
  let tempRateArr = hotelsArr[i]["room-rates"]["room-rate"];
  let rateArr = new Array();

  if(Array.isArray(tempRateArr)) {
    for(let d=0; d < 2; d++){
      // console.log(tempRateArr[d]["rate-breakdown"]);
      let tempBreakdown = tempRateArr[d]["rate-breakdown"]["common:rate"]["common:pricing-elements"]["common:pricing-element"];
      tempBreakdown.forEach(function(item) {
       rateArr.push(item);
      });
    }
  } else {
    rateArr.push(tempRateArr["rate-breakdown"]["common:rate"]["common:pricing-elements"]["common:pricing-element"]);
  }

   let cost = 0;

   rateArr.forEach(function (item) {
    cost += item["common:amount"];
   });

   return cost.toFixed(2);
}

function filterLikes() {
  pageList = filteredHotelNames;
  // $(button span).innerHTML;
  getDetails();
}

// keeping the value of currentPage in check and making the buttons disabled based on situation
function check() {
    document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("previous").disabled = currentPage == 1 ? true : false;
    document.getElementById("first").disabled = currentPage == 1 ? true : false;
    document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
}

// calling the functions to calculate the number of pages and load first set of data
function load() {
    numOfPages();
    loadList();
}




function hotelLiked(event) {
  // console.log(event.srcElement.innerHTML);
  let likedHotelName;
  var spanSibling = event.target.parentNode.parentNode.parentNode.parentNode.previousSibling;
  var buttonSibling =  event.target.parentNode.parentNode.parentNode.previousSibling;
  if(event.srcElement.innerHTML) {
    // console.log(buttonSibling.children[0].children[0].innerHTML);
    likedHotelName = buttonSibling.children[0].children[0].innerHTML;
  } else {
    // console.log(spanSibling.children[0].children[0].innerHTML);
    likedHotelName = spanSibling.children[0].children[0].innerHTML;
  }

  // console.log(likedHotelName);

  var temp = hotelsArr.filter(function (element) {
    return element["basic-info"]["hotel-info:hotel-name"] == likedHotelName;
  });

  // console.log(temp[0]);
  filteredHotelNames.push(temp[0]);
  filteredHotelNames.forEach(function (item) {
    // console.log(item);
    item.liked = true;
  });

}
