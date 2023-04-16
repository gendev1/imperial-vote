// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
import {IWormholeReceiver} from "./IWormholeReceiver.sol";
import {IWormholeRelayer} from "./IWormholeRelayer.sol";
import "./libraries/BytesLib.sol";

contract CrossChainVoting is IWormholeReceiver {
    using BytesLib for bytes;

    // number of proposals created
    uint256 public proposalCount;

    // proposal storage with the proposalID as key
    mapping(uint256 => Proposal) public proposals;

    // mapping of addresses and proposalIDs to vote struct representing
    // the voting actions taken for each proposal
    mapping(address => mapping(uint256 => Vote)) public votes;

    enum Ballot { YES, NO, MAYBE }

    struct Proposal {
        // description of proposal
        string description;
        // block of the proposal creation
        uint128 created;
        // expiration time of a proposal
        uint128 expiration;
        // result
        bool isAccepted;
        // [yes, no, maybe] voting power
        uint256[3] votingPower;
    }

    struct DecodedProposal {
        // description of proposal
        string description;
        // block of the proposal creation
        uint128 created;
        // expiration time of a proposal
        uint128 expiration;
        // result
        bool isAccepted;
        
    }

    struct Vote {
        // voting power of the vote
        uint256 votingPower;
        // direction of the vote
        Ballot castBallot;
    }

    struct Option {
        uint8 val;
    }

    struct ProposalResult {
        uint256 proposalId;
        bool isAccepted;
    }

     event Voted(address indexed voter, uint256 indexed proposalId, Vote vote);
     event ProposalExecuted(uint256 proposalId);
     event ProposalCreated(
        uint256 proposalId,
        uint256 created,
        uint256 expiration
    );


    address public immutable owner;
    address public immutable wormhole;
    address public immutable wormholeRelayer;
    uint16 public immutable chainId;
    IERC20 token;

    uint16[] public registeredChains;
    mapping(uint16 => bytes32) public registeredChainToAddress;


    constructor(address _wormhole, address _wormholeRelayer, uint16 _chainId, address erc20){
        wormhole = _wormhole;
        wormholeRelayer = _wormholeRelayer;
        chainId = _chainId;
        owner = msg.sender;
        token = IERC20(erc20);
        proposalCount = 0;
    }

    /// @notice Votes for a new proposal.
    /// @dev all provided votingVaults must be approved vaults `approvedVaults`.
    /// @param proposalId proposal identifier.
    /// @param ballot vote direction (yes, no, maybe)
    /// @param tokenAmount the number of tokens user wants to vote with
    function vote(
        uint256 proposalId,
        Ballot ballot,
        uint256 tokenAmount
    ) public  {
        // No votes after the vote period is over
        require(proposals[proposalId].created != 0, "proposal does not exist");
        require(block.number <= proposals[proposalId].expiration, "Expired");

        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= tokenAmount, "Allowance does not meet the token amount");

        token.transfer(address(this), tokenAmount);

        require(votes[msg.sender][proposalId].votingPower == 0, "Already Voted");

        votes[msg.sender][proposalId] = Vote(tokenAmount, ballot);
        proposals[proposalId].votingPower[uint256(ballot)] = tokenAmount;

        // Emit an event to track this info
        emit Voted(msg.sender, proposalId, votes[msg.sender][proposalId]);
        
    }

    // @notice Close the voting for the given proposal ID
    function closeVoting(uint256 proposalId) internal {
        // We have to execute after min voting period
        require(block.number >= proposals[proposalId].expiration, "not expired");
         // If executed the proposal will be deleted and this will be zero
        require(proposals[proposalId].expiration != 0, "Previously executed");

        
        bool majorityInFavor = proposals[proposalId].votingPower[0] > proposals[proposalId].votingPower[1];

        // Notification of proposal execution
        emit ProposalExecuted(proposalId);

        // DO the magic here

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
                abi.encode(ProposalResult(proposalId, majorityInFavor)),
                keys,
                200
            );
            
        // delete proposal for some gas savings,
        // Proposals are only deleted when they are actually executed, failed proposals
        // are never deleted
        delete proposals[proposalId];

        

    } 

    function registerContract(address _addr, uint16 _chainId) external onlyOwner {
        registeredChains.push(_chainId);
        registeredChainToAddress[_chainId] = IWormholeRelayer(wormholeRelayer).toWormholeFormat(_addr);
    }

    function receiveWormholeMessages(DeliveryData calldata _deliveryData, bytes[] memory) external payable {
        require(
            registeredChainToAddress[_deliveryData.sourceChain] == _deliveryData.sourceAddress,
            "Unregistered sending contract"
        );

        Option memory option = abi.decode(_deliveryData.payload[:32], (Option));

        // create a new proposal
        if(option.val == 1){
            DecodedProposal memory p = abi.decode(_deliveryData.payload[32:], (DecodedProposal) );
            createProposal(p);
        } 
        if(option.val == 2){
           uint256 proposalId = abi.decode(_deliveryData.payload[32:],(uint256));
            closeVoting(proposalId);
        }

       
    }


    function createProposal(DecodedProposal memory p) internal{
        proposals[proposalCount] = Proposal(
            p.description,
            // Note we use blocknumber - 1 here as a flash loan mitigation.
            uint128(block.number - 1),
            uint128(block.number - p.created + p.expiration),
            false,
            proposals[proposalCount].votingPower
        );
         emit ProposalCreated(
            proposalCount,
            block.number,
            block.number - p.created + p.expiration
            
        );
        proposalCount += 1;
        
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "caller not the owner");
        _;
    }
}