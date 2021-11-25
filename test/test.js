const cContentFi = artifacts.require('ContentFi')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('ContentFi', ([deployer, author, vip, fans1, fans2]) => {
  let ContentFi
  before(async () => {
    ContentFi = await cContentFi.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await ContentFi.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await ContentFi.name()
      assert.equal(name, 'ContentFi')
    })
  })

  describe('videos', async () => {
    let result, videoCount
    const hash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'
    //let my_balance = await web3.eth.getBalance(author)
    //console.log(my_balance)
    before(async () => {
      result = await ContentFi.uploadVideo(hash, 'Video title', { from: author })
      videoCount = await ContentFi.videoCount()
    })

    //check event
    it('creates videos', async () => {
      // SUCESS
      assert.equal(videoCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), videoCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.title, 'Video title', 'title is correct')
      assert.equal(event.author, author, 'author is correct')

      // FAILURE: Video must have hash
      await ContentFi.uploadVideo('', 'Video title', { from: author }).should.be.rejected;

      // FAILURE: Video must have title
      await ContentFi.uploadVideo('Video hash', '', { from: author }).should.be.rejected;
    })

    //check from Struct
    it('lists videos', async () => {
      const video = await ContentFi.videos(videoCount)
      const first_video = await ContentFi.author_videos(author, 0)
      assert.equal(video.id.toNumber(), videoCount.toNumber(), 'id is correct')
      assert.equal(video.hash, hash, 'Hash is correct')
      assert.equal(video.title, 'Video title', 'title is correct')
      assert.equal(video.author, author, 'author is correct')
      assert.equal(first_video, video.id.toNumber())
    })
  })

  describe('follows', async () => {
   //check event
    it('follow', async () => {
       let r1 = await ContentFi.updatePrice(888, {from: vip})
       const log_event = r1.logs[0].args
       //console.log(vip)
       await ContentFi.follow(vip, {from: fans1, value:777}).should.be.rejected
       await ContentFi.follow(vip, {from: fans1, value:888}).should.not.rejected
    })

    //check from Struct
    it('list follower', async () => {
	await ContentFi.follow(vip, {from: fans1, value:888}).should.be.rejected // already followed
	await ContentFi.follow(vip, {from: fans2, value:889}).should.not.rejected
	let fans_count = await ContentFi.followers_count(vip)
	assert.equal(fans_count.toNumber(), 2)
    })
  })

})
