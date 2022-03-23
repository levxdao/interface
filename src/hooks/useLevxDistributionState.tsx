import { useContext, useState } from "react";

import { useAuth0, User } from "@auth0/auth0-react";
import { abi } from "@levxdao/airdrop/artifacts/contracts/LevxStreaming.sol/LevxStreaming.json";
import { address, receipt } from "@levxdao/airdrop/deployments/mainnet/LevxStreaming.json";
import { LevxStreaming } from "@levxdao/airdrop/typechain/LevxStreaming";
import { BigNumber, constants, Contract, providers, utils } from "ethers";
import useAsyncEffect from "use-async-effect";
import { API_SERVER } from "../constants";
import { EthersContext } from "../context/EthersContext";

export interface LevxDistributionState {
    loading: boolean;
    authenticating: boolean;
    user?: User;
    loginMethod?: LoginMethod;
    auth?: Auth;
    pendingAmount?: BigNumber;
    claimedAmount?: BigNumber;
    onLogin: (method: LoginMethod) => void;
    onLogout: () => void;
    onStart: () => void;
    starting: boolean;
    onClaim: () => void;
    claiming: boolean;
}

export interface Auth {
    id: string;
    amount: string;
    signature: Signature;
}

export interface Signature {
    v: number;
    r: string;
    s: string;
}

export type LoginMethod = "twitter" | "discord";

// tslint:disable-next-line:max-func-body-length
const useLevxDistributionState: () => LevxDistributionState = () => {
    const { isLoading, user, isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
    const { signer } = useContext(EthersContext);
    const [authenticating, setAuthenticating] = useState(false);
    const [auth, setAuth] = useState<Auth>();
    const [pendingAmount, setPendingAmount] = useState<BigNumber>();
    const [claimedAmount, setClaimedAmount] = useState<BigNumber>();
    const [starting, setStarting] = useState(false);
    const [claiming, setClaiming] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(0);

    useAsyncEffect(async () => {
        if (isAuthenticated && signer) {
            if (window.location.search) {
                window.history.replaceState({}, "", getRedirectUri());
            }
            setAuth(undefined);
            setPendingAmount(undefined);
            setAuthenticating(true);
            try {
                const accessToken = await getAccessTokenSilently({ scope: "openid profile email" });
                const resp = await fetch(API_SERVER + `/auth?access_token=${accessToken}`);
                if (resp.status === 200) {
                    const data = await resp.json();
                    setAuth(data);
                    // Load events
                    const contract = getContract(signer);
                    const start = contract.filters.Start(data.id);
                    const events = await contract.queryFilter(start, receipt.blockNumber);
                    // TODO
                    if (events.length > 0) {
                        setPendingAmount(await contract.pendingAmount(data.id, 0));
                        const claim = contract.filters.Claim(data.id);
                        setClaimedAmount(
                            (await contract.queryFilter(claim, receipt.blockNumber))
                                .map(event => event.args.amount)
                                .reduce((prev, current) => prev.add(current), BigNumber.from("0"))
                        );
                    }
                    // setPendingAmount(utils.parseEther("0.1"));
                    // setClaimedAmount(utils.parseEther("0.3"));
                }
            } finally {
                setAuthenticating(false);
            }
        }
    }, [isAuthenticated, signer, lastUpdated]);

    const onLogin = async (method: LoginMethod) => {
        await loginWithRedirect({ connection: method, redirectUri: getRedirectUri() });
    };

    const onLogout = async () => {
        await logout({ returnTo: getRedirectUri() });
    };

    const onStart = async () => {
        if (signer && auth) {
            try {
                setStarting(true);
                const contract = getContract(signer);
                const { v, r, s } = auth.signature;
                const tx = await contract.start(auth.id, utils.parseEther(auth.amount), v, r, s);
                await tx.wait();
                setLastUpdated(Date.now());
            } finally {
                setStarting(false);
            }
        }
    };

    const onClaim = async () => {
        if (signer && auth) {
            try {
                setClaiming(true);
                const contract = getContract(signer);
                const tx = await contract.claim(auth.id, 0, constants.AddressZero, "0x");
                await tx.wait();
                setLastUpdated(Date.now());
            } finally {
                setClaiming(false);
            }
        }
    };

    return {
        loading: isLoading,
        authenticating,
        user,
        loginMethod: getLoginMethod(user),
        auth,
        pendingAmount,
        claimedAmount,
        onLogin,
        onLogout,
        onStart,
        starting,
        onClaim,
        claiming
    };
};

const getRedirectUri = () => {
    const { protocol, hostname, port } = window.location;
    return protocol + "//" + hostname + (port === "80" ? "" : ":" + port) + "/#/airdrops/levx";
};

const getLoginMethod = (user?: User): LoginMethod | undefined => {
    const split = user?.sub?.split("|");
    if (split) {
        const provider = split[0];
        if (provider === "twitter") return "twitter";
        else if (provider === "oauth2") return split[1].split("|")[0] as LoginMethod;
    }
};

const getContract = (signer: providers.JsonRpcSigner) => {
    return (new Contract(address, abi, signer) as unknown) as LevxStreaming;
};

export default useLevxDistributionState;
