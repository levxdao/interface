import React, { useContext, useState } from "react";
import { Platform, View } from "react-native";

import AirdropSelect from "../components/AirdropSelect";
import BackgroundImage from "../components/BackgroundImage";
import Border from "../components/Border";
import Button from "../components/Button";
import ChangeNetwork from "../components/ChangeNetwork";
import Container from "../components/Container";
import Content from "../components/Content";
import ErrorMessage from "../components/ErrorMessage";
import FetchingButton from "../components/FetchingButton";
import InfoBox from "../components/InfoBox";
import Meta from "../components/Meta";
import Text from "../components/Text";
import Title from "../components/Title";
import WebFooter from "../components/web/WebFooter";
import { AirdropsSubMenu } from "../components/web/WebSubMenu";
import airdrops from "../constants/airdrops";
import { LEVX_TOKEN } from "../constants/contracts";
import { Spacing } from "../constants/dimension";
import { ETH, LEVX } from "../constants/tokens";
import { EthersContext } from "../context/EthersContext";
import useAirdropsState, { AirdropsState } from "../hooks/useAirdropsState";
import useLinker from "../hooks/useLinker";
import useTranslation from "../hooks/useTranslation";
import MetamaskError from "../types/MetamaskError";
import { formatBalance, parseBalance } from "../utils";
import Screen from "./Screen";

const AirdropsScreen = () => {
    const t = useTranslation();
    return (
        <Screen>
            <Container>
                <BackgroundImage />
                <Content>
                    <Title text={t("airdrops")} />
                    <Text light={true}>{t("airdrops-desc")}</Text>
                    <Airdrops />
                </Content>
                {Platform.OS === "web" && <WebFooter />}
            </Container>
            <AirdropsSubMenu />
        </Screen>
    );
};

const Airdrops = () => {
    const { chainId } = useContext(EthersContext);
    const state = useAirdropsState();
    if (chainId !== 1) return <ChangeNetwork />;
    return (
        <View style={{ marginTop: Spacing.large }}>
            <AirdropSelect state={state} />
            <Border />
            <AmountInfo state={state} />
        </View>
    );
};

const AmountInfo = ({ state }: { state: AirdropsState }) => {
    const t = useTranslation();
    const disabled = !state.selectedAirdrop || !state.amount;
    const snapshot = state.selectedAirdrop?.snapshot;
    return (
        <InfoBox>
            <Meta
                label={t("claimable-", { symbol: state.token?.symbol || "LEVX" })}
                text={state.amount || ""}
                disabled={disabled}
            />
            {snapshot && (
                <Meta label={t("block")} text={String(snapshot)} url={"https://etherscan.io/block/" + snapshot} />
            )}
            <Controls state={state} />
        </InfoBox>
    );
};

const Controls = ({ state }: { state: AirdropsState }) => {
    const [error, setError] = useState<MetamaskError>({});
    return (
        <View style={{ marginTop: Spacing.normal }}>
            {!state.selectedAirdrop ? (
                <ClaimButton state={state} onError={setError} disabled={true} />
            ) : state.loading ? (
                <FetchingButton />
            ) : state.claimEvent ? (
                <ClaimedButton />
            ) : state.claiming ? (
                <ClaimingButton />
            ) : !state.amount || parseBalance(state.amount).isZero() ? (
                <NotEligibleButton />
            ) : state.selectedAirdrop.token === ETH.address ? (
                <>
                    <ClaimButton state={state} onError={setError} outline={true} />
                    <View style={{ height: Spacing.tiny }} />
                    <ClaimAsLevxButton state={state} onError={setError} />
                </>
            ) : (
                <ClaimButton state={state} onError={setError} />
            )}
            {error.message && error.code !== 4001 && <ErrorMessage error={error} />}
        </View>
    );
};
const NotEligibleButton = ({}: {}) => {
    const t = useTranslation();
    return <Button title={t("not-eligible")} disabled={true} />;
};

const ClaimingButton = () => {
    const t = useTranslation();
    return <Button title={t("claiming")} disabled={true} />;
};

const ShareAirdropToTwitterButton = ({ state }: { state: AirdropsState }) => {
    const t = useTranslation();
    const tweet =
        state.selectedAirdrop && state.token
            ? "The dictator of @LevXDAOhGeez is airdropping " +
              formatBalance(state.selectedAirdrop.amount, 18, 8) +
              " $" +
              state.token.symbol +
              " (=" +
              ((state.token.priceUSD || 0) * Number(formatBalance(state.selectedAirdrop.amount, 18, 2))).toFixed(4) +
              " USD) for poor Mortys in the DAO. If you want to get notified of the upcoming airdrops, visit the discord.\n👇https://discord.gg/oh-geez"
            : "";
    const onPress = useLinker("https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweet), "", "_blank");
    return (
        <Button
            icon={{
                type: "material-community",
                name: "twitter",
                color: "white",
                size: 20
            }}
            iconRight={true}
            title={t("share-airdrop-to-twitter")}
            color={"#1DA1F2"}
            onPress={onPress}
        />
    );
};

const ClaimButton = ({
    state,
    onError,
    outline,
    disabled
}: {
    state: AirdropsState;
    onError: (e) => void;
    outline?: boolean;
    disabled?: boolean;
}) => {
    const t = useTranslation();
    const onPress = async () => {
        onError({});
        try {
            if (state.selectedAirdrop?.token === ETH.address) {
                await state.onClaimETH();
            } else if (state.selectedAirdrop?.token === LEVX.address) {
                await state.onClaimLevx();
            } else {
                await state.onClaimERC20();
            }
        } catch (e) {
            onError(e);
        }
    };
    return (
        <Button
            title={t("claim")}
            loading={state.claiming}
            onPress={onPress}
            disabled={disabled}
            type={outline ? "outline" : undefined}
        />
    );
};

const ClaimAsLevxButton = ({
    state,
    onError,
    disabled
}: {
    state: AirdropsState;
    onError: (e) => void;
    disabled?: boolean;
}) => {
    const t = useTranslation();
    const onPress = async () => {
        onError({});
        try {
            await state.onClaimAsLevx();
        } catch (e) {
            onError(e);
        }
    };
    return <Button title={t("claim-as-levx")} loading={state.claiming} onPress={onPress} disabled={disabled} />;
};

const ClaimedButton = () => {
    const t = useTranslation();
    return <Button title={t("already-claimed")} disabled={true} />;
};

export default AirdropsScreen;
