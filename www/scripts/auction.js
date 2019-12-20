// subscribeToEvents()
function subscribeToEvents() {
  //#region .NewAuctionCreated()
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
        getAuctionCount().then(auctionCount => {
          $("#auctionCount").html(auctionCount);
        });

        buildDashboardData(event.returnValues.id);
      }
    })
    .on("error", error => {
      console.log("NewAuctionCreated.onEvent(error) - ", error);
      $("#errormsg").html(error.message);
    });
  //#endregion

  //#region BidAccepted()
  contract.events
    .BidAccepted()
    .on("data", event => {
      // guid needed to work around https://github.com/MetaMask/metamask-extension/issues/6668
      if (lastGuid != event.returnValues.guid) {
        lastGuid = event.returnValues.guid;
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

        var dashboardId = "d-" + event.returnValues.id + "-" + "maxBid";
        document.getElementById(dashboardId).innerText =
          event.returnValues.maxBid;
      }
    })
    .on("error", error => {
      console.log("BidAccepted.onEvent(error) - ", error);
      $("#errormsg").html(error.message);
    });
  //#endregion

  //#region AuctionEnded()
  contract.events
    .AuctionEnded()
    .on("data", event => {
      // guid needed to work around https://github.com/MetaMask/metamask-extension/issues/6668
      if (lastGuid != event.returnValues.guid) {
        lastGuid = event.returnValues.guid;
        console.log(
          "AuctionEnded.onEvent - Auction has ended. id : " +
            event.returnValues.id +
            ", winner : " +
            event.returnValues.winner +
            ", winningBid : " +
            event.returnValues.winningBid
        );
        var curr = parseInt($("#popCount").html());
        $("#popCount").html(curr + 1);

        var dashboardId = "d-" + event.returnValues.id + "-" + "winningBid";
        document.getElementById(dashboardId).innerText =
          event.returnValues.winningBid;

        var dashboardId = "d-" + event.returnValues.id + "-" + "currentState";
        document.getElementById(dashboardId).innerText = mapAuctionState("1");
      }
    })
    .on("error", error => {
      console.log("AuctionEnded.onEvent(error) - ", error);
      $("#errormsg").html(error.message);
    });
  //#endregion

  //#region WinnerSentPayment
  contract.events
    .WinnerSentPayment()
    .on("data", event => {
      // guid needed to work around https://github.com/MetaMask/metamask-extension/issues/6668
      if (lastGuid != event.returnValues.guid) {
        lastGuid = event.returnValues.guid;
        console.log(
          "WinnerSentPayment.onEvent - Winner has sent payment. id : " +
            event.returnValues.id
        );
        var curr = parseInt($("#popCount").html());
        $("#popCount").html(curr + 1);

        var dashboardId = "d-" + event.returnValues.id + "-" + "currentState";
        document.getElementById(dashboardId).innerText = mapAuctionState("2");
      }
    })
    .on("error", error => {
      console.log("WinnerSentPayment.onEvent(error) - ", error);
      $("#errormsg").html(error.message);
    });
  //#endregion

  //#region OwnerShippedItem()
  contract.events
    .OwnerShippedItem()
    .on("data", event => {
      // guid needed to work around https://github.com/MetaMask/metamask-extension/issues/6668
      if (lastGuid != event.returnValues.guid) {
        lastGuid = event.returnValues.guid;
        console.log(
          "OwnerShippedItem.onEvent - Owner shipped item. id : " +
            event.returnValues.id
        );
        var curr = parseInt($("#popCount").html());
        $("#popCount").html(curr + 1);

        var dashboardId = "d-" + event.returnValues.id + "-" + "currentState";
        document.getElementById(dashboardId).innerText = mapAuctionState("3");
      }
    })
    .on("error", error => {
      console.log("OwnerShippedItem.onEvent(error) - ", error);
      $("#errormsg").html(error.message);
    });
  //#endregion

  //#region WinnerReceivedItem()
  contract.events
    .WinnerReceivedItem()
    .on("data", event => {
      // guid needed to work around https://github.com/MetaMask/metamask-extension/issues/6668
      if (lastGuid != event.returnValues.guid) {
        lastGuid = event.returnValues.guid;
        console.log(
          "WinnerReceivedItem.onEvent - Winner received item. id : " +
            event.returnValues.id
        );
        var curr = parseInt($("#popCount").html());
        $("#popCount").html(curr + 1);

        var dashboardId = "d-" + event.returnValues.id + "-" + "currentState";
        document.getElementById(dashboardId).innerText = mapAuctionState("4");
      }
    })
    .on("error", error => {
      console.log("WinnerReceivedItem.onEvent(error) - ", error);
      $("#errormsg").html(error.message);
    });
  //#endregion
}

