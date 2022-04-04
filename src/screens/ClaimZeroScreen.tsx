import React, { useContext, useState } from "react";
import { Platform, TouchableHighlight, View } from "react-native";
import TweetEmbed from "react-tweet-embed";

import AmountMeta from "../components/AmountMeta";
import BackgroundImage from "../components/BackgroundImage";
import Button from "../components/Button";
import ChangeNetwork from "../components/ChangeNetwork";
import Container from "../components/Container";
import Content from "../components/Content";
import Heading from "../components/Heading";
import Loading from "../components/Loading";
import Text from "../components/Text";
import Title from "../components/Title";
import WebFooter from "../components/web/WebFooter";
import { ZeroSubMenu } from "../components/web/WebSubMenu";
import { Spacing } from "../constants/dimension";
import { EthersContext } from "../context/EthersContext";
import useClaimZeroState, { ClaimZeroState } from "../hooks/useClaimZeroState";
import useColors from "../hooks/useColors";
import useLinker from "../hooks/useLinker";
import useTranslation from "../hooks/useTranslation";
import Screen from "./Screen";

const ClaimZeroScreen = () => {
    const t = useTranslation();
    return (
        <Screen>
            <Container>
                <BackgroundImage />
                <Content>
                    <Title text={t("claim-zero")} />
                    <Text light={true}>{t("claim-zero-desc")}</Text>
                    <ClaimZero />
                </Content>
                {Platform.OS === "web" && <WebFooter />}
            </Container>
            <ZeroSubMenu />
        </Screen>
    );
};

const ClaimZero = () => {
    const { chainId } = useContext(EthersContext);
    const state = useClaimZeroState();
    if (chainId !== 1) return <ChangeNetwork />;
    return (
        <View style={{ marginTop: Spacing.large }}>
            {state.loading ? <Loading /> : state.user ? <LoginInfo state={state} /> : <SignInButtons state={state} />}
        </View>
    );
};

const LoginInfo = ({ state }: { state: ClaimZeroState }) => {
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
            ) : state.claimEvent ? (
                <Claimed state={state} />
            ) : (
                <ClaimInfo state={state} />
            )}
        </View>
    );
};

const Claimed = ({ state }: { state: ClaimZeroState }) => {
    const t = useTranslation();
    const { primary } = useColors();
    const onPress = useLinker("https://etherscan.io/tx/" + state.claimEvent?.transactionHash, "", "_blank");
    return (
        <View>
            <Text caption={true} style={{ marginBottom: Spacing.small }}>
                {t("you-claimed-zero")}
            </Text>
            <Button type={"outline"} color={primary} title={t("view-tx")} onPress={onPress} />
        </View>
    );
};

const ClaimInfo = ({ state }: { state: ClaimZeroState }) => {
    const t = useTranslation();
    return (
        <View>
            <Text caption={true} light={true}>
                {t("you-can-receive")}
            </Text>
            {state.auth ? <Eligible state={state} /> : <NotEligible state={state} />}
        </View>
    );
};

const Eligible = ({ state }: { state: ClaimZeroState }) => {
    const t = useTranslation();
    const { secondary } = useColors();
    const [tweeted, setTweeted] = useState(false);
    return (
        <View>
            <AmountMeta amount={"1"} suffix={"ZERO"} />
            {tweeted ? (
                <>
                    <Button color={secondary} title={t("claim")} loading={state.claiming} onPress={state.onClaim} />
                </>
            ) : (
                <>
                    <Text light={true} style={{ marginTop: Spacing.small }}>
                        {t("tweet-about-distribution")}
                    </Text>
                    <TweetButton setTweeted={setTweeted} />
                </>
            )}
        </View>
    );
};

const TweetButton = ({ setTweeted }) => {
    const { twitter } = useColors();
    const t = useTranslation();
    const onTweet = () => {
        window.open(
            "https://twitter.com/intent/tweet?text=" +
                encodeURIComponent(t("tweet-zero-money-content")) +
                "&url=" +
                encodeURIComponent("https://twitter.com/thezeromoney/status/1510041941203103746"),
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

const NotEligible = ({ state }: { state: ClaimZeroState }) => {
    const t = useTranslation();
    const { twitter, discord } = useColors();
    const onTwitter = useLinker("https://twitter.com/thezeromoney/status/1510041941203103746", "", "_blank");
    const onDiscord = useLinker("https://discord.gg/oh-geez", "", "_blank");
    return (
        <View>
            <AmountMeta amount={"0"} suffix={"LEVX"} />
            <Text light={true} style={{ marginTop: Spacing.small }}>
                {t("claim-zero-not-eligible")} {state.error}
            </Text>
            <Button
                icon={{ type: "material-community", name: "twitter", color: "white", size: 20 }}
                title={t("follow-like-rt-tweet")}
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

const SignInButtons = ({ state }: { state: ClaimZeroState }) => {
    const t = useTranslation();
    const { twitter } = useColors();
    return (
        <View>
            <Heading text={t("sign-in-with-twitter")} />
            <Button
                title={t("sign-in-with-twitter")}
                color={twitter}
                icon={{ type: "material-community", name: "twitter", color: "white", size: 20 }}
                style={{ marginBottom: Spacing.normal }}
                onPress={() => state.onLogin()}
            />
            <TweetEmbed tweetId="1510041941203103746" />
        </View>
    );
};

export default ClaimZeroScreen;
