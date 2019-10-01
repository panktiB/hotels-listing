
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

var filterApplied = false;

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


// assigns the number of pages to the variable ["hotel-search-response"]
function numOfPages() {
	currency = data["currency"];
	baseurl = data["base-url"];
  numberOfPages = Math.ceil(hotelsArr.length / numberPerPage);

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
     totalCost = 'Rs. ' + totalCost + '/-';
   }

   // creating and assigning local variables with HTML content to keep the scope of each iteration separate
   let hotelNameHTML = "<h3 class='card-title bold'>" + hotelName + "</h3>";
   let starRating = "<div>Hotel Rating - " + rating + "</div>";
   let localityHTML = "<div><span class='glyphicon glyphicon-map-marker'></span>" + locality + "</div>";
   let costHTML = "<div class='bold'>" + totalCost + "</div>";
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

// changes the list used to display to the filtered list
function filterLikes() {
  pageList = filteredHotelNames;
	filterApplied = true;
  // $(button span).innerHTML;
	check();
  getDetails();
}

// changes the display list used and calls the function to load data
function removeLikes() {
	pageList = hotelsArr;
	filterApplied = false;
	check();
	loadList();
}

// keeping the value of currentPage in check and making the buttons disabled based on situation
function check() {
    document.getElementById("next").disabled = (currentPage == numberOfPages || filterApplied) ? true : false;
    document.getElementById("previous").disabled = (currentPage == 1 || filterApplied) ? true : false;
    document.getElementById("first").disabled = (currentPage == 1 || filterApplied) ? true : false;
    document.getElementById("last").disabled = (currentPage == numberOfPages || filterApplied) ? true : false;
}

// calling the functions to calculate the number of pages and load first set of data
function load() {
    numOfPages();
    loadList();
}

// triggered with a hotel is liked.
// fetches the value of the sibling in different scenario that that event was triggerred due to icon and not button itself
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
