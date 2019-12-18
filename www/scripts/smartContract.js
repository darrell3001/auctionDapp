var address = "0xb65d2995240ac90d89b52Ebc005f13Ddd8C5BA26";

var abi = [
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "winner",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "winningBid",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "string",
        name: "guid",
        type: "string"
      }
    ],
    name: "AuctionEnded",
    type: "event"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "_guid",
        type: "string"
      }
    ],
    name: "bid",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "maxBidder",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maxBid",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "string",
        name: "guid",
        type: "string"
      }
    ],
    name: "BidAccepted",
    type: "event"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "_guid",
        type: "string"
      }
    ],
    name: "confirmDelivery",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "_guid",
        type: "string"
      }
    ],
    name: "confirmShipment",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "string",
        name: "_itemName",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "_durationInMinutes",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "_guid",
        type: "string"
      }
    ],
    name: "createNewAuction",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256"
      }
    ],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "_guid",
        type: "string"
      }
    ],
    name: "end",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "string",
        name: "itemName",
        type: "string"
      },
      {
        indexed: false,
        internalType: "string",
        name: "guid",
        type: "string"
      }
    ],
    name: "NewAuctionCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "string",
        name: "guid",
        type: "string"
      }
    ],
    name: "OwnerShippedItem",
    type: "event"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "_guid",
        type: "string"
      }
    ],
    name: "sendPayment",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "string",
        name: "guid",
        type: "string"
      }
    ],
    name: "WinnerReceivedItem",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "string",
        name: "guid",
        type: "string"
      }
    ],
    name: "WinnerSentPayment",
    type: "event"
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "auctions",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256"
      },
      {
        internalType: "address payable",
        name: "owner",
        type: "address"
      },
      {
        internalType: "string",
        name: "itemName",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256"
      },
      {
        internalType: "address payable",
        name: "maxBidder",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "maxBid",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "winningBidder",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "winningBid",
        type: "uint256"
      },
      {
        internalType: "enum AuctionDapp.AuctionState",
        name: "currentState",
        type: "uint8"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getAuctionCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      }
    ],
    name: "timeRemainingInSeconds",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];
