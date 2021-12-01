import { useCallback } from "react";

import { Router, Trade } from "@sushiswap/sdk";
import { ethers } from "ethers";
import { ALLOWED_SLIPPAGE, TTL } from "../constants";
import { ROUTER } from "../constants/contracts";
import Token from "../types/Token";
import { deduct, getContract } from "../utils";
import { logTransaction } from "../utils/analytics-utils";

// tslint:disable-next-line:max-func-body-length
const useSwapRouter = () => {
    const swap = useCallback(async (trade: Trade, signer: ethers.Signer) => {
        if (trade) {
            const params = Router.swapCallParameters(trade, {
                feeOnTransfer: false,
                allowedSlippage: ALLOWED_SLIPPAGE,
                recipient: await signer.getAddress(),
                ttl: TTL
            });
            const router = getContract("IUniswapV2Router02", ROUTER, signer);
            const gasLimit = await router.estimateGas[params.methodName](...params.args, {
                value: params.value
            });
            const tx = await router.functions[params.methodName](...params.args, {
                value: params.value,
                gasLimit: gasLimit.mul(120).div(100)
            });
            await logTransaction(
                tx,
                "UniswapV2Router02." + params.methodName + "()",
                ...params.args.map(arg => arg.toString())
            );
            return {
                trade,
                tx
            };
        }
    }, []);

    const addLiquidity = useCallback(
        async (
            fromToken: Token,
            toToken: Token,
            fromAmount: ethers.BigNumber,
            toAmount: ethers.BigNumber,
            signer: ethers.Signer
        ) => {
            const router = getContract("IUniswapV2Router02", ROUTER, signer);
            const deadline = `0x${(Math.floor(new Date().getTime() / 1000) + TTL).toString(16)}`;
            const args = [
                fromToken.address,
                toToken.address,
                fromAmount,
                toAmount,
                deduct(fromAmount, ALLOWED_SLIPPAGE),
                deduct(toAmount, ALLOWED_SLIPPAGE),
                await signer.getAddress(),
                deadline
            ];
            const gasLimit = await router.estimateGas.addLiquidity(...args);
            const tx = await router.functions.addLiquidity(...args, {
                gasLimit: gasLimit.mul(120).div(100)
            });
            return logTransaction(tx, "UniswapV2Router02.addLiquidity()", ...args.map(arg => arg.toString()));
        },
        []
    );

    const removeLiquidityETH = useCallback(
        async (
            token: Token,
            liquidity: ethers.BigNumber,
            amount: ethers.BigNumber,
            amountETH: ethers.BigNumber,
            signer: ethers.Signer
        ) => {
            const router = getContract("IUniswapV2Router02", ROUTER, signer);
            const deadline = `0x${(Math.floor(new Date().getTime() / 1000) + TTL).toString(16)}`;
            const args = [
                token.address,
                liquidity,
                deduct(amount, ALLOWED_SLIPPAGE),
                deduct(amountETH, ALLOWED_SLIPPAGE),
                await signer.getAddress(),
                deadline
            ];
            const gasLimit = await router.estimateGas.removeLiquidityETH(...args);
            const tx = await router.functions.removeLiquidityETH(...args, {
                gasLimit: gasLimit.mul(120).div(100)
            });
            return logTransaction(tx, "UniswapV2Router02.removeLiquidityETH()", ...args.map(arg => arg.toString()));
        },
        []
    );

    const removeLiquidity = useCallback(
        async (
            fromToken: Token,
            toToken: Token,
            liquidity: ethers.BigNumber,
            fromAmount: ethers.BigNumber,
            toAmount: ethers.BigNumber,
            signer: ethers.Signer
        ) => {
            const router = getContract("IUniswapV2Router02", ROUTER, signer);
            const deadline = `0x${(Math.floor(new Date().getTime() / 1000) + TTL).toString(16)}`;
            const args = [
                fromToken.address,
                toToken.address,
                liquidity,
                deduct(fromAmount, ALLOWED_SLIPPAGE),
                deduct(toAmount, ALLOWED_SLIPPAGE),
                await signer.getAddress(),
                deadline
            ];
            const gasLimit = await router.estimateGas.removeLiquidity(...args);
            const tx = await router.functions.removeLiquidity(...args, {
                gasLimit: gasLimit.mul(120).div(100)
            });
            return logTransaction(tx, "UniswapV2Router02.removeLiquidity()", ...args.map(arg => arg.toString()));
        },
        []
    );

    const addLiquidityETH = useCallback(
        async (token: Token, amount: ethers.BigNumber, amountETH: ethers.BigNumber, signer: ethers.Signer) => {
            const router = getContract("IUniswapV2Router02", ROUTER, signer);
            const deadline = `0x${(Math.floor(new Date().getTime() / 1000) + TTL).toString(16)}`;
            const args = [
                token.address,
                amount,
                deduct(amount, ALLOWED_SLIPPAGE),
                deduct(amountETH, ALLOWED_SLIPPAGE),
                await signer.getAddress(),
                deadline
            ];
            const gasLimit = await router.estimateGas.addLiquidityETH(...args, {
                value: amountETH
            });
            const tx = await router.functions.addLiquidityETH(...args, {
                gasLimit: gasLimit.mul(120).div(100),
                value: amountETH
            });
            return logTransaction(tx, "UniswapV2Router02.addLiquidityETH()", ...args.map(arg => arg.toString()));
        },
        []
    );

    const calculateSwapFee = (fromAmount: ethers.BigNumber) => {
        return fromAmount.mul(3).div(1000);
    };

    return {
        swap,
        addLiquidity,
        addLiquidityETH,
        removeLiquidity,
        removeLiquidityETH,
        calculateSwapFee
    };
};

export default useSwapRouter;
