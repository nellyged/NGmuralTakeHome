// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";

contract muralcontract is ERC721Base {

    struct Approver {
        string nickname;
        bool exists;
    }

    struct Action {
        bytes32 actionHash;
        uint256 approvalCount;
        mapping(address => bool) approvedBy;
        bool executed;
    }

    mapping(address => Approver) public approvers;
    address[] public approverAddresses;
    uint256 public confirmationThreshold;

    // Proposed actions
    mapping(bytes32 => Action) public actions;

    // Events
    event NicknameChanged(address indexed approver, string newNickname);
    event ActionProposed(bytes32 actionHash);
    event ActionApproved(bytes32 actionHash, address approver);
    event ActionExecuted(bytes32 actionHash);
    event ApproverAdded(address indexed newApprover);
    event ApproverRemoved(address indexed removedApprover);
    event ThresholdChanged(uint256 newThreshold);
    event GetAllApprovers();

    constructor(
        address[] memory initialApprovers,
        uint256 _confirmationThreshold,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    )
        ERC721Base(
            address(this),  // The contract itself is the owner for ERC721Base.
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps
        )
    {
        for (uint256 i = 0; i <= initialApprovers.length; i++) {
            approvers[initialApprovers[i]] = Approver("", true);
            approverAddresses.push(initialApprovers[i]);
        }
        confirmationThreshold = _confirmationThreshold;
    }

    function proposeAction(bytes32 _actionHash) external {
        require(approvers[msg.sender].exists, "Only approvers can propose actions");
        require(actions[_actionHash].actionHash == bytes32(0), "Action already proposed");

        actions[_actionHash].actionHash = _actionHash;
        actions[_actionHash].approvalCount = 0;
        actions[_actionHash].executed = false;

        emit ActionProposed(_actionHash);
    }

    function approveAction(bytes32 _actionHash) external {
        require(approvers[msg.sender].exists, "Only approvers can approve actions");
        require(actions[_actionHash].actionHash != bytes32(0), "Action not found");
        require(!actions[_actionHash].approvedBy[msg.sender], "Action already approved by this approver");
        require(!actions[_actionHash].executed, "Action already executed");

        actions[_actionHash].approvedBy[msg.sender] = true;
        actions[_actionHash].approvalCount++;

        emit ActionApproved(_actionHash, msg.sender);

        // If the number of approvals for the action reaches the threshold, execute it
        if (actions[_actionHash].approvalCount >= confirmationThreshold) {
            _executeAction(_actionHash);
        }
    }

    // create a function that returns all the approvers
    function getAllApprovers() external view returns (address[] memory) {
        return approverAddresses;
    }

    enum ActionType {
    AddApprover,
    RemoveApprover,
    ChangeNickname,
    ChangeThreshold
}

function generateActionHash(ActionType actionType, address target, string memory data) public pure returns (bytes32) {
    return keccak256(abi.encode(actionType, target, data));
}

    function _executeAction(bytes32 _actionHash) internal {
        require(!actions[_actionHash].executed, "Action has already been executed");

        ActionType actionType;
        address target;
        string memory data;

        // Decoding the action hash
        (actionType, target, data) = abi.decode(abi.encode(_actionHash), (ActionType, address, string));

        if (actionType == ActionType.AddApprover) {
            approvers[target].exists = true;
        }
        else if (actionType == ActionType.RemoveApprover) {
            delete approvers[target];
        }
        else if (actionType == ActionType.ChangeNickname) {
            approvers[target].nickname = data;
            emit NicknameChanged(target, data);
        }
        else if (actionType == ActionType.ChangeThreshold) {
            confirmationThreshold = uint256(keccak256(abi.encode(data))); // assuming the new threshold is hashed as a string
            emit ThresholdChanged(confirmationThreshold);
        }

        actions[_actionHash].executed = true;
        emit ActionExecuted(_actionHash);
    }
}

