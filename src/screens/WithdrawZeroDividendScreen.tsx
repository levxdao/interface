import React, { useContext } from "react";
import { Platform, View } from "react-native";

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
import { ZeroSubMenu } from "../components/web/WebSubMenu";
import { Spacing } from "../constants/dimension";
import { EthersContext } from "../context/EthersContext";
import useColors from "../hooks/useColors";
import useTranslation from "../hooks/useTranslation";
import useWithdrawZeroDividendState from "../hooks/useWithdrawZeroDividendState";
import Screen from "./Screen";

const WithdrawZeroDividendScreen = () => {
    const t = useTranslation();
    return (
        <Screen>
            <Container>
                <BackgroundImage />
                <Content>
                    <Title text={t("withdraw-zero-dividend")} />
                    <Text light={true}>{t("withdraw-zero-dividend-desc")}</Text>
                    <WithdrawZeroDividend />
                </Content>
                {Platform.OS === "web" && <WebFooter />}
            </Container>
            <ZeroSubMenu />
        </Screen>
    );
};

const WithdrawZeroDividend = () => {
    const { chainId } = useContext(EthersContext);
    const state = useWithdrawZeroDividendState();
    if (chainId !== 1) return <ChangeNetwork />;
    const t = useTranslation();
    const { secondary } = useColors();
    const disabled = state.amount === "0.0";
    return (
        <View style={{ marginTop: Spacing.large }}>
            <Text caption={true} light={true}>
                {t("you-can-receive")}
            </Text>
            {state.loading || !state.amount ? (
                <Loading />
            ) : (
                <>
                    <AmountMeta amount={state.amount} suffix={"ZERO"} />
                    <Button
                        color={secondary}
                        title={t("withdraw")}
                        disabled={disabled}
                        loading={state.withdrawing}
                        onPress={state.onWithdraw}
                    />
                </>
            )}
        </View>
    );
};

export default WithdrawZeroDividendScreen;
