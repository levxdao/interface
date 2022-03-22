import { useAuth0 } from "@auth0/auth0-react";
import useAsyncEffect from "use-async-effect";

export interface LevxDistributionState {
    onLogin: (method: LoginMethod) => void;
}

export type LoginMethod = "twitter" | "discord";

// tslint:disable-next-line:max-func-body-length
const useLevxDistributionState: () => LevxDistributionState = () => {
    const { user, isAuthenticated, loginWithRedirect, getAccessTokenSilently, handleRedirectCallback } = useAuth0();

    useAsyncEffect(async () => {
        if (isAuthenticated) {
            // TODO
            try {
                const accessToken = await getAccessTokenSilently({ scope: "openid profile email" });
                console.log(accessToken);
                const resp = await fetch(`http://localhost:3001/auth?access_token=${accessToken}`);
                console.log(await resp.json());
            } catch (e) {
                console.error(e);
            }
        }
    }, [isAuthenticated]);

    const onLogin = async (method: LoginMethod) => {
        await loginWithRedirect({ connection: method, redirectUri: getRedirectUri() });
    };
    return {
        onLogin
    };
};

const getRedirectUri = () => {
    const { protocol, hostname, port } = window.location;
    return protocol + "//" + hostname + (port === "80" ? "" : ":" + port) + "/#/airdrops/levx";
};

export default useLevxDistributionState;
