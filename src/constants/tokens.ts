import { ethers } from "ethers";
import Token from "../types/Token";

export const ETH: Token = {
    address: ethers.constants.AddressZero,
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    logoURI: "https://levxdao.org/images/tokens/ETH.png",
    balance: ethers.BigNumber.from(0)
};

export const LEVX: Token = {
    address: "0xf474E526ADe9aD2CC2B66ffCE528B1A51B91FCdC",
    name: "LevX DAŌh..Geez (LEVX)",
    symbol: "LEVX",
    decimals: 18,
    logoURI:
        "https://raw.githubusercontent.com/sushiswap/logos/main/network/ethereum/0xf474E526ADe9aD2CC2B66ffCE528B1A51B91FCdC.jpg",
    balance: ethers.BigNumber.from(0)
};
