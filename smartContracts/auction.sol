pragma solidity ^0.5.0;

contract AuctionDapp {

  // Valid states for the auction
 enum AuctionState {INPROGRESS, AWAITING_PAYMENT, AWAITING_SHIPMENT, AWAITING_DELIVERY, COMPLETE}


  struct Auction {
    uint            id;
    address payable owner;
    string          itemName;
    uint            endTime;
    address payable maxBidder;
    uint            maxBid;
    address         winningBidder;
    uint            winningBid;

    AuctionState currentState;
  }

  
  Auction[] public auctions; 
  uint auctionCount;
  uint maxAuctionDurationInMinutes = 60;
   
  constructor() public {
    auctionCount = 0;
  }

  // Events that we will emit (can be subscribed)
  event NewAuctionCreated(uint id, string itemName, string guid);
  event AuctionEnded(uint id, address winner, uint winningBid);
  event BidAccepted(uint id, address maxBidder, uint maxBid, string guid);
  event WinnerSentPayment(uint id);
  event OwnerShippedItem(uint id);
  event WinnerReceivedItem(uint id);

  // getAuctionCount()
  // view only function (read only)
  function getAuctionCount() public view returns (uint) {
      return auctionCount;
  }

  // createNewAuction()
  // expects an itemName and duration (in Minutes)
  function createNewAuction (string memory _itemName, uint _durationInMinutes, string memory _guid) public payable isValidAuctionDuration(_durationInMinutes) returns (uint id) {
    id = auctionCount;
    Auction memory newAuction = Auction({ id : id,
                                          owner : msg.sender, 
                                          itemName : _itemName, 
                                          endTime : now + (_durationInMinutes * 1 minutes),
                                          maxBidder : address(0),
                                          maxBid : 0,
                                          winningBidder : address(0), 
                                          winningBid : 0, 
                                          currentState : AuctionState.INPROGRESS });

    auctions.push(newAuction);
    auctionCount++;

    //emit event
    emit NewAuctionCreated (newAuction.id, _itemName, _guid);
    return id;
  }


  // bid()
  // Owner may not bid
  // Bid must be greater than max bid
  // There must be time remaining in auction
  // AuctionState must be INPROGRESS
  function bid(uint _id, string memory _guid) public payable notOwner(_id) bidGreaterThanMaxBid(_id) auctionTimeRemaining(_id) inState(_id, AuctionState.INPROGRESS) {
    if (auctions[_id].maxBidder != address(0)) {
        auctions[_id].maxBidder.transfer(auctions[_id].maxBid);
    }

    auctions[_id].maxBidder = msg.sender;
    auctions[_id].maxBid = msg.value;
    
    emit BidAccepted(_id, msg.sender, msg.value, _guid);
  } 

  // end()
  // Auction be ended only by onwner
  // If no one had bid, then owner can end auction early, 
  // otherwise, auction can only be ended if time has expired
  function end(uint _id) public ownerOnly(_id) auctionCanBeEnded(_id) {
    if (auctions[_id].maxBidder == address(0)) {
      auctions[_id].currentState = AuctionState.COMPLETE;
    } else {
      emit AuctionEnded(_id, auctions[_id].maxBidder, auctions[_id].maxBid);
      auctions[_id].winningBidder = auctions[_id].maxBidder;
      auctions[_id].winningBid = auctions[_id].maxBid;
      auctions[_id].currentState = AuctionState.AWAITING_PAYMENT;
    }
  }

  // sendPayment()
  // may only be done by winning bidder
  // only if auction is in state AWAITING_PAYMENT
  function sendPayment(uint _id) public winningBidderOnly(_id) inState(_id, AuctionState.AWAITING_PAYMENT) {
    emit WinnerSentPayment(_id);
    auctions[_id].currentState = AuctionState.AWAITING_SHIPMENT;
  }

  // confirmShipment()
  // may only be one by auction owner
  // only if state is AWAITING_SHIPMENT
  function confirmShipment(uint _id) public ownerOnly(_id) inState(_id, AuctionState.AWAITING_SHIPMENT) {
    emit OwnerShippedItem(_id);
    auctions[_id].currentState = AuctionState.AWAITING_DELIVERY;
  }

  // confirmDelivery()
  // Only by winning bidder
  // only if in state AWAITING_DELIVERY
  function confirmDelivery(uint _id) public winningBidderOnly(_id) inState(_id, AuctionState.AWAITING_DELIVERY) {
    emit WinnerReceivedItem(_id);
    auctions[_id].currentState = AuctionState.COMPLETE;
    auctions[_id].owner.transfer(address(this).balance);
  }

  // timeRemaining()
  // public fuction return number of seconds left in auction
  // if auction has ended, returns 0
  function timeRemainingInSeconds(uint _id) view public returns(int) {
    if (auctions[_id].currentState == AuctionState.INPROGRESS) {
      if (auctions[_id].endTime <= now) {
        return int(0);
      } else {
        return int(auctions[_id].endTime - now);
      }
    } else {
      return int(0);
    }    
  }
    
  // ------------------------------------------    
  // Modifiers
  // Modifiers are pre-processors that we can apply to the state change requests
  // ------------------------------------------    
  modifier isValidAuctionDuration(uint _durationInMinutes) {
    require(_durationInMinutes <= maxAuctionDurationInMinutes, "auction max duration exceeded");
    _;
  }


  modifier inState(uint _id, AuctionState expectedState) {
    require(auctions[_id].currentState == expectedState, "auction in unexpected state");
    _;
  }

  modifier notInState(uint _id, AuctionState expectedState) {
    require(auctions[_id].currentState != expectedState, "auction not in expected state");
    _;
  }

  modifier ownerOnly(uint _id) {
    require(msg.sender == auctions[_id].owner,        "only the auction owner may perform this task");
    _;
  }     

  modifier winningBidderOnly(uint _id) {
    require(msg.sender == auctions[_id].winningBidder, "only the winning bidder may perform this task");
    _;
  }            

  modifier notOwner(uint _id) {
    require(msg.sender != auctions[_id].owner,        "the auction owner may not perform this operation");
    _;
  }     

  modifier maxBidNotZero(uint _id) {
    require(auctions[_id].maxBid != 0, "the max bid is not zero");
    _;
  }            

  modifier bidGreaterThanMaxBid(uint _id) {
    require(msg.value > auctions[_id].maxBid, "bid must be greater than the max bid");
    _;
  }     

  modifier auctionTimeRemaining(uint _id) {
    require(now < auctions[_id].endTime, "auction has ended");
    _;
  }

  modifier auctionTimeExpired(uint _id) {
    require(now >= auctions[_id].endTime, "auction has ended");
    _;
  }

  modifier auctionCanBeEnded(uint _id) {
    if (auctions[_id].maxBidder != address(0)) {
        require(now >= auctions[_id].endTime, "auction is still active");
    }
    _;
  }

}