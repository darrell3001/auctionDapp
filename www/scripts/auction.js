// Initialize the linkage to the smart contract
// We will need the ABI and address, which are copy/paste from remix IDE
// Setup a Event subscription for the counterUpdated Event
// Note that Web3 API does not support subscriptions on mobile devices
// thus we have to use another method. Trap the error message and setup
// an async timer pop for every 5 seconds
function initContract() {
  contract = new web3.eth.Contract(abi, address);

  contract.events
    .NewAuctionCreated()
    .on("data", event => {
      // guid needed to work around https://github.com/MetaMask/metamask-extension/issues/6668
      if (lastGuid != event.returnValues.guid) {
        lastGuid = event.returnValues.guid;
        console.log(
          "NewAuctionCreated.onEvent - New Auction was created. id : " +
            event.returnValues.id +
            ", itemName : " +
            event.returnValues.itemName
        );

        var curr = parseInt($("#popCount").html());
        $("#popCount").html(curr + 1);
        getAuctionCount();
      }
    })
    .on("error", error => {
      console.log("NewAuctionCreated.onEvent(error) - ", error);
      $("#errormsg").html(error.message);
    });

  contract.events
    .BidAccepted()
    .on("data", event => {
      // guid needed to work around https://github.com/MetaMask/metamask-extension/issues/6668
      if (lastGuid != event.returnValues.guid) {
        lastGuid = event.returnValues.guid;
        console.log(event);
        console.log(
          "BidAccepted.onEvent - New bid accepted. id : " +
            event.returnValues.id +
            ", maxBidder : " +
            event.returnValues.maxBidder +
            ", maxBid : " +
            event.returnValues.maxBid
        );
        var curr = parseInt($("#popCount").html());
        $("#popCount").html(curr + 1);
      }
    })
    .on("error", error => {
      console.log("BidAccepted.onEvent(error) - ", error);
      $("#errormsg").html(error.message);
    });
}

// event NewAuctionCreated(uint id, string itemName);
// event AuctionEnded(uint id, address winner, uint winningBid);
// event BidAccepted(uint id, address maxBidder, uint maxBid);
// event WinnerSentPayment(uint id);
// event OwnerShippedItem(uint id);
// event WinnerReceivedItem(uint id);

function getAuction(auctionId) {
  try {
    contract.methods
      .auctions(auctionId)
      .call()
      .then(result => {
        console.log("id : " + result["id"]);
        console.log("itemName : " + result["itemName"]);
        // to convert to datetime in JS, multiply solidity date by 1000
        let date = new Date(result["endTime"] * 1000);
        console.log("endTime : " + date);
        console.log("maxBidder : " + result["maxBidder"]);
        console.log("maxBid : " + result["maxBid"]);
        console.log("winningBidder : " + result["winningBidder"]);
        console.log("winningBid : " + result["winningBid"]);
      });
  } catch (error) {
    console.log(error.message);
  }
}

// This is the simple call to the getCounter() function in the smart contract
// Note this is done with an async callback thus the routine finishes immediatly
// and the value is updated via jQuery via promise
function getAuctionCount() {
  try {
    contract.methods
      .getAuctionCount()
      .call()
      .then(result => {
        $("#auctionCount").html(result);
      });
  } catch (error) {
    $("#errormsg").html(error.message);
  }
}

function placeBid(auctionId, amount) {
  contract.methods
    .bid(auctionId, guid())
    .send(
      { from: fromAddress, value: web3.utils.toWei(amount.toString(), "wei") },
      () => {
        $("#status").html("waiting for confirmation");
        $("#last-transaction-status").html("transaction is pending");
      }
    )
    .then(receipt => {
      console.log("placeBid.then() - bid placed for " + amount + " wie");
      $("#status").html("idle");
      $("#last-transaction-status").html("last transaction was successful");
    })
    .catch(err => {
      $("#status").html("idle");
      $("#last-transaction-status").html("last transaction failed");
      console.log("createNewAuction.onError() - ", err.message);
    });
}

function createNewAuction(itemName, durationInMinutes) {
  contract.methods
    .createNewAuction(itemName, durationInMinutes, guid())
    .send({ from: fromAddress }, () => {
      $("#status").html("waiting for confirmation");
      $("#last-transaction-status").html("transaction is pending");
    })
    .then(receipt => {
      console.log("createNewAuction.then()");
      $("#status").html("idle");
      $("#last-transaction-status").html("last transaction was successful");
    })
    .catch(err => {
      $("#status").html("idle");
      $("#last-transaction-status").html("last transaction failed");
      console.log("createNewAuction.onError() - ", err.message);
    });
}

function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ------------------------------------------------
// main() entry point
// ------------------------------------------------
var contract;
var events;
var fromAddress;

var lastGuid = "";

// The Smart Contract address and abi are defined in this file:
// smartContract.js
// It is automatically included in so no need to define it

window.addEventListener("load", async () => {
  if (window.ethereum) {
    window.ethereum.autoRefreshOnNetworkChange = false;
    window.web3 = new Web3(ethereum);
    try {
      // Request account access if needed
      await ethereum.enable().then(accounts => {
        // stash the fromAddress away for subquent transactions
        fromAddress = accounts[0];
        console.log("Approval granted");
        // Acccounts now exposed

        window.ethereum.on("accountsChanged", function(accounts) {
          fromAddress = accounts[0];
        });
        initContract();
        getAuctionCount();
      });
    } catch (error) {
      // User denied account access...
      console.log("User did not give permission to use wallet");
      console.log(error);
      $("#errormsg").html("User did not give permission to use wallet");
    }
  }
});

// Basically all three buttons follow the same logic
// they simply call the corresponding function in the smart
// contract while setting up a promise to handle the result
// First, set the status message to "waiting for confirmation"
// and transaction status to "transaction is pending"
// then setup promise for OnConfirmation and OnError
// OnConfirmation - set status to idle and last transaction to successful
// Note: we technically dont need to make the call to "getValue()". The event
// subscription will catch the update in the smart contract and file. However,
// in the case of the wallet on the mobile browser that does not support subscriptions
// this is required to update the value. It really does not hurt anything to have
// this code here.

// Click of newAuction button
$("#newAuctionButton").click(() => {
  var itemName = $("#newAuctionItemName").val();
  var durationInMinutes = $("#newAuctionDurationInMinutes").val();
  createNewAuction(itemName, durationInMinutes);
});

// Click of listAuction button
$("#listAuctionButton").click(() => {
  var auctionId = $("#listAuctionId").val();
  getAuction(auctionId);
});

// Click of bidButton button
$("#bidButton").click(() => {
  var bidAuctionId = $("#bidAuctionId").val();
  var bidAmount = $("#bidAmount").val();
  placeBid(bidAuctionId, bidAmount);
});
