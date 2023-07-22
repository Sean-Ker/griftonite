const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("PostTrackerV1", function() {
    async function deployEmpty() {
        const [owner, otherAccount] = await ethers.getSigners();
        const PostTracker = await ethers.getContractFactory("PostTrackerV1");
        const postTracker = await PostTracker.deploy();

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
            expect(await postTracker.getPostsInThread(owner.address, 0)).to.deep.equal(["random_cid"]);
        });
        it("New reply CID should be returned on getPostsInThread", async function() {
            const {postTracker, owner} = await loadFixture(deployEmpty);
            await postTracker.newPost("random_cid", owner.address);
            await postTracker["newPost(string, address, uint)"]("random_cid2", owner.address, 0);
            expect(await postTracker.getPostsInThread(owner.address, 0)).to.deep.equal(["random_cid", "random_cid2"]);
        });
    });
});