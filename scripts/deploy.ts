import { ethers, run } from 'hardhat';

async function main() {
  // See https://github.com/ETHPoster/contract
  const PosterAddress = '0x0000000000A84Fe7f5d858c8A22121c975Ff0b42'
  const ProxyPoster = await ethers.getContractFactory('ProxyPoster');
  const proxyPoster = await ProxyPoster.deploy(PosterAddress);

  await proxyPoster.deployed();

  console.log('ProxyPoster:', proxyPoster.address);

  // wait until the contract is available across the entire net
  await new Promise((resolve) => setTimeout(resolve, 1000 * 30));

  await run('verify:verify', {
    address: proxyPoster.address,
    constructorArguments: [PosterAddress],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
