import React, { useContext, useEffect, useState } from "react";
import { Platform, View } from "react-native";

import { utils } from "ethers";
import useAsyncEffect from "use-async-effect";
import AmountMeta from "../components/AmountMeta";
import BackgroundImage from "../components/BackgroundImage";
import Button from "../components/Button";
import ChangeNetwork from "../components/ChangeNetwork";
import Container from "../components/Container";
import Content from "../components/Content";
import Loading from "../components/Loading";
import Text from "../components/Text";
import Title from "../components/Title";
import WebFooter from "../components/web/WebFooter";
import { AirdropsSubMenu } from "../components/web/WebSubMenu";
import { Spacing } from "../constants/dimension";
import { EthersContext } from "../context/EthersContext";
import useColors from "../hooks/useColors";
import useLevxPayoutsState, { LevxPayoutsState } from "../hooks/useLevxPayoutsState";
import useTranslation from "../hooks/useTranslation";
import Screen from "./Screen";

const LevxPayoutsScreen = () => {
    const t = useTranslation();
    return (
        <Screen>
            <Container>
                <BackgroundImage />
                <Content>
                    <Title text={t("levx-payouts")} />
                    <Text light={true}>{t("levx-payouts-desc")}</Text>
                    <LevxPayouts />
                </Content>
                {Platform.OS === "web" && <WebFooter />}
            </Container>
            <AirdropsSubMenu />
        </Screen>
    );
};

const LevxPayouts = () => {
    const { chainId } = useContext(EthersContext);
    const state = useLevxPayoutsState();
    if (chainId !== 1) return <ChangeNetwork />;
    return (
        <View style={{ marginTop: Spacing.large }}>
            {state.loading ? <Loading /> : state.startEvent ? <Claim state={state} /> : <NoPayout state={state} />}
        </View>
    );
};

const Claim = ({ state }: { state: LevxPayoutsState }) => {
    const t = useTranslation();
    const { secondary } = useColors();
    const [endsAt, setEndsAt] = useState<Date>();
    useAsyncEffect(async () => {
        if (state.startEvent) {
            const block = await state.startEvent.getBlock();
            setEndsAt(new Date((block.timestamp + state.startEvent.args!.duration) * 1000));
        }
    }, [state.startEvent]);
    return (
        <View>
            <Text caption={true} light={true}>
                {t("pending-amount")}
            </Text>
            <AmountMeta amount={utils.formatEther(state.pendingAmount!)} suffix={"LEVX"} />
            <Text light={true} style={{ marginTop: Spacing.small }}>
                {t("claim-payout-desc", {
                    full: utils.formatEther(state.startEvent!.args!.amount),
                    claimed: utils.formatEther(state.claimedAmount || "0"),
                    endsAt: endsAt?.toLocaleString() || ""
                })}
            </Text>
            <Button
                type={"outline"}
                color={secondary}
                title={t("claim-payout")}
                loading={state.claiming}
                onPress={state.onClaim}
                style={{ marginTop: Spacing.normal }}
            />
        </View>
    );
};

const NoPayout = ({ state }: { state: LevxPayoutsState }) => {
    const t = useTranslation();
    return <Button disabled={true} title={t("no-payout")} />;
};

export default LevxPayoutsScreen;
