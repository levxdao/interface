import ETH from "@levxdao/airdrop/deployments/mainnet/ETHAirdrop.json";
import Levx from "@levxdao/airdrop/deployments/mainnet/LevxAirdrop.json";
import { ETHAirdrop, LevxAirdrop } from "@levxdao/airdrop/typechain";
import { Contract, ethers } from "ethers";

export const getETHAirdropContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
    // @ts-ignore
    return new Contract(ETH.address, ETH.abi, signerOrProvider) as ETHAirdrop;
};

export const getLevxAirdropContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
    // @ts-ignore
    return new Contract(Levx.address, Levx.abi, signerOrProvider) as LevxAirdrop;
};
