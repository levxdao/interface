import { useCallback, useContext } from "react";

import { signERC2612Permit } from "eth-permit";
import { ethers } from "ethers";
import { MIGRATOOOOOOR, OH_GEEZ_LP } from "../constants/contracts";
import { EthersContext } from "../context/EthersContext";
import { getContract } from "../utils";
import { logTransaction } from "../utils/analytics-utils";

// tslint:disable-next-line:max-func-body-length
const useMigratoooooor = () => {
    const { ethereum } = useContext(EthersContext);
    const ttl = 60 * 20;

    const migrate = useCallback(
        async (liquidity: ethers.BigNumber, amountWethAddedMin: ethers.BigNumber, signer: ethers.Signer) => {
            const contract = getContract("Migratoooooor", MIGRATOOOOOOR, signer);
            const deadline = Math.floor(new Date().getTime() / 1000) + ttl;
            const args = [liquidity, amountWethAddedMin, deadline, await signer.getAddress()];
            const gasLimit = await contract.estimateGas.migrate(...args);
            const tx = await contract.migrate(...args, {
                gasLimit: gasLimit.mul(120).div(100)
            });
            return logTransaction(tx, "Migratoooooor.migrate()", ...args.map(arg => arg.toString()));
        },
        [ethereum]
    );

    const migrateWithPermit = useCallback(
        async (liquidity: ethers.BigNumber, amountWethAddedMin: ethers.BigNumber, signer: ethers.Signer) => {
            const contract = getContract("Migratoooooor", MIGRATOOOOOOR, signer);
            const deadline = Math.floor(new Date().getTime() / 1000) + ttl;
            const permit = await signERC2612Permit(
                ethereum,
                OH_GEEZ_LP,
                await signer.getAddress(),
                MIGRATOOOOOOR,
                liquidity.toString(),
                deadline
            );
            const args = [
                liquidity,
                amountWethAddedMin,
                deadline,
                await signer.getAddress(),
                permit.v,
                permit.r,
                permit.s
            ];
            const gasLimit = await contract.estimateGas.migrateWithPermit(...args);
            const tx = await contract.migrateWithPermit(...args, {
                gasLimit: gasLimit.mul(120).div(100)
            });
            return logTransaction(tx, "Migratoooooor.migrateWithPermit()", ...args.map(arg => arg.toString()));
        },
        [ethereum]
    );

    return {
        migrate,
        migrateWithPermit
    };
};

export default useMigratoooooor;
