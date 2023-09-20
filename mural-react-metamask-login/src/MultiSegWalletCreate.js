import React, { useState, useEffect } from "react";
import ContractDetails from "./ContractDetails";
import Web3 from "web3";

const MultiSigSetup = ({ account }) => {
  const [threshold, setThreshold] = useState(1);
  const [contract, setContract] = useState("");
  const [approvers, setApprovers] = useState("");

  const ActionType = {
    AddApprover: 0,
    RemoveApprover: 1,
    ChangeNickname: 2,
    ChangeThreshold: 3,
  };

  useEffect(() => {
    fetchApprovers();
  }, [contract]);

  const fetchApprovers = async () => {
    if (contract) {
      try {
        const result = await contract.methods.getAllApprovers().call();
        const initialThreshold = await contract.methods
          .confirmationThreshold()
          .call();
        setThreshold(initialThreshold);
        setApprovers(result);
      } catch (error) {
        console.error("Error fetching approvers:", error);
      }
    }
  };

  const changeNickName = async (account, newName) => {
    if (contract) {
      contract.methods
        .generateActionHash(ActionType.ChangeNickname, account, newName)
        .call()
        .then(async (actionHash) => {
          console.log("Generated Action Hash:", actionHash);

          await contract.methods
            .proposeAction(actionHash)
            .send({ from: account })
            .on("receipt", async (receipt) => {
              console.log("Action Proposed:", receipt);

              await contract.methods
                .approveAction(actionHash)
                .send({ from: account })
                .on("receipt", async (receipt) => {
                  console.log("Action Approved:", receipt);

                  await contract.events.NicknameChanged(
                    {
                      filter: { approver: account },
                    },
                    function (error, event) {
                      if (error) console.error(error);
                      console.log("Nickname Changed Event:", event);
                      console.log(contract);
                    }
                  );
                })
                .on("error", console.error);
            })
            .on("error", console.error);
        });
    }
  };

  const changeThreshold = async (newThreshold) => {
    if (contract) {
      contract.methods
        .generateActionHash(
          ActionType.ChangeThreshold,
          account,
          `${newThreshold}`
        )
        .call()
        .then(async (actionHash) => {
          console.log("Generated Action Hash:", actionHash);

          await contract.methods
            .proposeAction(actionHash)
            .send({ from: account })
            .on("receipt", async (receipt) => {
              console.log("Action Proposed:", receipt);

              await contract.methods
                .approveAction(actionHash)
                .send({ from: account })
                .on("receipt", async (receipt) => {
                  console.log("Action Approved:", receipt);

                  await contract.events.ThresholdChanged(
                    {
                      filter: { approver: account },
                    },
                    function (error, event) {
                      if (error) console.error(error);
                      console.log("Threshold Changed Event:", event);
                      console.log(contract);
                    }
                  );
                })
                .on("error", console.error);
            })
            .on("error", console.error);
        });
    }
  };

  const addApprover = async (newApprover) => {
    console.log(newApprover);
    if (contract) {
      contract.methods
        .generateActionHash(ActionType.AddApprover, account, newApprover)
        .call()
        .then(async (actionHash) => {
          console.log("Generated Action Hash:", actionHash);

          await contract.methods
            .proposeAction(actionHash)
            .send({ from: account })
            .on("receipt", async (receipt) => {
              console.log("Action Proposed:", receipt);

              await contract.methods
                .approveAction(actionHash)
                .send({ from: account })
                .on("receipt", async (receipt) => {
                  console.log("Action Approved:", receipt);

                  await contract.events.ApproverAdded(
                    {
                      filter: { approver: account },
                    },
                    function (error, event) {
                      if (error) console.error(error);
                      console.log("Approver Added Event:", event);
                      console.log(contract);
                    }
                  );
                })
                .on("error", console.error);
            })
            .on("error", console.error);
        });
    }
  };

  const createWallet = async () => {
    const contractAddress = "0x05EC99d1A486Fff9e7a943D4Ed661ce04e9c9981";
    const contractABI = [
      {
        inputs: [
          {
            internalType: "address[]",
            name: "initialApprovers",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "_confirmationThreshold",
            type: "uint256",
          },
          { internalType: "string", name: "_name", type: "string" },
          { internalType: "string", name: "_symbol", type: "string" },
          {
            internalType: "address",
            name: "_royaltyRecipient",
            type: "address",
          },
          { internalType: "uint128", name: "_royaltyBps", type: "uint128" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      { inputs: [], name: "ApprovalCallerNotOwnerNorApproved", type: "error" },
      { inputs: [], name: "ApprovalQueryForNonexistentToken", type: "error" },
      { inputs: [], name: "ApprovalToCurrentOwner", type: "error" },
      { inputs: [], name: "ApproveToCaller", type: "error" },
      { inputs: [], name: "BalanceQueryForZeroAddress", type: "error" },
      { inputs: [], name: "MintToZeroAddress", type: "error" },
      { inputs: [], name: "MintZeroQuantity", type: "error" },
      {
        inputs: [
          { internalType: "address", name: "operator", type: "address" },
        ],
        name: "OperatorNotAllowed",
        type: "error",
      },
      { inputs: [], name: "OwnerQueryForNonexistentToken", type: "error" },
      { inputs: [], name: "TransferCallerNotOwnerNorApproved", type: "error" },
      { inputs: [], name: "TransferFromIncorrectOwner", type: "error" },
      {
        inputs: [],
        name: "TransferToNonERC721ReceiverImplementer",
        type: "error",
      },
      { inputs: [], name: "TransferToZeroAddress", type: "error" },
      { inputs: [], name: "URIQueryForNonexistentToken", type: "error" },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "bytes32",
            name: "actionHash",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "address",
            name: "approver",
            type: "address",
          },
        ],
        name: "ActionApproved",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "bytes32",
            name: "actionHash",
            type: "bytes32",
          },
        ],
        name: "ActionExecuted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "bytes32",
            name: "actionHash",
            type: "bytes32",
          },
        ],
        name: "ActionProposed",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "approved",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "ApprovalForAll",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "newApprover",
            type: "address",
          },
        ],
        name: "ApproverAdded",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "removedApprover",
            type: "address",
          },
        ],
        name: "ApproverRemoved",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "string",
            name: "prevURI",
            type: "string",
          },
          {
            indexed: false,
            internalType: "string",
            name: "newURI",
            type: "string",
          },
        ],
        name: "ContractURIUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "newRoyaltyRecipient",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "newRoyaltyBps",
            type: "uint256",
          },
        ],
        name: "DefaultRoyalty",
        type: "event",
      },
      { anonymous: false, inputs: [], name: "GetAllApprovers", type: "event" },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "approver",
            type: "address",
          },
          {
            indexed: false,
            internalType: "string",
            name: "newNickname",
            type: "string",
          },
        ],
        name: "NicknameChanged",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "bool",
            name: "restriction",
            type: "bool",
          },
        ],
        name: "OperatorRestriction",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "prevOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnerUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "royaltyRecipient",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "royaltyBps",
            type: "uint256",
          },
        ],
        name: "RoyaltyForToken",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "newThreshold",
            type: "uint256",
          },
        ],
        name: "ThresholdChanged",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [],
        name: "OPERATOR_FILTER_REGISTRY",
        outputs: [
          {
            internalType: "contract IOperatorFilterRegistry",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        name: "actions",
        outputs: [
          { internalType: "bytes32", name: "actionHash", type: "bytes32" },
          { internalType: "uint256", name: "approvalCount", type: "uint256" },
          { internalType: "bool", name: "executed", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "operator", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "bytes32", name: "_actionHash", type: "bytes32" },
        ],
        name: "approveAction",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "approverAddresses",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "approvers",
        outputs: [
          { internalType: "string", name: "nickname", type: "string" },
          { internalType: "bool", name: "exists", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "uint256", name: "_quantity", type: "uint256" },
          { internalType: "string", name: "_baseURI", type: "string" },
          { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        name: "batchMintTo",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "confirmationThreshold",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "contractURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "enum muralcontract.ActionType",
            name: "actionType",
            type: "uint8",
          },
          { internalType: "address", name: "target", type: "address" },
          { internalType: "string", name: "data", type: "string" },
        ],
        name: "generateActionHash",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [],
        name: "getAllApprovers",
        outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "getApproved",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getBaseURICount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "_index", type: "uint256" }],
        name: "getBatchIdAtIndex",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getDefaultRoyaltyInfo",
        outputs: [
          { internalType: "address", name: "", type: "address" },
          { internalType: "uint16", name: "", type: "uint16" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "getRoyaltyInfoForToken",
        outputs: [
          { internalType: "address", name: "", type: "address" },
          { internalType: "uint16", name: "", type: "uint16" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "operator", type: "address" },
        ],
        name: "isApprovedForAll",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_operator", type: "address" },
          { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "isApprovedOrOwner",
        outputs: [
          { internalType: "bool", name: "isApprovedOrOwnerOf", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "string", name: "_tokenURI", type: "string" },
        ],
        name: "mintTo",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes[]", name: "data", type: "bytes[]" }],
        name: "multicall",
        outputs: [
          { internalType: "bytes[]", name: "results", type: "bytes[]" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "nextTokenIdToMint",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "operatorRestriction",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "ownerOf",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "bytes32", name: "_actionHash", type: "bytes32" },
        ],
        name: "proposeAction",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "salePrice", type: "uint256" },
        ],
        name: "royaltyInfo",
        outputs: [
          { internalType: "address", name: "receiver", type: "address" },
          { internalType: "uint256", name: "royaltyAmount", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "operator", type: "address" },
          { internalType: "bool", name: "approved", type: "bool" },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "string", name: "_uri", type: "string" }],
        name: "setContractURI",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_royaltyRecipient",
            type: "address",
          },
          { internalType: "uint256", name: "_royaltyBps", type: "uint256" },
        ],
        name: "setDefaultRoyaltyInfo",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "bool", name: "_restriction", type: "bool" }],
        name: "setOperatorRestriction",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_newOwner", type: "address" },
        ],
        name: "setOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "_tokenId", type: "uint256" },
          { internalType: "address", name: "_recipient", type: "address" },
          { internalType: "uint256", name: "_bps", type: "uint256" },
        ],
        name: "setRoyaltyInfoForToken",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_subscription", type: "address" },
        ],
        name: "subscribeToRegistry",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "bytes4", name: "interfaceId", type: "bytes4" },
        ],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "tokenURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    const web3 = new Web3(window.ethereum);
    setContract(new web3.eth.Contract(contractABI, contractAddress));
  };

  return (
    <div style={{ paddingTop: "10px" }}>
      <button
        onClick={() => {
          createWallet();
        }}
      >
        View MultiSig Wallet
      </button>
      {approvers ? (
        <ContractDetails
          approvers={approvers}
          changeNickName={changeNickName}
          threshold={threshold}
          changeThreshold={changeThreshold}
          addApprover={addApprover}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default MultiSigSetup;
