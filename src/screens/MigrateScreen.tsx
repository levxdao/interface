import React, { useContext, useState } from "react";
import { Platform, View } from "react-native";

import useAsyncEffect from "use-async-effect";
import ApproveButton from "../components/ApproveButton";
import BackgroundImage from "../components/BackgroundImage";
import Border from "../components/Border";
import Button from "../components/Button";
import ChangeNetwork from "../components/ChangeNetwork";
import Container from "../components/Container";
import Content from "../components/Content";
import ErrorMessage from "../components/ErrorMessage";
import FetchingButton from "../components/FetchingButton";
import Heading from "../components/Heading";
import InfoBox from "../components/InfoBox";
import InsufficientBalanceButton from "../components/InsufficientBalanceButton";
import Meta from "../components/Meta";
import Text from "../components/Text";
import Title from "../components/Title";
import TokenInput from "../components/TokenInput";
import TokenSelect from "../components/TokenSelect";
import WebFooter from "../components/web/WebFooter";
import { MigrateSubMenu } from "../components/web/WebSubMenu";
import { SWAPPER } from "../constants/contracts";
import { Spacing } from "../constants/dimension";
import { EthersContext } from "../context/EthersContext";
import useMigrateState, { MigrateState } from "../hooks/useMigrateState";
import useTranslation from "../hooks/useTranslation";
import MetamaskError from "../types/MetamaskError";
import { formatBalance, isEmptyValue, parseBalance } from "../utils";
import Screen from "./Screen";

const MigrateScreen = () => {
    const t = useTranslation();
    return (
        <Screen>
            <Container>
                <BackgroundImage />
                <Content>
                    <Title text={t("migrate")} />
                    <Text light={true}>{t("migrate-desc")}</Text>
                    <Migrate />
                </Content>
                {Platform.OS === "web" && <WebFooter />}
            </Container>
            <MigrateSubMenu />
        </Screen>
    );
};

const Migrate = () => {
    const { chainId } = useContext(EthersContext);
    const state = useMigrateState();
    if (chainId !== 1) return <ChangeNetwork />;
    return (
        <View style={{ marginTop: Spacing.large }}>
            <OhGeezAmount state={state} />
            <Border />
            <AmountInput state={state} />
            <AmountInfo state={state} />
        </View>
    );
};

const OhGeezAmount = (_: { state: MigrateState }) => {
    const t = useTranslation();
    return <TokenSelect title={t("my-balance")} symbol={"OH-GEEZ"} onChangeSymbol={() => {}} viewOnly={true} />;
};

const AmountInput = ({ state }: { state: MigrateState }) => {
    const t = useTranslation();
    if (!state.fromToken) {
        return <Heading text={t("amount-of-tokens")} disabled={true} />;
    }
    return (
        <TokenInput
            title={t("amount-of-tokens")}
            token={state.fromToken}
            amount={state.fromAmount}
            onAmountChanged={state.setFromAmount}
        />
    );
};

const AmountInfo = ({ state }: { state: MigrateState }) => {
    const disabled = !state.fromToken || isEmptyValue(state.fromAmount);
    return (
        <InfoBox>
            <Meta label={"LEVX"} text={formatBalance(parseBalance(state.fromAmount).mul(10))} disabled={disabled} />
            <Controls state={state} />
        </InfoBox>
    );
};

const Controls = ({ state }: { state: MigrateState }) => {
    const [error, setError] = useState<MetamaskError>({});
    useAsyncEffect(() => setError({}), [state.fromAmount]);
    return (
        <View style={{ marginTop: Spacing.normal }}>
            {!state.fromToken || isEmptyValue(state.fromAmount) ? (
                <MigrateButton state={state} onError={setError} disabled={true} />
            ) : parseBalance(state.fromAmount).gt(state.fromToken.balance) ? (
                <InsufficientBalanceButton symbol={state.fromToken.symbol} />
            ) : state.loading ? (
                <FetchingButton />
            ) : (
                <>
                    {!state.fromTokenAllowed && (
                        <ApproveButton
                            token={state.fromToken}
                            spender={SWAPPER}
                            onSuccess={() => state.setFromTokenAllowed(true)}
                            onError={setError}
                        />
                    )}
                    <MigrateButton state={state} onError={setError} disabled={!state.fromTokenAllowed} />
                </>
            )}
            {error.message && error.code !== 4001 && <ErrorMessage error={error} />}
        </View>
    );
};

const MigrateButton = ({
    state,
    onError,
    disabled
}: {
    state: MigrateState;
    onError: (e) => void;
    disabled: boolean;
}) => {
    const t = useTranslation();
    const onPress = async () => {
        onError({});
        try {
            await state.onMigrate();
        } catch (e) {
            onError(e);
        }
    };
    return <Button title={t("migrate")} loading={state.migrating} onPress={onPress} disabled={disabled} />;
};

export default MigrateScreen;
