function BetBook() {
  this.bets = [];
  this.currentBetIndex = 0;
}

BetBook.prototype.addBet = function (bet) {
  this.assignId(bet);
  this.bets.push(bet);
};

BetBook.prototype.assignId = function (bet) {
  bet.id = this.currentBetIndex;
  this.currentBetIndex += 1;
}

function Bet(betName, betTerms, betPenalty) {
  this.betName = betName;
  this.betUsers = [];
  this.betTerms = betTerms;
  this.betPenalty = betPenalty;
  this.betLoser = "";
  this.betWinner = "";
  this.currentUserIndex = 0;
}

Bet.prototype.addUser = function(user) {
  this.assignId(user);
  this.betUsers.push(user);
}

Bet.prototype.assignId = function(user) {
  user.id = this.currentUserIndex;
  this.currentUserIndex += 1;
}

Bet.prototype.getDisplayHTML = function () {
  var html  = '\
  <li class="card" id="list-item-' + this.id + '"> \
    <button class="card-header" type="button" data-toggle="collapse" data-target="#details'+ this.id + '" aria-expanded="false" aria-controls="collapseExample">' + this.betName + ' bet#' + this.id + '</button> \
    <div class="collapse" id="details' + this.id + '"> \
      <div class="card-body"> \
        <p class="card-text bet-descrip">' + this.betTerms + '</p> \
        <div class="bet-user-container-row">'

        for(var i = 0; i < this.betUsers.length; i++) {
          html += this.betUsers[i].getUserDisplayHTML();
        }

        html += '</div> \
        <h5 class="card-title">What\'s at Stake</h5> \
        <p class="card-text"><strong>Amount:</strong> '  + this.betPenalty.penaltyAmount + '</p> \
        <p class="card-text"><strong>Category:</strong> ' + this.betPenalty.penaltyCategory + '</p> \
        <p class="card-text"><strong>Paid By:</strong> ' + this.betPenalty.penaltyDue + '</p> \
      </div> \
      <div class="button-row text-center"><button type="button" class="complete btn btn-info" id="' + this.id + '" name="win-btn" data-toggle="modal" data-target="#declareWinnerModal">Select Winner</button></div> \
    </div> \
  </li>'

  return html;
};

function User(userName, userEmail, userBank) {
  this.userName = userName;
  this.userEmail = userEmail;
  this.userBank = userBank;
  this.userImg = "imgs/generic-person.png";
}

User.prototype.getUserDisplayHTML = function(){
  var html = '<div class="bet-user-container"><img src="' + this.userImg + '"><p class="card-text">' + this.userName + '</p></div>'

  return html;
}

function Penalty(penaltyCategory, penaltyTimeLimit, penaltyAmount, penaltyDue) {
  this.penaltyCategory = penaltyCategory;
  this.penaltyTimeLimit = penaltyTimeLimit;
  this.penaltyAmount = penaltyAmount;
  this.penaltyDue = penaltyDue;
}

// Decision of Penalty- add additional decisions
Bet.prototype.showPenalty = function(){
  var penaltyCategory = this.betPenalty.penaltyCategory;
  this.assignWinner();
  if(penaltyCategory === 'donation') {
    console.log("showing donation penalty field");
    this.showDonationPenalty();

  } else if(penaltyCategory === 'volunteer') {
    console.log("showing volunteer penalty");
    this.showVolunteerPenalty();
  } else if(penaltyCategory === 'money'){
    this.showMoneyPenalty();
  } else if(penaltyCategory === 'chores'){
    this.showChoresPenalty();
  } else if(penaltyCategory === 'prank'){
    this.showPrankPenalty();
  } else {console.log("Problem with penaltyCategory choice")}
}

Bet.prototype.assignWinner = function() {
  var winner = $("input:radio[name='winner']:checked").val();
  this.betWinner = this.betUsers[winner];
  var loser = $("input:radio[name='winner']:not(:checked)").val();
  this.betLoser = this.betUsers[loser];
}

