pragma solidity 0.4.24;

contract Auction {
  address public auctionOwner;
  string  public itemName;
  uint    public auctionEndTime;
  address public maxBidder;
  uint    public maxBid;
  address public winningBidder;
  uint    public winningBid;

  // Valid states for the auction
  enum AuctionState {INPROGRESS, AWAITING_PAYMENT, AWAITING_SHIPMENT, AWAITING_DELIVERY, COMPLETE}
  AuctionState public currentAuctionState;

  constructor(string _itemName, uint _durationMinutes) public {
    auctionOwner = msg.sender;
    itemName = _itemName;
    auctionEndTime = now + (_durationMinutes * 1 minutes);
    currentAuctionState = AuctionState.INPROGRESS;
  }

  // Events that we will emit (can be subscribed)
  event AuctionComplete(address winner, uint winningBid);
  event BidAccepted(address newMaxBidder, uint newMaxBid);


  // bid()
  // Owner may not bid
  // Bid must be greater than max bid
  // There must be time remaining in auction
  // AuctionState must be INPROGRESS
  function bid() public payable notOwner bidGreaterThanMaxBid auctionTimeRemaining inState(AuctionState.INPROGRESS) {
    if (maxBidder != address(0)) {
        maxBidder.transfer(maxBid);
    }

    maxBidder = msg.sender;
    maxBid = msg.value;
    
    emit BidAccepted(maxBidder, maxBid);
  } 

  // end()
  // Auction be ended only by onwner
  // If no one had bid, then owner can end auction early, 
  // otherwise, auction can only be ended if time has expired
  function end() public ownerOnly auctionCanBeEnded {
    if (maxBidder == address(0)) {
      currentAuctionState = AuctionState.COMPLETE;
    } else {
      emit AuctionComplete(maxBidder, maxBid);
      winningBidder = maxBidder;
      winningBid = maxBid;
      currentAuctionState = AuctionState.AWAITING_PAYMENT;
    }
  }

  // sendPayment()
  // may only be done by winning bidder
  // only if auction is in state AWAITING_PAYMENT
  function sendPayment() public winningBidderOnly inState(AuctionState.AWAITING_PAYMENT) {
    currentAuctionState = AuctionState.AWAITING_SHIPMENT;
  }

  // confirmShipment()
  // may only be one by auction owner
  // only if state is AWAITING_SHIPMENT
  function confirmShipment() public ownerOnly inState(AuctionState.AWAITING_SHIPMENT) {
    currentAuctionState = AuctionState.AWAITING_DELIVERY;
  }

  // confirmDelivery()
  // Only by winning bidder
  // only if in state AWAITING_DELIVERY
  function confirmDelivery() public winningBidderOnly inState(AuctionState.AWAITING_DELIVERY) {
    currentAuctionState = AuctionState.COMPLETE;
    auctionOwner.transfer(address(this).balance);
  }

  // timeRemaining()
  // public fuction return number o seconds left in auction
  // if auction has ended, returns 0
  function timeRemaining() view public returns(int) {
    if (currentAuctionState == AuctionState.INPROGRESS) {
      if (auctionEndTime <= now) {
        return int(0);
      } else {
        return int(auctionEndTime - now);
      }
    } else {
      return int(0);
    }    
  }
    
  // ------------------------------------------    
  // Modifiers
  // Modifiers are pre-processors that we can apply to the state change requests
  // ------------------------------------------    
  modifier inState(AuctionState expectedState) {
    require(currentAuctionState == expectedState, "auction in unexpected state");
    _;
  }

  modifier notInState(AuctionState expectedState) {
    require(currentAuctionState != expectedState, "auction not in expected state");
    _;
  }

  modifier ownerOnly() {
    require(msg.sender == auctionOwner, "only the auction owner may perform this task");
    _;
  }     

  modifier winningBidderOnly() {
    require(msg.sender == winningBidder, "only the winning bidder may perform this task");
    _;
  }     

  modifier notOwner() {
    require(msg.sender != auctionOwner, "the auction owner may not perform this operation");
    _;
  }     

  modifier maxBidNotZero() {
    require(maxBid != 0, "the bid may not be zero");
    _;
  }     

  modifier bidGreaterThanMaxBid() {
    require(msg.value > maxBid, "bid must be greater than the max bid");
    _;
  }     

  modifier auctionTimeRemaining() {
    require(now < auctionEndTime, "auction has not ended");
    _;
  }

  modifier auctionTimeExpired() {
    require(now >= auctionEndTime, "auction has ended");
    _;
  }

  modifier auctionCanBeEnded() {
    if (maxBidder != address(0)) {
        require(now >= auctionEndTime, "auction is still active");
    }
    _;
  }

}