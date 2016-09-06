var app = angular.module('store', ["ngSanitize"]);
app.controller('ProductController', function(itemData, $http) {

  itemData = itemData.CatalogEntryView[0];
  this.productName = itemData.title;
  this.images = itemData.Images[0].AlternateImages;
  this.price = itemData.Offers[0].OfferPrice[0].formattedPriceValue;
  this.promotion = [itemData.Promotions[0].Description[0].shortDescription, itemData.Promotions[1].Description[0].shortDescription];
  this.quantity = 1;
  this.highlights = itemData.ItemDescription[0].features;
  this.available = itemData.purchasingChannelCode;
  this.UPC = itemData.UPC;

  ////////////////////////
  ////// functions ///////
  ////////////////////////

  // increase and descrease quanity of product
  this.increaseQuant = function() {
    this.quantity++;
  };
  this.decreaseQuant = function() {
    if(this.quantity > 1) {
      this.quantity--;
    }
  };

  this.order = function (url, quant) {
    var data = {};
    data.UPC = this.UPC;
    if (quant) {data.quantity = this.quantity;}
    console.log(url, data);
    $http.post(url, data).then(successCallback, errorCallback);
    function successCallback(){console.log('stubbed');}
    function errorCallback(){console.log('stubbed');}
  };
});

app.controller('ReviewController', function(itemData){
  var reviews = itemData.CatalogEntryView[0].CustomerReview;
  this.totalReviews = reviews[0].totalReviews;
  this.starHtml = findReviewAverage(reviews[0].Reviews);
  this.starCon = createStars(reviews[0].Con[0].overallRating);
  this.starPro = createStars(reviews[0].Pro[0].overallRating);
  this.proTitle = reviews[0].Pro[0].title;
  this.conTitle = reviews[0].Con[0].title;
  this.proBody = reviews[0].Pro[0].review;
  this.conBody = reviews[0].Con[0].review;
  this.proReviewer = reviews[0].Pro[0].screenName;
  this.conReviewer = reviews[0].Con[0].screenName;
  this.proDate = createDate(reviews[0].Pro[0].datePosted);
  this.conDate = createDate(reviews[0].Pro[0].datePosted);
  this.allReviews = reviewsArray(reviews[0].Reviews);
  this.showAll = false;

  //////////////////////////
  /////// functions ////////
  //////////////////////////

  // create the starhtml for the reviews;
  function createStars (num) {
    var stars = [];
    var count = 0;
    var redStar = '<div class="red glyphicon glyphicon-star"></div>';
    var emptyStar = '<div class="glyphicon glyphicon-star-empty"></div>';
    while(count < num) {
      stars.push(redStar);
      count++;
    }
    while(count < 5) {
      stars.push(emptyStar);
      count++;
    }
    return stars.join('');
  }

  // find total aerage review
  function findReviewAverage (obj) {
    var totalStars = 0;
    var reviewCount = 0;
    obj.forEach(function(el, index) {
      totalStars = totalStars + parseFloat(el.overallRating);
      reviewCount++;
    });
    var numreview = Math.round(totalStars/reviewCount);
    return createStars(numreview);
  }

  // format date correctly for reviews
  function createDate(date) {
    var d = new Date(date);
    var monthNames = ["January", "February", "March", "April", "May", "June",
       "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  // creates an array of review objs with ness. data
  function reviewsArray(obj) {
    var reviewsObjs = [];
    obj.forEach(function(element, index){
      var review = {};
      review.stars = createStars(element.overallRating);
      review.title = element.title;
      review.body = element.review;
      review.reviewer = element.screenName;
      review.date = createDate(element.datePosted);
      reviewsObjs.push(review);
    });
    return reviewsObjs;
  }

  // toggle between the top two reviews and all reviews
  this.toggleReviews = function () {
    if (this.showAll === false ) {
      this.showAll = true;
    } else {
      this.showAll = false;
    }
  };
});
