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

pragma solidity 0.8.2;

import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/metatx/ERC2771Context.sol';
import './interfaces/IPoster.sol';

contract ProxyPoster is ERC2771Context {
    IPoster public posterContract;

    /**
     * @dev Provide Poster contract address. There’s no update mechanics around this.
     * @param _trustedForwarder address Address of a trusted forwarder.
     * @param _posterAddress address Address of the poster contract to use.
     */
    constructor(address _posterAddress, address _trustedForwarder)
        ERC2771Context(_trustedForwarder)
    {
        posterContract = IPoster(_posterAddress);
    }

    function post(string memory content) public {
        posterContract.post(
            string(
                abi.encodePacked(
                    '{"type":"microblog","from":"',
                    Strings.toHexString(uint256(uint160(address(_msgSender())))),
                    '","text":',
                    content,
                    '}'
                )
            )
        );
    }
}
