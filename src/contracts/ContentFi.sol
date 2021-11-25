// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract ContentFi {
  uint public videoCount = 0;
  uint public personCount = 0;
  string public name = "ContentFi";
  mapping(uint => Video) public videos;
  mapping(address => Profile) public profiles;
  mapping(address => address[]) public followers;
  mapping(address => address[]) public followees;
  mapping(address => uint) public followers_count;
  mapping(address => uint) public followees_count;
  mapping(address => mapping(address=>bool)) has_followed;
  mapping(address => uint) public subscribe_price;
  mapping(address => uint[]) public author_videos;

  address public owner;

  struct Video {
    uint id;
    string hash;
    string title;
    address author;
  }

  struct Profile {
    string avatarHash;
    string nickname;
    address user;
  }

  event VideoUploaded(
    uint id,
    string hash,
    string title,
    address author
  );

  event ProfileSetted(
    string avatarHash,
    string nickname,
    address user
  );

  event PriceUpdated (
    address author,
    uint new_price,
    uint old_price
  );

  constructor() public {
    owner = msg.sender;
  }

  // upload video 
  function uploadVideo(string memory _videoHash, string memory _title) public {
    // Make sure the video hash exists
    require(bytes(_videoHash).length > 0);
    // Make sure video title exists
    require(bytes(_title).length > 0);
    // Make sure uploader address exists
    require(msg.sender!=address(0));

    // Increment video id
    videoCount ++;

    // Add video to the contract
    videos[videoCount] = Video(videoCount, _videoHash, _title, msg.sender);
    // Add video to author's video list
    author_videos[msg.sender].push(videoCount);
    // Trigger an event
    emit VideoUploaded(videoCount, _videoHash, _title, msg.sender);
  }

  // set nicname and avatar picture
  function setProfile(string memory _avatarHash, string memory _nickname) public {
    require(bytes(_avatarHash).length > 0);
    require(bytes(_nickname).length > 0);
    require(msg.sender!=address(0));
    personCount ++; //one more person
    profiles[msg.sender] = Profile(_avatarHash, _nickname, msg.sender);
    emit ProfileSetted(_avatarHash, _nickname, msg.sender);
  }

  // follow 
  function follow(address payable followee) public payable {
    require(msg.sender!=address(0));
    require(followee!=address(0));
    uint price_needed = subscribe_price[followee];
    require(msg.value >= price_needed, "paid fee not enough");
    require(msg.sender.balance >= price_needed, "Not enough funds.");
    require(has_followed[msg.sender][followee] == false, "already followed");
    followee.transfer(msg.value);
    followers[followee].push(msg.sender);
    followees[msg.sender].push(followee);
    followers_count[followee]++;
    followees_count[msg.sender]++;
    has_followed[msg.sender][followee] = true;
  }

  // update price of subscription
  function updatePrice(uint _new_price) public {
    uint old_price = subscribe_price[msg.sender];
    subscribe_price[msg.sender] = _new_price;
    emit PriceUpdated(msg.sender, _new_price, old_price);
  }

}

