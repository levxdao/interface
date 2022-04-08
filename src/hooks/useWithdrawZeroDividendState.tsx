import { useContext, useState } from "react";

import { abi } from "@levxdao/zero-money/artifacts/contracts/ZeroMoney.sol/ZeroMoney.json";
import { address, receipt } from "@levxdao/zero-money/deployments/mainnet/ZeroMoney.json";
import { ZeroMoney } from "@levxdao/zero-money/typechain/ZeroMoney";
import { BigNumber, Contract, providers, utils } from "ethers";
import useAsyncEffect from "use-async-effect";
import { EthersContext } from "../context/EthersContext";

export interface WithdrawZeroDividendState {
    loading: boolean;
    error?: string;
    amount?: string;
    onWithdraw: () => void;
    withdrawing: boolean;
}

// tslint:disable-next-line:max-func-body-length
const useWithdrawZeroDividendState: () => WithdrawZeroDividendState = () => {
    const { signer } = useContext(EthersContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [amount, setAmount] = useState<string>();
    const [withdrawing, setWithdrawing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(0);

    // tslint:disable-next-line:max-func-body-length
    useAsyncEffect(async () => {
        if (signer) {
            setAmount("");
            setError("");
            setLoading(true);
            try {
                const contract = getContract(signer);
                const dividend = await contract.withdrawableDividendOf(await signer.getAddress());
                setAmount(utils.formatEther(dividend));
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
    }, [signer, lastUpdated]);

    const onWithdraw = async () => {
        if (signer) {
            setError("");
            setWithdrawing(true);
            try {
                const contract = getContract(signer);
                const tx = await contract.withdrawDividend();
                await tx.wait();
                setLastUpdated(Date.now());
            } catch (e) {
                setError(e.message);
            } finally {
                setWithdrawing(false);
            }
        }
    };

    return {
        loading,
        error,
        amount,
        onWithdraw,
        withdrawing
    };
};

const getContract = (signer: providers.JsonRpcSigner) => {
    return (new Contract(address, abi, signer) as unknown) as ZeroMoney;
};

export default useWithdrawZeroDividendState;
