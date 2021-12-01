import { constants, utils } from "ethers";
import Airdrop from "../../types/Airdrop";
import levxShoyuGrant from "./levx-shoyu-grant.csv.json";
import sushiCnAma from "./sushi-cn-ama.csv.json";

export default [
    {
        name: "Shoyu Grant Payout",
        description: "For $LEVX holders",
        token: constants.AddressZero,
        merkleRoot: "0x0737c6eeb66be734365fd7a7a1c505bb32b815da441f2959b0b8141583340472",
        snapshot: 13711588,
        amount: utils.parseEther("16.124383959865324089"),
        entries: levxShoyuGrant
    },
    {
        name: "LEVX Airdrop",
        description: "SushiSwap China AMA",
        token: "0xf474E526ADe9aD2CC2B66ffCE528B1A51B91FCdC",
        merkleRoot: "0x84a50342486cf8cd0aa75740ad78b8a780f5ba76139411f5b6433506d538381c",
        amount: utils.parseEther("6.67"),
        entries: sushiCnAma
    }
] as Airdrop[];
