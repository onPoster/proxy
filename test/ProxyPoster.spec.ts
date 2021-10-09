import { Contract } from '@ethersproject/contracts';
import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';

describe('Poster Proxy should:', function () {
    let poster: Contract, proxyPoster: Contract;
    before(async function() {
      const [deployer] = await ethers.getSigners();
      const biconomyForwarder = '0x86C80a8aa58e0A4fa09A69624c31Ab2a6CAD56b8'
      const Poster = await ethers.getContractFactory("Poster", deployer);
      poster = await Poster.deploy();
      expect(await poster.address);
      const ProxyPoster = await ethers.getContractFactory("ProxyPoster", deployer);
      proxyPoster = await ProxyPoster.deploy(poster.address, biconomyForwarder)
      await proxyPoster.deployed()
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
        .withArgs(proxyPoster.address, '{"type":"microblog","from":"' + user.address.toLowerCase() + '","text":' + content + '}');
    })
  });