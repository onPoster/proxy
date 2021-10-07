import { ethers, run, upgrades } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  // See https://github.com/ETHPoster/contract
  const PosterAddress = '0x0000000000A84Fe7f5d858c8A22121c975Ff0b42'
  // See https://docs.biconomy.io/misc/contract-addresses
  const BiconomyTrustedForwarder = '0x86C80a8aa58e0A4fa09A69624c31Ab2a6CAD56b8'

  const ProxyPoster = await ethers.getContractFactory('ProxyPoster');
  const proxyPoster = await ProxyPoster.deploy(PosterAddress, BiconomyTrustedForwarder)
  const deployedProxyPosterContract = await proxyPoster.deployed()

  console.log('ProxyPoster:', deployedProxyPosterContract.address);
  // wait until the contract is available across the entire net
  await new Promise((resolve) => setTimeout(resolve, 1000 * 30));

  await run('verify:verify', {
    address: proxyPoster.address,
    constructorArguments: [PosterAddress, BiconomyTrustedForwarder],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
