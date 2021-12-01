import { useContext, useEffect, useState } from "react";

import { receipt as ethAirdropReceipt } from "@levxdao/airdrop/deployments/mainnet/ETHAirdrop.json";
import { getMerkleProof, getMerkleRoot } from "@levxdao/merkle-tree-generator";
import { Fetcher } from "@sushiswap/sdk";
import { Event } from "ethers";
import { ALLOWED_SLIPPAGE, TTL } from "../constants";
import { ETH, LEVX } from "../constants/tokens";
import { EthersContext } from "../context/EthersContext";
import Airdrop from "../types/Airdrop";
import TokenWithValue from "../types/TokenWithValue";
import { convertAmount, convertToken, deduct, parseBalance } from "../utils";
import { getETHAirdropContract, getLevxAirdropContract } from "../utils/getAirdropContract";

export interface AirdropsState {
    selectedAirdrop?: Airdrop;
    setSelectedAirdrop: (airdrop?: Airdrop) => void;
    token?: TokenWithValue;
    amount?: string;
    loading: boolean;
    claimEvent?: Event;
    onClaimLevx: () => Promise<void>;
    onClaimETH: () => Promise<void>;
    onClaimAsLevx: () => Promise<void>;
    claiming: boolean;
}

// tslint:disable-next-line:max-func-body-length
const useAirdropsState: () => AirdropsState = () => {
    const { provider, signer, address, tokens, updateTokens } = useContext(EthersContext);
    const [selectedAirdrop, setSelectedAirdrop] = useState<Airdrop>();
    const [loading, setLoading] = useState(false);
    const [claimEvent, setClaimEvent] = useState<Event>();
    const [claiming, setClaiming] = useState(false);

    useEffect(() => {
        (async () => {
            if (selectedAirdrop && provider) {
                setLoading(true);
                try {
                    let contract;
                    if (selectedAirdrop.token === ETH.address) {
                        contract = getETHAirdropContract(provider);
                    } else {
                        contract = getLevxAirdropContract(provider);
                    }
                    const filter = contract.filters.Claim(selectedAirdrop.merkleRoot, address);
                    const events = await contract.queryFilter(filter, ethAirdropReceipt.blockNumber);
                    if (events.length > 0) {
                        setClaimEvent(events[0]);
                    }
                } finally {
                    setLoading(false);
                }
            }
        })();
    }, [selectedAirdrop, provider]);

    const onClaimLevx = async () => {
        const entry = selectedAirdrop?.entries.find(e => e[0].toLowerCase() === address?.toLowerCase());
        if (selectedAirdrop && signer && entry && amount && address) {
            setClaiming(true);
            try {
                const root = getMerkleRoot(selectedAirdrop.entries);
                const proof = getMerkleProof(selectedAirdrop.entries, entry);
                const contract = getLevxAirdropContract(signer);
                const tx = await contract.claim(root, proof, parseBalance(amount));
                await tx.wait();
            } finally {
                setClaiming(false);
                await updateTokens();
            }
        }
    };

    const onClaimETH = async () => {
        const entry = selectedAirdrop?.entries.find(e => e[0].toLowerCase() === address?.toLowerCase());
        if (selectedAirdrop && signer && entry && amount && address) {
            setClaiming(true);
            try {
                const root = getMerkleRoot(selectedAirdrop.entries);
                const proof = getMerkleProof(selectedAirdrop.entries, entry);
                const contract = getETHAirdropContract(signer);
                const tx = await contract.claim(root, proof, parseBalance(amount), address);
                await tx.wait();
            } finally {
                setClaiming(false);
                await updateTokens();
            }
        }
    };

    const onClaimAsLevx = async () => {
        const entry = selectedAirdrop?.entries.find(e => e[0].toLowerCase() === address?.toLowerCase());
        if (selectedAirdrop && signer && entry && amount && address) {
            setClaiming(true);
            try {
                const root = getMerkleRoot(selectedAirdrop.entries);
                const proof = getMerkleProof(selectedAirdrop.entries, entry);
                const pair = await Fetcher.fetchPairData(convertToken(ETH), convertToken(LEVX), provider);
                const [amountOut] = pair.getOutputAmount(convertAmount(ETH, amount));
                const amountOutMin = deduct(parseBalance(amountOut.toExact()), ALLOWED_SLIPPAGE);
                const deadline = Math.floor(new Date().getTime() / 1000) + TTL;
                const contract = getETHAirdropContract(signer);
                const tx = await contract.claimAndSwapToLevx(
                    root,
                    proof,
                    parseBalance(amount),
                    amountOutMin,
                    address,
                    deadline
                );
                await tx.wait();
            } finally {
                setClaiming(false);
                await updateTokens();
            }
        }
    };

    const token = tokens.find(tk => tk.address === selectedAirdrop?.token);
    const amount = selectedAirdrop?.entries.find(e => e[0].toLowerCase() === address?.toLowerCase())?.[1];

    return {
        selectedAirdrop,
        setSelectedAirdrop,
        token,
        amount,
        loading,
        claimEvent,
        onClaimLevx,
        onClaimETH,
        onClaimAsLevx,
        claiming
    };
};

export default useAirdropsState;
