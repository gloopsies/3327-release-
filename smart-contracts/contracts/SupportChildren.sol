// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./interfaces/ISupportChildren.sol";
import "./Swap.sol";


contract SupportChildren is Ownable, ISupportChildren {
    using SafeMath for uint;
    using SafeERC20 for IERC20;

    constructor() {
        admin = msg.sender;
        isOrganization[msg.sender] = true;
        allowedCurrencies[0x0000000000000000000000000000000000000000] = true; 
        allowedCurrencies[0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619] = true; 
        allowedCurrencies[0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063] = true; 
    }
    
    Swap public swap = new Swap();
    mapping (address => bool) public allowedCurrencies;
    mapping (uint => mapping(address => uint)) public donor_contributions;
    mapping(uint=>uint) public campaign_contributions;  // second is for campaigns contribution
    mapping(address => uint) public raisedAmount;
    Campaign[] public campaigns;
    address private constant UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address public admin;
    mapping (address => bool) public isOrganization;
    mapping (uint => address[]) public campaign_contributors;
    
    modifier conditions(address organization, address _cryptocurrency, uint _endTimestamp){
        require(isOrganization[organization] == true, "SupportChildren::createCampaign: Register your organization before creating campaign");
        require(_endTimestamp > block.timestamp, "SupportChildren::createCampaign: Campaign must end in the future");
        require(allowedCurrencies[_cryptocurrency] == true, "SupportChildren::createCampaign: Campaigns don't accept this currency for now. See our allowed currencies!");
        _;
    }
    
    
    modifier valid(uint _campaignId, uint _amount) {
        require(_campaignId < campaigns.length, "SupportChildren::donate/donateETH: Non existent campaign id provided");
        require(isCampaignActive(_campaignId), "SupportChildren::donate/donateETH: Campaign not active");
        require(!isCompleted(_campaignId),"SupportChildren::donate/donateETH: Campaing is completed");
        require(_amount > 0, "SupportChildren::donate: You must send some amount/ether");
        _;
    }
    
    modifier restricted(uint _campaignId) {
        require(!isCompleted(_campaignId),"SupportChildren::finalPayment: Campaign is completed");
        require(campaign_contributions[_campaignId] >= (campaigns[_campaignId].goal * 7 / 10), "SupportChildren::finalPayment: Minimum goal not reached"); // So this is to ensure us that we can call finalPayment when minimalGoal is reached
        _;
    }
    
    modifier refund(uint _campaignId, address _from){
        require(!isCompleted(_campaignId),"SupportChildren::getRefund: Campaign is completed");
        require(campaign_contributions[_campaignId] < (campaigns[_campaignId].goal * 7 / 10), "SupportChildren::getRefund: Minimum goal is reached"); // So this is to ensure us that we can call finalPayment when minimalGoal is reached
        require(donor_contributions[_campaignId][_from] > 0, "SupportChildren::getRefund: You haven't donated for this campaign");
        _;
    }
    
    
    function approve(address organization) override external {
        require(msg.sender == admin, "SupportChildren::approve: Contact us for approving your organization");
        isOrganization[organization] = true;
    }
    
    
    function isCompleted(uint _campaignId) override public view returns(bool) {
        return campaigns[_campaignId].completed;
    }
    
    function isCampaignActive(uint _campaignId) override public view returns(bool) {
        return campaigns[_campaignId].endTimestamp > block.timestamp;
    }

    function getCampaign(uint _campaignId) override public view returns(Campaign memory) {
        return campaigns[_campaignId];
    }
    
    function getCampaigns() override public view returns (Campaign[] memory) {
        return campaigns;
    }
    
    function swapERC20(address _tokenIn, address _tokenOut, uint _amount, uint _campaignId,uint _goal, bool isETH) private{
        uint _minimumAmount = swap.getAmountOutMin(_tokenIn, _tokenOut, _amount);
        // goal is not exceeded
        require(_minimumAmount + campaign_contributions[_campaignId] <= _goal, "SupportChildren::donate: Goal excedded");
        // if goal is not exceeded, transfer tokens from msg.sender to this contract
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amount);
        // now approve swap contract to do the swap and update contributions
        IERC20(_tokenIn).approve(address(swap), _amount);
        swap.swap( _tokenIn, _tokenOut, _amount, _minimumAmount, address(this),isETH);
    }
    
    function checkFinalPayment(uint _campaignId) internal{
        if(campaign_contributions[_campaignId] >= 99*(campaigns[_campaignId].goal)/100){
            finalPayment(_campaignId);
            emit GoalReached(campaigns[_campaignId].name, _campaignId, campaign_contributions[_campaignId], campaigns[_campaignId].beneficiary, campaign_contributors[_campaignId]);
        }
    }
        
    function updateERC20Contributions(uint _campaignId, uint donation, address _from, uint _amount) private {
         donor_contributions[_campaignId][msg.sender] += donation;
         campaign_contributions[_campaignId] += donation;
         raisedAmount[campaigns[_campaignId].cryptocurrency] = IERC20(campaigns[_campaignId].cryptocurrency).balanceOf(address(this));
         emit Donation(campaigns[_campaignId].name, _from, _campaignId, _amount, campaigns[_campaignId].cryptocurrency, campaigns[_campaignId].beneficiary);
         checkFinalPayment(_campaignId);
         
    }
    
    function updateCampaignContributors(uint _campaignId, address _from) private{
        if(donor_contributions[_campaignId][_from] == 0){
            campaign_contributors[_campaignId].push(_from);
        }
    }
    
    function newCurrency(address _token) override external {
        require(msg.sender == admin, "SupportChildren::newCurrency: Please contact admin for new currency");
        allowedCurrencies[_token] = true;
    }
    
    

    function createCampaign(string memory name, address payable _beneficiary, uint _endTimestamp, uint _goal,  address _cryptocurrency,string calldata uri) override external conditions(msg.sender, _cryptocurrency, _endTimestamp) {
        address payable beneficiary;
        if(_beneficiary != address(0)) {
            beneficiary = _beneficiary;
        }
        
        else {
            beneficiary = payable(msg.sender);
        }
        Campaign memory campaign = Campaign(name, _endTimestamp, beneficiary, false, _goal, _cryptocurrency, uri);
        uint campaignId = campaigns.length;

        campaigns.push(campaign);

        emit CampaignCreated(campaignId, campaign);
    }

    function donate(uint _campaignId, address _token, uint _amount) override external valid(_campaignId, _amount) {
        Campaign memory campaign = campaigns[_campaignId];
        // if campaign accept eth
        // 1. check if goal is not overlaped
        // 2. swap to token to eth
        // 3. update contributions mappings
        if(campaign.cryptocurrency == address(0)){
            swapERC20(_token, swap.WETH(), _amount, _campaignId, campaign.goal, true);
            updateCampaignContributors(_campaignId, msg.sender);
            uint donation = address(this).balance - raisedAmount[address(0)] ;
            donor_contributions[_campaignId][msg.sender] += donation;
            campaign_contributions[_campaignId] += donation;
            raisedAmount[address(0)] = address(this).balance;
            emit Donation(campaign.name, msg.sender, _campaignId, _amount, _token, campaign.beneficiary);
            checkFinalPayment(_campaignId);
        
        }
        
          // if campaign accept ERC20
         // check if _token is targeted one, no need to swap , just update contributions mappings and check final goal
        // if token is not targeted one then
       // 1. check if goal is not overlaped
      // 2. swap to token to eth
     // 3. update contributions mappings
  
        else{
            
            if(_token == campaign.cryptocurrency){
                // 100% of goal is not exceeded
                require(_amount + campaign_contributions[_campaignId] <= (campaign.goal), "SupportChildren::donate: Goal excedded");  
                // if goal is not exceeded, transfer tokens from msg.sender to this contract
                IERC20(_token).transferFrom(msg.sender, address(this), _amount);
                updateCampaignContributors(_campaignId, msg.sender);
                uint donation = IERC20(_token).balanceOf(address(this)) - raisedAmount[campaign.cryptocurrency];
                updateERC20Contributions(_campaignId, donation, msg.sender, _amount);
                
            }
            
            else{
        
                swapERC20(_token, campaign.cryptocurrency, _amount, _campaignId, campaign.goal, false);
                uint donation = IERC20(campaign.cryptocurrency).balanceOf(address(this)) - raisedAmount[campaign.cryptocurrency];
                updateERC20Contributions(_campaignId, donation, msg.sender, _amount);
                
            }
        }
       
    }

    function donateETH(uint _campaignId) override external payable valid(_campaignId, msg.value) {
        
        Campaign memory campaign = campaigns[_campaignId];
        
        // if campaign accept eth
        if(campaign.cryptocurrency == address(0)){
            require(msg.value + campaign_contributions[_campaignId] <= campaign.goal, "SupportChildren::donate: Goal excedded");   
            updateCampaignContributors(_campaignId, msg.sender);
            donor_contributions[_campaignId][msg.sender] += msg.value;
            campaign_contributions[_campaignId] += msg.value;
            raisedAmount[address(0)] = address(this).balance; 
            emit Donation(campaign.name, msg.sender, _campaignId, msg.value, address(0), campaign.beneficiary);
            checkFinalPayment(_campaignId);
        }
        
        // if campaign accept ERC20
        
        else{
            
                uint _minimumAmount = swap.getAmountOutMin(swap.WETH(), campaign.cryptocurrency, msg.value);
                // goal is not exceeded
                require(_minimumAmount + campaign_contributions[_campaignId] <= campaign.goal,"SupportChildren::donate: Goal excedded");
                address[] memory path = new address[](2);
                path[0] = swap.WETH();
                path[1] = campaign.cryptocurrency;
                IUniswapV2Router(UNISWAP_V2_ROUTER).swapExactETHForTokensSupportingFeeOnTransferTokens{value:(msg.value)}(_minimumAmount, path, address(this), block.timestamp);
                updateCampaignContributors(_campaignId, msg.sender);
                uint donation = IERC20(campaign.cryptocurrency).balanceOf(address(this)) - raisedAmount[campaign.cryptocurrency];
                updateERC20Contributions(_campaignId, donation, msg.sender, msg.value);
                
               
            
            }
        
    }
    
    function finalPayment(uint _campaignId) override public payable restricted(_campaignId) {
        
         if(campaigns[_campaignId].cryptocurrency == address(0)){
             payable(campaigns[_campaignId].beneficiary).transfer(campaign_contributions[_campaignId]);
             campaigns[_campaignId].completed = true;
             raisedAmount[address(0)] = address(this).balance;
         }
         else{
             IERC20(campaigns[_campaignId].cryptocurrency).transfer(campaigns[_campaignId].beneficiary,campaign_contributions[_campaignId]);
             campaigns[_campaignId].completed = true;
             raisedAmount[campaigns[_campaignId].cryptocurrency] = IERC20(campaigns[_campaignId].cryptocurrency).balanceOf(address(this));
            }
    }
    
    function getRefund(uint _campaignId) override external payable refund(_campaignId, msg.sender){
        if(campaigns[_campaignId].cryptocurrency == address(0)){
            
             
             payable(msg.sender).transfer(donor_contributions[_campaignId][msg.sender]);
             campaign_contributions[_campaignId] -= donor_contributions[_campaignId][msg.sender];
             donor_contributions[_campaignId][msg.sender] = 0;
             raisedAmount[address(0)] = address(this).balance;
             if(campaign_contributions[_campaignId] == 0){
                 campaigns[_campaignId].completed = true;
             }
         }
         
        else{
            
             IERC20(campaigns[_campaignId].cryptocurrency).transfer(msg.sender, donor_contributions[_campaignId][msg.sender]);
             campaign_contributions[_campaignId] -= donor_contributions[_campaignId][msg.sender];  
             donor_contributions[_campaignId][msg.sender] = 0;
             raisedAmount[campaigns[_campaignId].cryptocurrency] = IERC20(campaigns[_campaignId].cryptocurrency).balanceOf(address(this));
              if(campaign_contributions[_campaignId] == 0){
                campaigns[_campaignId].completed = true;
              }
        }
    }
    
    
    
    
    

    
    receive() payable external {}
}
