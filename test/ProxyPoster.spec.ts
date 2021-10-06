import { Contract } from '@ethersproject/contracts';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Poster Proxy should:', function () {
    let poster: Contract, proxyPoster: Contract;
    before(async function() {
      const [deployer] = await ethers.getSigners();
      const Poster = await ethers.getContractFactory("Poster", deployer);
      poster = await Poster.deploy();
      expect(await poster.address);
      const ProxyPoster = await ethers.getContractFactory("ProxyPoster", deployer);
      proxyPoster = await ProxyPoster.deploy(poster.address);
      expect(await proxyPoster.address);
    });
  
    it("have Poster’s contract address defined", async function () {
      expect(await proxyPoster.posterContract()).to.eq(poster.address)
    });
  
    it("should trigger an emit event in Poster's contract", async function () {
      const [_, user] = await ethers.getSigners();
      let content = 
        '{"post":{"type":"microblog","text":"this is a post from user proxied to poster"}}';
      await expect(await proxyPoster.connect(user).post(content))
        .to.emit(poster, "NewPost")
        .withArgs(proxyPoster.address, '{"from":"' + user.address.toLowerCase() + '",content:' + content + '}');
    })
  });