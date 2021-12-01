import { useCallback, useContext, useEffect, useState } from "react";

import { Percent } from "@sushiswap/sdk";
import { ethers } from "ethers";
import useAsyncEffect from "use-async-effect";
import { MIGRATOOOOOOR, OH_GEEZ_LP } from "../constants/contracts";
import { EthersContext } from "../context/EthersContext";
import { convertToken, deduct, formatBalance, parseBalance, parseCurrencyAmount } from "../utils";
import useLPTokensState, { LPTokensState } from "./useLPTokensState";
import useMigratoooooor from "./useMigratoooooor";

export type MigrateMode = "permit" | "approve";

export const SLIPPAGE_TOLERANCE = new Percent("5", "1000"); // 0.5%

export interface MigrateLPState extends LPTokensState {
    mode?: MigrateMode;
    setMode: (_mode?: MigrateMode) => void;
    onMigrate: () => Promise<void>;
    migrating: boolean;
}

// tslint:disable-next-line:max-func-body-length
const useMigrateLPState: () => MigrateLPState = () => {
    const { ethereum } = useContext(EthersContext);
    const state = useLPTokensState("my-lp-tokens");
    const { provider, signer, getTokenAllowance, updateTokens } = useContext(EthersContext);
    const { migrate, migrateWithPermit } = useMigratoooooor();
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<MigrateMode>();
    const [migrating, setMigrating] = useState(false);

    useEffect(() => {
        if (ethereum?.isWalletConnect) {
            setMode("approve");
        } else {
            setMode(undefined);
        }
    }, [ethereum]);

    useEffect(() => {
        state.setSelectedLPToken(state.lpTokens.find(token => token.address === OH_GEEZ_LP));
    }, [state.lpTokens]);

    useAsyncEffect(async () => {
        if (provider && signer && state.selectedLPToken) {
            setLoading(true);
            state.setSelectedLPTokenAllowed(false);
            try {
                const minAllowance = ethers.BigNumber.from(2)
                    .pow(96)
                    .sub(1);
                const allowance = await getTokenAllowance(state.selectedLPToken.address, MIGRATOOOOOOR);
                state.setSelectedLPTokenAllowed(ethers.BigNumber.from(allowance).gte(minAllowance));
            } finally {
                setLoading(false);
            }
        }
    }, [provider, signer, state.selectedLPToken]);

    // tslint:disable-next-line:max-func-body-length
    useAsyncEffect(async () => {
        if (
            state.selectedLPToken &&
            state.selectedLPToken.totalSupply &&
            state.pair &&
            state.fromToken &&
            state.toToken
        ) {
            if (state.pair.liquidityToken.address === state.selectedLPToken.address) {
                const fromReserve = parseCurrencyAmount(
                    state.pair.reserveOf(convertToken(state.fromToken)),
                    state.fromToken.decimals
                );
                const toReserve = parseCurrencyAmount(
                    state.pair.reserveOf(convertToken(state.toToken)),
                    state.toToken.decimals
                );
                state.setFromAmount(
                    formatBalance(
                        parseBalance(state.amount, state.selectedLPToken.decimals)
                            .mul(fromReserve)
                            .div(state.selectedLPToken.totalSupply)
                            .toString(),
                        state.selectedLPToken.tokenA.decimals
                    )
                );
                state.setToAmount(
                    formatBalance(
                        parseBalance(state.amount, state.selectedLPToken.decimals)
                            .mul(toReserve)
                            .div(state.selectedLPToken.totalSupply)
                            .toString(),
                        state.selectedLPToken.tokenB.decimals
                    )
                );
            }
        }
    }, [state.selectedLPToken, state.amount, state.pair, state.fromToken, state.toToken, signer]);

    const onMigrate = useCallback(async () => {
        if (mode && state.selectedLPToken && state.amount && state.toAmount && provider && signer) {
            setMigrating(true);
            try {
                const amount = parseBalance(state.amount, state.selectedLPToken.decimals);
                const func = mode === "approve" ? migrate : migrateWithPermit;
                const tx = await func(amount, deduct(parseBalance(state.toAmount), SLIPPAGE_TOLERANCE), signer);
                await tx.wait();
                await updateTokens();
                await state.updateLPTokens();
                state.setSelectedLPToken(undefined);
            } finally {
                setMigrating(false);
            }
        }
    }, [mode, state.selectedLPToken, state.amount, state.toAmount, provider, signer, migrateWithPermit, updateTokens]);

    return {
        ...state,
        loading: state.loading || loading,
        mode,
        setMode,
        onMigrate,
        migrating
    };
};

export default useMigrateLPState;