Bet.prototype.getCharityInfo  = function() {
  var charityName = ["Habitat for Humanity", "Planned Parenthood", "Housing First", "Meals on Wheels" ]
  var charityEmail = ["darcie@habitatportlandmetro.org", "contact.us@ppfa.org", "info@naeh.org", "info@mealsonwheelsamerica.org" ]
  var charityWebsite = ["habitat.org", "plannedparenthood.org", "endhomelessness.org", "mealsonwheelsamerica.org" ]

  var randomIndex = Math.floor((Math.random() * charityName.length));

  return {
    name : charityName[randomIndex],
    email : charityEmail[randomIndex],
    website : charityWebsite[randomIndex]
  }
}

//donation results
Bet.prototype.showDonationPenalty = function() {
  var charityObject = this.getCharityInfo();
  $("#list-item-" + this.id + " .card-body").append(this.getDonationHTML(charityObject));
  $("#list-item-" + this.id + " button:last-child").hide();
  $("#list-item-" + this.id).prependTo("#completed-bets");
}

Bet.prototype.getDonationHTML = function(charityObject) {
  return "<p>You owe $" + this.betPenalty.penaltyAmount + " to " + charityObject.name + ". You can reach them by email at <a href='mailto:" + charityObject.email + "? subject=I Lost A Bet'>" + charityObject.email + "</a>, or  you can visit their website at <a href='https://www." + charityObject.website + "'>" +  charityObject.website +    "</a>. Please donate by " + this.betPenalty.penaltyDue + ".</p>";
}

//volunteer results
Bet.prototype.showVolunteerPenalty = function() {
  var charityObject = this.getCharityInfo();
  $("#list-item-" + this.id + " .card-body").append(this.getVolunteerHTML(charityObject));
  $("#list-item-" + this.id + " button:last-child").hide();
  $("#list-item-" + this.id).prependTo("#completed-bets");
}

Bet.prototype.getVolunteerHTML = function(charityObject) {
  return "<p>You owe " + this.betPenalty.penaltyAmount + " hours to " + charityObject.name + ". You can reach them by email at <a href='mailto:" + charityObject.email + "?subject=I Lost A Bet'>" + charityObject.email + "</a>, or you can visit their website at <a href='https://www." + charityObject.website + "'>" +  charityObject.website + "</a>. Please donate by " + this.betPenalty.penaltyDue + ".</p>";
}


// Change to volunteer
Bet.prototype.showMoneyPenalty = function() {
  $("#list-item-" + this.id + " .card-body").append("<p>" + this.betLoser.userName + " is the loser! <br>" + this.betLoser.userName + " has until " + this.betPenalty.penaltyDue + " to pay " + this.betWinner.userName + " $" + this.betPenalty.penaltyAmount + ".</p>");
  $("#list-item-" + this.id + " button:last-child").hide();
  $("#list-item-" + this.id).appendTo("#completed-bets");
}

Bet.prototype.showChoresPenalty = function(){
  var choreChoice = ["laundry", "child or pet sitting", "house cleaning", "car washing", "volunteer at charity of winner's choice", "jog to do my errands"];
  var randomIndex = Math.floor((Math.random() * choreChoice.length));

  $("#list-item-" + this.id + " .card-body").append("<p>" + this.betLoser.userName + " is the loser! <br>" + this.betLoser.userName + " has until " + this.betPenalty.penaltyDue + " to work doing " + choreChoice[randomIndex] + " for " + this.betPenalty.penaltyAmount + " hours of hard labor for " + this.betWinner.userName + ".</p>");
  $("#list-item-" + this.id + " button:last-child").hide();
  $("#list-item-" + this.id).appendTo("#completed-bets");

  // return "You owe" + timeLevel + "hours doing " + timeChoice[penaltyChoice] + "for the winner";
  // Replace for the winner with winner name
}

