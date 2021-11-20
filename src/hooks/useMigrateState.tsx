import { useCallback, useContext, useEffect, useState } from "react";

import { ethers } from "ethers";
import useAsyncEffect from "use-async-effect";
import { SWAPPER } from "../constants/contracts";
import { EthersContext } from "../context/EthersContext";
import { parseBalance } from "../utils";
import useSwapper from "./useSwapper";
import useTokenPairState, { TokenPairState } from "./useTokenPairState";

export interface MigrateState extends TokenPairState {
    onMigrate: () => Promise<void>;
    migrating: boolean;
}

// tslint:disable-next-line:max-func-body-length
const useMigrateState: () => MigrateState = () => {
    const state = useTokenPairState();
    const { provider, signer, getTokenAllowance, updateTokens } = useContext(EthersContext);
    const { swap } = useSwapper();
    const [loading, setLoading] = useState(false);
    const [migrating, setMigrating] = useState(false);

    useEffect(() => {
        state.setFromSymbol("OH-GEEZ");
    }, []);

    useAsyncEffect(async () => {
        if (provider && signer && state.fromToken) {
            setLoading(true);
            state.setFromTokenAllowed(false);
            try {
                const minAllowance = ethers.BigNumber.from(2)
                    .pow(96)
                    .sub(1);
                const allowance = await getTokenAllowance(state.fromToken.address, SWAPPER);
                state.setFromTokenAllowed(ethers.BigNumber.from(allowance).gte(minAllowance));
            } finally {
                setLoading(false);
            }
        }
    }, [provider, signer, state.fromToken]);

    const onMigrate = useCallback(async () => {
        if (swap && state.fromToken && state.fromAmount && provider && signer) {
            setMigrating(true);
            try {
                const amount = parseBalance(state.fromAmount, state.fromToken.decimals);
                const tx = await swap(amount, signer);
                await tx.wait();
                await updateTokens();
            } finally {
                setMigrating(false);
            }
        }
    }, [swap, state.fromToken, state.fromAmount, provider, signer, updateTokens]);

    return {
        ...state,
        loading: state.loading || loading,
        onMigrate,
        migrating
    };
};

export default useMigrateState;
