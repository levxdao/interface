import { constants, utils } from "ethers";
import Airdrop from "../../types/Airdrop";
import levxShoyuGrant from "./levx-shoyu-grant.csv.json";
import master3 from "./master-3%.csv.json";
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
    },
    {
        name: "3% of $MASTER Airdrop",
        description: "For $MAID holders",
        token: "0xc0746351f7F55a69415b280Ca6378093EA4aAFF2",
        merkleRoot: "0x6ce85395f71223353592f7d4fbb56a2971c36b474c4bfe1da9a50ce3405d1c56",
        snapshot: 13732533,
        amount: utils.parseEther("3"),
        entries: master3
    }
] as Airdrop[];
