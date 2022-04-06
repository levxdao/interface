import { useContext, useState } from "react";

import { abi } from "@levxdao/airdrop/artifacts/contracts/LevxPayout.sol/LevxPayout.json";
import { address, receipt } from "@levxdao/airdrop/deployments/mainnet/LevxPayout.json";
import { LevxPayout } from "@levxdao/airdrop/typechain/LevxPayout";
import { BigNumber, constants, Contract, providers, Event } from "ethers";
import useAsyncEffect from "use-async-effect";
import { EthersContext } from "../context/EthersContext";

export interface LevxPayoutsState {
    loading: boolean;
    startEvent?: Event;
    pendingAmount?: BigNumber;
    claimedAmount?: BigNumber;
    onClaim: () => void;
    claiming: boolean;
}

// tslint:disable-next-line:max-func-body-length
const useLevxPayoutsState: () => LevxPayoutsState = () => {
    const { signer } = useContext(EthersContext);
    const [loading, setLoading] = useState(true);
    const [startEvent, setStartEvent] = useState<Event>();
    const [pendingAmount, setPendingAmount] = useState<BigNumber>();
    const [claimedAmount, setClaimedAmount] = useState<BigNumber>();
    const [claiming, setClaiming] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(0);

    useAsyncEffect(async () => {
        if (signer) {
            setLoading(true);
            setStartEvent(undefined);
            setPendingAmount(undefined);
            setClaimedAmount(undefined);
            try {
                const contract = getContract(signer);
                const account = await signer.getAddress();
                const start = contract.filters.Start(null, null, account);
                const events = await contract.queryFilter(start, receipt.blockNumber);
                if (events.length > 0) {
                    setStartEvent(events[0]);
                    const { id } = events[0].args;
                    setPendingAmount(await contract.pendingAmount(id));
                    const claim = contract.filters.Claim(id);
                    setClaimedAmount(
                        (await contract.queryFilter(claim, receipt.blockNumber))
                            .map(event => event.args.amount)
                            .reduce((prev, current) => prev.add(current), BigNumber.from("0"))
                    );
                }
            } finally {
                setLoading(false);
            }
        }
    }, [signer, lastUpdated]);

    const onClaim = async () => {
        if (signer && startEvent) {
            try {
                setClaiming(true);
                const contract = getContract(signer);
                const tx = await contract.claim(startEvent.args!.id, constants.AddressZero, "0x");
                await tx.wait();
                setLastUpdated(Date.now());
            } finally {
                setClaiming(false);
            }
        }
    };

    return {
        loading,
        startEvent,
        pendingAmount,
        claimedAmount,
        onClaim,
        claiming
    };
};

const getRedirectUri = () => {
    const { protocol, hostname, port } = window.location;
    return protocol + "//" + hostname + (port === "80" ? "" : ":" + port) + "/#/airdrops/levx";
};

const getContract = (signer: providers.JsonRpcSigner) => {
    return (new Contract(address, abi, signer) as unknown) as LevxPayout;
};

export default useLevxPayoutsState;
