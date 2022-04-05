import { useContext, useState } from "react";

import { useAuth0, User } from "@auth0/auth0-react";
import { abi } from "@levxdao/zero-money/artifacts/contracts/ZeroMoney.sol/ZeroMoney.json";
import { address, receipt } from "@levxdao/zero-money/deployments/mainnet/ZeroMoney.json";
import { ZeroMoney } from "@levxdao/zero-money/typechain/ZeroMoney";
import { Contract, Event, providers } from "ethers";
import useAsyncEffect from "use-async-effect";
import { API_SERVER } from "../constants";
import { EthersContext } from "../context/EthersContext";

export interface ClaimZeroState {
    loading: boolean;
    authenticating: boolean;
    user?: User;
    auth?: Auth;
    error?: string;
    claimEvent?: Event;
    onLogin: () => void;
    onLogout: () => void;
    onClaim: () => void;
    claiming: boolean;
}

export interface Auth {
    user: Record<string, any>;
    id: string;
    address: string;
    signature: Signature;
}

export interface Signature {
    v: number;
    r: string;
    s: string;
}

// tslint:disable-next-line:max-func-body-length
const useClaimZeroState: () => ClaimZeroState = () => {
    const { isLoading, user, isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
    const { signer } = useContext(EthersContext);
    const [authenticating, setAuthenticating] = useState(false);
    const [auth, setAuth] = useState<Auth>();
    const [error, setError] = useState("");
    const [claimEvent, setClaimEvent] = useState<Event>();
    const [claiming, setClaiming] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(0);

    // tslint:disable-next-line:max-func-body-length
    useAsyncEffect(async () => {
        if (isAuthenticated && signer) {
            if (window.location.search) {
                window.history.replaceState({}, "", getRedirectUri());
            }
            setAuth(undefined);
            setAuthenticating(true);
            setError("");
            setClaimEvent(undefined);
            try {
                const accessToken = await getAccessTokenSilently({ scope: "openid profile email" });
                const account = await signer.getAddress();
                const resp = await fetch(API_SERVER + `/zero/auth?access_token=${accessToken}&address=${account}`);
                if (resp.status === 200) {
                    const data = await resp.json();
                    setAuth(data);
                    if (data) {
                        // tslint:disable-next-line:no-console
                        console.log("id: " + data.id);
                        // tslint:disable-next-line:no-console
                        console.log("address: " + data.address);
                        // tslint:disable-next-line:no-console
                        console.log("user: " + JSON.stringify(data.user));
                    }
                    // Load events
                    const contract = getContract(signer);
                    const claim = contract.filters.Claim(data.id);
                    const events = await contract.queryFilter(claim, receipt.blockNumber);
                    if (events.length > 0) {
                        setClaimEvent(events[0]);
                    }
                } else {
                    const data = await resp.json();
                    setError(data.errors?.[0]?.message || "");
                }
            } catch {
                setError("Server error. Try refreshing this page 1-2 times.");
            } finally {
                setAuthenticating(false);
            }
        }
    }, [isAuthenticated, signer, lastUpdated]);

    const onLogin = async () => {
        await loginWithRedirect({ connection: "twitter", redirectUri: getRedirectUri() });
    };

    const onLogout = async () => {
        await logout({ returnTo: getRedirectUri() });
    };

    const onClaim = async () => {
        if (signer && auth) {
            try {
                setClaiming(true);
                const contract = getContract(signer);
                const tx = await contract.claim(auth.id, auth.signature.v, auth.signature.r, auth.signature.s);
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
        auth,
        error,
        claimEvent,
        onLogin,
        onLogout,
        onClaim,
        claiming
    };
};

const getRedirectUri = () => {
    const { protocol, hostname, port } = window.location;
    return protocol + "//" + hostname + (port === "80" ? "" : ":" + port) + "/#/zero/claim";
};

const getContract = (signer: providers.JsonRpcSigner) => {
    return (new Contract(address, abi, signer) as unknown) as ZeroMoney;
};

export default useClaimZeroState;
