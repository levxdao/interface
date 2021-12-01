import { BigNumber } from "ethers";

export default interface Airdrop {
    name: string;
    description: string;
    token: string;
    merkleRoot: string;
    amount: BigNumber;
    snapshot?: number;
    entries: string[][];
}
