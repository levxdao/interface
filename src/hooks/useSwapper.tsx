import { useCallback, useContext } from "react";

import { ethers } from "ethers";
import { SWAPPER } from "../constants/contracts";
import { EthersContext } from "../context/EthersContext";
import { getContract } from "../utils";
import { logTransaction } from "../utils/analytics-utils";

// tslint:disable-next-line:max-func-body-length
const useSwapper = () => {
    const { ethereum } = useContext(EthersContext);

    const swap = useCallback(
        async (amount: ethers.BigNumber, signer: ethers.Signer) => {
            const contract = getContract("Swapper", SWAPPER, signer);
            const args = [amount, await signer.getAddress()];
            const gasLimit = await contract.estimateGas.swap(...args);
            const tx = await contract.swap(...args, {
                gasLimit: gasLimit.mul(120).div(100)
            });
            return logTransaction(tx, "Swapper.swap()", ...args.map(arg => arg.toString()));
        },
        [ethereum]
    );

    return {
        swap
    };
};

export default useSwapper;
