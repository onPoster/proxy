import { Contract } from '@ethersproject/contracts';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Poster should:', function () {
  let poster: Contract;
  before(async function() {
    const [deployer] = await ethers.getSigners();
    const Poster = await ethers.getContractFactory("Poster", deployer);
    poster = await Poster.deploy();
    expect(await poster.address);
  });

  it("emit an event when post() is called", async function () {
    const [_, user] = await ethers.getSigners();
    let content =
      '{"post":{"type":"microblog","text":"this is a post from user"}}';
    // Test that a NewPost event was emitted with the correct user, and content
    await expect(await poster.connect(user).post(content))
      .to.emit(poster, "NewPost")
      .withArgs(user.address, content);
  });
});

