// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;


import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import {IWormholeReceiver} from "./IWormholeReceiver.sol";
import {IWormholeRelayer} from "./IWormholeRelayer.sol";
import "./libraries/BytesLib.sol";

contract DAO is IWormholeReceiver {
    // state variables

    // if a function selector does not have a set quorum we use this default quorum
    uint256 public baseQuorum;

    // Assumes avg block time of 13.3 seconds. May be longer or shorter due
    // to ice ages or short term changes in hash power.
    uint256 public constant DAY_IN_BLOCKS = 6496;

    // minimum time a proposal must be active for before executing
    // Default to 3 days, this avoids weekend surprise proposals
    uint256 public lockDuration = DAY_IN_BLOCKS * 3;

    // The number of blocks after the proposal is unlocked during which
    // voting can continue. Max vote time = lockDuration + extraVoteTime
    // Default to ~5 days of blocks, ie 8 days max vote time
    uint256 public extraVoteTime = DAY_IN_BLOCKS * 5;

    // number of proposals created
    uint256 public proposalCount;

    // proposal storage with the proposalID as key
    mapping(uint256 => Proposal) public proposals;

    struct Proposal {
        // description of proposal
        string description;
        // block of the proposal creation
        uint128 created;
        // expiration time of a proposal
        uint128 expiration;
        // result
        bool isAccepted;
    }

    struct Option {
        uint8 val;
    }

    event ProposalCreated(
        uint256 proposalId,
        uint256 created,
        uint256 expiration
    );

    event ProposalExecuted(uint256 proposalId);

    enum Ballot { YES, NO, MAYBE }

    uint16[] public registeredChains;
    mapping(uint16 => bytes32) public registeredChainToAddress;

    address public immutable owner;
    address public immutable wormhole;
    address public immutable wormholeRelayer;
    uint16 public immutable chainId;


    // DAO goes on Celio
    constructor(address _wormhole, address _wormholeRelayer, uint16 _chainId){
        wormhole = _wormhole;
        wormholeRelayer = _wormholeRelayer;
        chainId = _chainId;
        owner = msg.sender;
        proposalCount = 0;
    }

    /// @notice Create a new proposal
    /// @dev all provided votingVaults must be approved vaults `approvedVaults`.
    /// @param description description of the proposal
    /// @param expiration expiration of the proposal
    function proposal(string calldata description, uint128 expiration) external payable{
        // We check that the expiration is possibly valid
        require(
            expiration > block.number,
            "expires before voting ends"
        );

        proposals[proposalCount] = Proposal(
            description,
            // Note we use blocknumber - 1 here as a flash loan mitigation.
            uint128(block.number - 1),
            uint128(expiration),
            false
        );


        //TODO: add interchain magic here
        uint256 sent = 0;
        uint256 cost = 1e17;

        for (uint256 i = 0; i < registeredChains.length; i++) {
            uint16 _chainId = registeredChains[i];
            bytes32 _targetAddress = registeredChainToAddress[_chainId];

            IWormholeRelayer.VaaKey[]
                memory keys = new IWormholeRelayer.VaaKey[](0);
            IWormholeRelayer(wormholeRelayer).send{value: cost}(
                // targetChain
                _chainId,
                _targetAddress,
                // refundChain
                _chainId,
                // refundAddress
                _targetAddress,
                cost,
                0,
                abi.encode(Option(1), proposals[proposalCount]),
                keys,
                200
            );
            sent += cost;
        }

        if (msg.value - sent > 0) {
            (bool success, ) = msg.sender.call{value: msg.value - sent}("");
            require(success, "didn't succeed refunding caller");
        }

        emit ProposalCreated(
            proposalCount,
            block.number,
            expiration
            
        );

        proposalCount += 1;
    }

    /// @notice Execute a proposal.
    /// @param proposalId proposal identifier.
    function execute(uint256 proposalId) external{
        // We have to execute after min voting period
        require(block.number >= proposals[proposalId].expiration, "voting still happening");
        // If executed the proposal will be deleted and this will be zero
        require(proposals[proposalId].expiration != 0, "Previously executed");

        // TODO: call other contract here
        IWormholeRelayer.VaaKey[]
                memory keys = new IWormholeRelayer.VaaKey[](0);
            IWormholeRelayer(wormholeRelayer).send{value: 1e17}(
                // targetChain
                registeredChains[0],
                registeredChainToAddress[registeredChains[0]],
                // refundChain
                registeredChains[0],
                // refundAddress
                registeredChainToAddress[registeredChains[0]],
                1e17,
                0,
                abi.encode(Option(2), proposalId),
                keys,
                200
            );

        

    }

    function registerContract(address _addr, uint16 _chainId) external onlyOwner {
        registeredChains.push(_chainId);
        registeredChainToAddress[_chainId] = IWormholeRelayer(wormholeRelayer).toWormholeFormat(_addr);
    }

    function receiveWormholeMessages(DeliveryData memory _deliveryData, bytes[] memory) external payable {
        require(
            registeredChainToAddress[_deliveryData.sourceChain] == _deliveryData.sourceAddress,
            "Unregistered sending contract"
        );
        
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "caller not the owner");
        _;
    }

}