Bet.prototype.showPranksPenalty = function(){

  var prankList = ["sing in public 'Do You Want To Build a Snowman'", "deliver flowers to your crush",  " get at least $20 from strangers", "Jump into the Willamette river", " do the naked bike ride but not actually during the Naked Bike Ride", "wear a Make America Great Again hat to People's Co-op"];
  var randomIndex = Math.floor((Math.random() * prankList.length));
  $("#list-item-" + this.id + " .card-body").append("<p>" + this.betLoser.userName + " is the loser! <br>" + this.betLoser.userName + " has until " + this.betPenalty.penaltyDue + " to do the prank: " + prankList[randomIndex] + " for " + this.betPenalty.penaltyAmount + " hours for " + this.betWinner.userName + ".</p>");
  $("#list-item-" + this.id + " button:last-child").hide();
  $("#list-item-" + this.id).appendTo("#completed-bets");

  // return "You must" + prankList[prankLevel];
}
// Penalty.prototype.cashBet = function(penaltyAmount, userName, whichCharity){
//
//   // + userName;
//   // How do we choose the other username??
//
//   // A   Enter Bet Amount into betPenalty
//   // C   Choose charity or random
//   //     Send out email with Amount and Charity
//   //     User message saying email was sent and open website
//   // T   Choose etsy, craigslist category etc
//   //     Send out email with Amount and Item and website
//
//   var charityName = ["Habitat for Humanity", "Planned Parenthood", "Housing First", "Meals on Wheels" ]
//   var charityEmail = ["darcie@habitatportlandmetro.org", "contact.us@ppfa.org", "info@naeh.org", "info@mealsonwheelsamerica.org" ]
//   var charityWebsite = ["habitat.org", "plannedparenthood.org", "endhomelessness.org", "mealsonwheelsamerica.org" ]
//   // Email donation letter to charityEmail[whichCharity];
//
//   return "You owe " + penaltyAmount + "dollars to " + charityName[whichCharity] + "the winner!";
//     // Button to continue
//     // Display/open charityWebsite[whichCharity;]
// }




$(function(){
  var betBook = new BetBook();
  var tempBetId = 0;

  $("#bet-form").submit(function(event){
    console.log("hello from submit button");
    event.preventDefault();
    var betName = $("input[name='bet-name']").val();
    var betUser1 = $("input[name='user1']").val();
    var betUser1Email = $("input[name='email1']").val();
    var betUser2 = $("input[name='user2']").val();
    var betUser2Email = $("input[name='email2']").val();
    var betCategory = $("select[name='bet-select'] option:selected").val();
    var betAmount = $("input[name='amount']").val();
    var betDueInput = $("input[name='duedate']").val();
    var betNotes = $("textarea[name='bet-notes']").val();
    var betPenalty = "Bet Penalty Goes Here";

    var betDueDays = Date.parse($("input[name='duedate']").val()); // ** In case we want to do math with the date **//
    // var betDue = new Date()
    var betDue = moment(betDueInput).format('MMMM D, YYYY'); // ** Convert date input 2019-04-12 format to April 12th, 2019 ** //

      // Parameter is zero waiting for bank account field
    var user1 = new User(betUser1, betUser1Email, 0);
    var user2 = new User(betUser2, betUser2Email, 0);

      // Parameters are (category, duration, betamount, due date)
    var betPenalty = new Penalty(betCategory, 0, betAmount, betDue);
    console.log(betPenalty);
      // Parameters are (betname, betnotes, betpenalty)
    var newBet = new Bet(betName, betNotes, betPenalty);
    console.log(betPenalty);
    newBet.addUser(user1);
    newBet.addUser(user2);

    betBook.addBet(newBet);

    $("#active-bets").append(newBet.getDisplayHTML());


    $("#addBetModal").modal("hide");
    $("#active-bets").show();
    var currentBet = new Bet()
  });

  $("#addBet").click(function() {
    $("#active-bets").hide();
    $("#bet-form").show();
  });

  $("#active-bets").on("click", ".complete", function(){
    $(".results-display").show();
    $("label[for='bet-user1']").text(betBook.bets[0].betUsers[0].userName);
    $("label[for='bet-user2']").text(betBook.bets[0].betUsers[1].userName);
    $(".active-bet-name").text(betBook.bets[0].betName);

    tempBetId = $(this).attr('id');
  });

  $("#modal-winner-submit").click(function(){
    betBook.bets[tempBetId].showPenalty();
  });

});