// getAuction()
function getAuction(auctionId) {
  return contract.methods
    .auctions(auctionId)
    .call()
    .catch(error => {
      $("#errormsg").html(error.message);
      console.log("getAuction() - error - ", error.message);
    });
}

// getAuctionCount()
function getAuctionCount() {
  return contract.methods
    .getAuctionCount()
    .call()
    .catch(error => {
      $("#errormsg").html(error.message);
      console.log("getAuctionCount() - error - ", error.message);
    });
}

function mapAuctionState(state) {
  switch (state) {
    case "0":
      return "In Progress";

    case "1":
      return "Ended - Awaiting Payment";

    case "2":
      return "Ended - Awaiting Shipping";

    case "3":
      return "Ended - Awaiting Delivery";

    case "4":
      return "Complete";

    default:
      return "Unknown";
  }
}

function buildDashboardHeadings() {
  var dashboard = document.getElementById("dashboard");

  var headings$ = $("<tr></tr>");
  headings$.append($("<th></th>").html("id"));
  headings$.append($("<th></th>").html("Item"));
  headings$.append($("<th></th>").html("End Time"));
  headings$.append($("<th></th>").html("Max Bid"));
  headings$.append($("<th></th>").html("Winning Bid"));
  headings$.append($("<th></th>").html("Current State"));
  $(dashboard).append(headings$);
}

// buildDashboardData()
function buildDashboardData(auctionId) {
  getAuction(auctionId).then(function(result) {
    var row$ = $("<tr></tr>");
    var rowIdPrefix = "d-" + result["id"] + "-";
    var rowIdSuffix = "";
    rowIdSuffix = "id";
    row$.append(
      $("<td id=" + rowIdPrefix + rowIdSuffix + "></td>").html(result["id"])
    );
    rowIdSuffix = "itemName";
    row$.append(
      $("<td id=" + rowIdPrefix + rowIdSuffix + "></td>").html(
        result["itemName"]
      )
    );
    // // to convert to datetime in JS, multiply solidity date by 1000
    rowIdSuffix = "endTime";
    row$.append(
      $("<td id=" + rowIdPrefix + rowIdSuffix + "></td>").html(
        new Date(result["endTime"] * 1000)
      )
    );
    rowIdSuffix = "maxBid";
    row$.append(
      $("<td id=" + rowIdPrefix + rowIdSuffix + "></td>").html(result["maxBid"])
    );
    rowIdSuffix = "winningBid";
    row$.append(
      $("<td id=" + rowIdPrefix + rowIdSuffix + "></td>").html(
        result["winningBid"]
      )
    );
    rowIdSuffix = "currentState";
    row$.append(
      $("<td id=" + rowIdPrefix + rowIdSuffix + "></td>").html(
        mapAuctionState(result["currentState"])
      )
    );

    // let date = new Date(result["endTime"] * 1000);
    // console.log("endTime : " + date);
    // console.log("maxBidder : " + result["maxBidder"]);
    // console.log("maxBid : " + result["maxBid"]);
    // console.log("winningBidder : " + result["winningBidder"]);
    // console.log("winningBid : " + result["winningBid"]);
    // console.log("currentState : " + result["currentState"]);
    $(dashboard).append(row$);
  });
}

// buildAllDashboardData()
function buildAllDashboardData() {
  var dashboard = document.getElementById("dashboard");

  getAuctionCount().then(auctionCount => {
    for (var auctionId = 0; auctionId < auctionCount; auctionId++) {
      buildDashboardData(auctionId);
    }
  });
}

