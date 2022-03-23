import React, { useContext, useState } from "react";
import { Platform, View } from "react-native";

import { utils } from "ethers";
import AmountMeta from "../components/AmountMeta";
import BackgroundImage from "../components/BackgroundImage";
import Button from "../components/Button";
import ChangeNetwork from "../components/ChangeNetwork";
import Container from "../components/Container";
import Content from "../components/Content";
import Heading from "../components/Heading";
import Loading from "../components/Loading";
import Notice from "../components/Notice";
import Text from "../components/Text";
import Title from "../components/Title";
import WebFooter from "../components/web/WebFooter";
import { AirdropsSubMenu } from "../components/web/WebSubMenu";
import { Spacing } from "../constants/dimension";
import { EthersContext } from "../context/EthersContext";
import useColors from "../hooks/useColors";
import useLevxDistributionState, { LevxDistributionState } from "../hooks/useLevxDistributionState";
import useLinker from "../hooks/useLinker";
import useTranslation from "../hooks/useTranslation";
import Screen from "./Screen";

const LevxDistributionScreen = () => {
    const t = useTranslation();
    return (
        <Screen>
            <Container>
                <BackgroundImage />
                <Content>
                    <Title text={t("levx-distribution")} />
                    <Text light={true}>{t("levx-distribution-desc")}</Text>
                    <LevxDistribution />
                </Content>
                {Platform.OS === "web" && <WebFooter />}
            </Container>
            <AirdropsSubMenu />
        </Screen>
    );
};

const LevxDistribution = () => {
    const { chainId } = useContext(EthersContext);
    const state = useLevxDistributionState();
    if (chainId !== 1) return <ChangeNetwork />;
    return (
        <View style={{ marginTop: Spacing.large }}>
            {state.loading ? <Loading /> : state.user ? <LoginInfo state={state} /> : <SignInButtons state={state} />}
        </View>
    );
};

const LoginInfo = ({ state }: { state: LevxDistributionState }) => {
    const t = useTranslation();
    return (
        <View>
            <Heading
                text={t("welcome-", { name: state.user!.name })}
                buttonText={t("sign-out")}
                onPressButton={state.onLogout}
            />
            {state.authenticating ? (
                <Loading />
            ) : state.pendingAmount ? (
                <Claim state={state} />
            ) : (
                <DistributionInfo state={state} />
            )}
        </View>
    );
};

const Claim = ({ state }: { state: LevxDistributionState }) => {
    const t = useTranslation();
    const { secondary } = useColors();
    return (
        <View>
            <Text caption={true} light={true}>
                {t("pending-amount")}
            </Text>
            <AmountMeta amount={utils.formatEther(state.pendingAmount!)} suffix={"LEVX"} />
            <Text light={true} style={{ marginTop: Spacing.small }}>
                {t("claim-streaming-desc", {
                    full: state.auth!.amount,
                    claimed: utils.formatEther(state.claimedAmount || "0")
                })}
            </Text>
            <Button
                type={"outline"}
                color={secondary}
                title={t("claim-streaming")}
                loading={state.claiming}
                onPress={state.onClaim}
                style={{ marginTop: Spacing.normal }}
            />
        </View>
    );
};

const DistributionInfo = ({ state }: { state: LevxDistributionState }) => {
    const t = useTranslation();
    return (
        <View>
            <Text caption={true} light={true}>
                {t("you-can-receive")}
            </Text>
            {state.auth ? <Eligible state={state} /> : <NotEligible />}
        </View>
    );
};

const Eligible = ({ state }: { state: LevxDistributionState }) => {
    const auth = state.auth!;
    const t = useTranslation();
    const { secondary } = useColors();
    const [tweeted, setTweeted] = useState(false);
    return (
        <View>
            <AmountMeta amount={auth.amount} suffix={"LEVX"} />
            {tweeted ? (
                <>
                    <Button
                        color={secondary}
                        title={t("start-streaming")}
                        loading={state.starting}
                        onPress={state.onStart}
                    />
                    <Notice color={"orange"} text={t("start-streaming-warning")} style={{ marginTop: Spacing.small }} />
                </>
            ) : (
                <>
                    <Text light={true} style={{ marginTop: Spacing.small }}>
                        {t("tweet-about-distribution")}
                    </Text>
                    <TweetButton amount={auth.amount} setTweeted={setTweeted} />
                </>
            )}
        </View>
    );
};

const TweetButton = ({ amount, setTweeted }) => {
    const { twitter } = useColors();
    const t = useTranslation();
    const onTweet = () => {
        window.open(
            "https://twitter.com/intent/tweet?text=" +
                encodeURIComponent(t("tweet-content", { amount })) +
                "&url=" +
                encodeURIComponent("https://twitter.com/LevXDAOhGeez/status/1506401475513053187"),
            "_blank"
        );
        setTweeted(true);
    };
    return (
        <Button
            icon={{ type: "material-community", name: "twitter", color: "white", size: 20 }}
            title={t("tweet")}
            color={twitter}
            onPress={onTweet}
            style={{ marginTop: Spacing.small }}
        />
    );
};

const NotEligible = () => {
    const t = useTranslation();
    const { twitter, discord } = useColors();
    const onTwitter = useLinker("https://twitter.com/LevxApp/status/1505646396912795653", "", "_blank");
    const onDiscord = useLinker(
        "https://discord.com/channels/740031904757317742/896610753212219432/955114282754899988",
        "",
        "_blank"
    );
    return (
        <View>
            <AmountMeta amount={"0"} suffix={"LEVX"} />
            <Text light={true} style={{ marginTop: Spacing.small }}>
                {t("unfortunately-not-eligible")}
            </Text>
            <Button
                icon={{ type: "material-community", name: "twitter", color: "white", size: 20 }}
                title={t("check-tweet")}
                color={twitter}
                onPress={onTwitter}
                style={{ marginTop: Spacing.small }}
            />
            <Button
                icon={{ type: "material-community", name: "discord", color: "white", size: 20 }}
                title={t("go-to-discord")}
                color={discord}
                onPress={onDiscord}
                style={{ marginTop: Spacing.small }}
            />
        </View>
    );
};

const SignInButtons = ({ state }: { state: LevxDistributionState }) => {
    const t = useTranslation();
    const { twitter, discord } = useColors();
    return (
        <View style={{ marginVertical: Spacing.normal }}>
            <Heading text={t("sign-in-with-twitter-or-discord")} />
            <Button
                title={t("sign-in-with-twitter")}
                color={twitter}
                icon={{ type: "material-community", name: "twitter", color: "white", size: 20 }}
                style={{ marginBottom: Spacing.small }}
                onPress={() => state.onLogin("twitter")}
            />
            <Button
                title={t("sign-in-with-discord")}
                color={discord}
                icon={{ type: "material-community", name: "discord", color: "white", size: 20 }}
                onPress={() => state.onLogin("discord")}
            />
        </View>
    );
};

export default LevxDistributionScreen;
