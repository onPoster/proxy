/*
 _____   ______  _____  _     _ __   __
|_____] |_____/ |     |  \___/    \_/  
|       |    \_ |_____| _/   \_    |   

██████╗  ██████╗ ███████╗████████╗███████╗██████╗
██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗
██████╔╝██║   ██║███████╗   ██║   █████╗  ██████╔╝
██╔═══╝ ██║   ██║╚════██║   ██║   ██╔══╝  ██╔══██╗
██║     ╚██████╔╝███████║   ██║   ███████╗██║  ██║
╚═╝      ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
A proxy smart contract to allow gasless interactions with Poster.
Since Poster only takes msg.sender, a proxy supporting EIP-2771 is required.
Poster created by Auryn.eth, Proxy Poster by jjperezaguinaga.eth
*/
// SPDX-License-Identifier: LGPL-3.0-only

pragma solidity 0.8.0;

import '@openzeppelin/contracts/utils/Strings.sol';
import './EIP712MetaTransaction.sol';
import './interfaces/IPoster.sol';
import 'hardhat/console.sol';

contract ProxyPoster is EIP712MetaTransaction('ProxyPoster', '1') {
    IPoster public posterContract;

    /**
     * @dev Provide Poster contract address. There’s no update mechanics around this.
     * @param _posterAddress address Address of the Poster contract.
     */
    constructor(address _posterAddress) {
        posterContract = IPoster(_posterAddress);
    }

    function post(string memory content) public {
        posterContract.post(
            string(
                abi.encodePacked(
                    '{"from":"',
                    Strings.toHexString(uint256(uint160(address(msgSender())))),
                    '",content:',
                    content,
                    '}'
                )
            )
        );
    }
}
