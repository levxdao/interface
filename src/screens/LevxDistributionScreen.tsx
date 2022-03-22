import React, { useContext } from "react";
import { Platform, View } from "react-native";

import BackgroundImage from "../components/BackgroundImage";
import Button from "../components/Button";
import ChangeNetwork from "../components/ChangeNetwork";
import Container from "../components/Container";
import Content from "../components/Content";
import Text from "../components/Text";
import Title from "../components/Title";
import WebFooter from "../components/web/WebFooter";
import { AirdropsSubMenu } from "../components/web/WebSubMenu";
import { Spacing } from "../constants/dimension";
import { EthersContext } from "../context/EthersContext";
import useColors from "../hooks/useColors";
import useLevxDistributionState, { LevxDistributionState } from "../hooks/useLevxDistributionState";
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
            <SignInButtons state={state} />
        </View>
    );
};

const SignInButtons = ({ state }: { state: LevxDistributionState }) => {
    const t = useTranslation();
    const { twitter, discord } = useColors();
    return (
        <View style={{ marginVertical: Spacing.normal }}>
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
