const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("PostTrackerV2", function() {
    async function deployEmpty() {
        const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
        const [owner, otherAccount] = await ethers.getSigners();
        const PostTracker = await ethers.getContractFactory("PostTrackerV2");
        //const postTracker = await PostTracker.deploy(ZERO_ADDRESS, []);
        //const postTracker = await PostTracker.deploy();
        const postTracker = await PostTracker.deploy(ZERO_ADDRESS);

        return { postTracker, owner, otherAccount };
    }

    describe("Posting", function() {
        it("When no posts made, no posts should be visible", async function() {
            const {postTracker, owner} = await loadFixture(deployEmpty);
            expect(await postTracker.getNumThreads(owner.address)).to.equal(0);
        });
        it("When a post is made, show 1 thread", async function() {
            const {postTracker, owner} = await loadFixture(deployEmpty);
            await postTracker.newPost("random_cid", owner.address);
            expect(await postTracker.getNumThreads(owner.address)).to.equal(1);
        });
        it("New post CID should be returned on getPostsInThread", async function() {
            const {postTracker, owner} = await loadFixture(deployEmpty);
            await postTracker.newPost("random_cid", owner.address);
            const post_time = await time.latest();
            await time.increase(100);
            expect(await postTracker.getPostsInThread(owner.address, 0)).to.deep.equal([["random_cid", post_time, owner.address, 0n]]);
        });
        it("New reply CID should be returned on getPostsInThread", async function() {
            const {postTracker, owner} = await loadFixture(deployEmpty);
            await postTracker.newPost("random_cid", owner.address);
            const post_time = await time.latest();
            await postTracker["newReply(string, address, uint)"]("random_cid2", owner.address, 0);
            const reply_time = await time.latest();
            expect(await postTracker.getPostsInThread(owner.address, 0)).to.deep.equal([["random_cid", post_time, owner.address, 0n], 
            ["random_cid2", reply_time, owner.address, 1n]]);
        });
    });
});