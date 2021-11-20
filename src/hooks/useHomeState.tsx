import { useContext, useEffect, useState } from "react";

import sushiData from "@sushiswap/sushi-data";
import useAsyncEffect from "use-async-effect";
import Fraction from "../constants/Fraction";
import { EthersContext } from "../context/EthersContext";
import LPTokenWithValue from "../types/LPTokenWithValue";
import { isWETH } from "../utils";
import { fetchLPTokenWithValue, fetchMyLPTokens } from "../utils/fetch-utils";
import useSDK from "./useSDK";

export interface HomeState {
    loadingLPTokens: boolean;
    lpTokens?: LPTokenWithValue[];
}

// tslint:disable-next-line:max-func-body-length
const useHomeState = () => {
    const { provider, signer, address, tokens } = useContext(EthersContext);
    const [lpTokens, setLPTokens] = useState<LPTokenWithValue[]>();
    const [loadingLPTokens, setLoadingLPTokens] = useState(true);
    const { getPair } = useSDK();

    useEffect(() => {
        setLPTokens(undefined);
        setLoadingLPTokens(true);
    }, [address]);

    // Load Liquidity
    useAsyncEffect(async () => {
        const weth = tokens.find(t => isWETH(t));
        if (provider && signer && weth && tokens && tokens.length > 0) {
            setLoadingLPTokens(true);
            const wethPriceUSD = Fraction.parse(String(await sushiData.weth.price()));
            const fetched = await fetchMyLPTokens(await signer.getAddress(), tokens, provider);
            try {
                setLPTokens(
                    await Promise.all(
                        fetched.map(lpToken => fetchLPTokenWithValue(lpToken, weth, wethPriceUSD, getPair, provider))
                    )
                );
            } finally {
                setLoadingLPTokens(false);
            }
        }
    }, [getPair, provider, signer, tokens]);

    return {
        loadingLPTokens,
        tokens,
        lpTokens
    };
};

export default useHomeState;