// createNewAuction()
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

// placeBid()
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
      console.log("placeBid.onError() - ", err.message);
    });
}

// endAuction()
function endAuction(auctionId) {
  contract.methods
    .end(auctionId, guid())
    .send({ from: fromAddress }, () => {
      $("#status").html("waiting for confirmation");
      $("#last-transaction-status").html("transaction is pending");
    })
    .then(receipt => {
      console.log("endAuction.then() - Auction ended");
      $("#status").html("idle");
      $("#last-transaction-status").html("last transaction was successful");
    })
    .catch(err => {
      $("#status").html("idle");
      $("#last-transaction-status").html("last transaction failed");
      console.log("endAuction.onError() - ", err.message);
    });
}

// sendPayment()
function sendPayment(auctionId) {
  contract.methods
    .sendPayment(auctionId, guid())
    .send({ from: fromAddress }, () => {
      $("#status").html("waiting for confirmation");
      $("#last-transaction-status").html("transaction is pending");
    })
    .then(receipt => {
      console.log("sendPayment.then() - Winner sent payment");
      $("#status").html("idle");
      $("#last-transaction-status").html("last transaction was successful");
    })
    .catch(err => {
      $("#status").html("idle");
      $("#last-transaction-status").html("last transaction failed");
      console.log("sendPayment.onError() - ", err.message);
    });
}

// shipped()
function shipped(auctionId) {
  contract.methods
    .confirmShipment(auctionId, guid())
    .send({ from: fromAddress }, () => {
      $("#status").html("waiting for confirmation");
      $("#last-transaction-status").html("transaction is pending");
    })
    .then(receipt => {
      console.log("shipped.then() - Owner shipped item");
      $("#status").html("idle");
      $("#last-transaction-status").html("last transaction was successful");
    })
    .catch(err => {
      $("#status").html("idle");
      $("#last-transaction-status").html("last transaction failed");
      console.log("shipped.onError() - ", err.message);
    });
}

// received()
function received(auctionId) {
  contract.methods
    .confirmDelivery(auctionId, guid())
    .send({ from: fromAddress }, () => {
      $("#status").html("waiting for confirmation");
      $("#last-transaction-status").html("transaction is pending");
    })
    .then(receipt => {
      console.log("received.then() - Winner received item");
      $("#status").html("idle");
      $("#last-transaction-status").html("last transaction was successful");
    })
    .catch(err => {
      $("#status").html("idle");
      $("#last-transaction-status").html("last transaction failed");
      console.log("received.onError() - ", err.message);
    });
}

// guid()
// this function is used to create a guid to identify unique transactions
// this is needed as a workaround because of this problem:
// guid needed to work around https://github.com/MetaMask/metamask-extension/issues/6668
// once this issue is resloved, this function can be removed
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

        contract = new web3.eth.Contract(abi, address);
        buildDashboardHeadings();
        buildAllDashboardData();
        subscribeToEvents();
        getAuctionCount().then(auctionCount => {
          $("#auctionCount").html(auctionCount);
        });
      });
    } catch (error) {
      // User denied account access...
      console.log("caught error: ", error);
      console.log(
        "maybe user didn't give permission to use wallet??. Cannot proceed."
      );
      $("#errormsg").html("caught error. see console log for details");
    }
  } else {
    console.log(
      "Please install MetaMask. How To instructions can be found here: https://www.youtube.com/watch?v=wTlI2_zxXpU"
    );
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

// Click of endButton button
$("#endButton").click(() => {
  var endAuctionId = $("#bidAuctionId").val();
  endAuction(endAuctionId);
});

// Click of sendPaymentButton button
$("#sendPaymentButton").click(() => {
  var sendPaymentAuctionId = $("#sendPaymentAuctionId").val();
  sendPayment(sendPaymentAuctionId);
});

// Click of ShippedButton button
$("#shippedButton").click(() => {
  var shippedAuctionId = $("#shippedAuctionId").val();
  shipped(shippedAuctionId);
});

// Click of receivedButton button
$("#receivedButton").click(() => {
  var receivedAuctionId = $("#receivedAuctionId").val();
  received(receivedAuctionId);
});
