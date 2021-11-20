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
import LPTokenSelect, { LPTokenItem } from "../components/LPTokenSelect";
import Meta from "../components/Meta";
import Select, { Option } from "../components/Select";
import Text from "../components/Text";
import Title from "../components/Title";
import TokenInput from "../components/TokenInput";
import WebFooter from "../components/web/WebFooter";
import { MigrateSubMenu } from "../components/web/WebSubMenu";
import { MIGRATOOOOOOR } from "../constants/contracts";
import { Spacing } from "../constants/dimension";
import { EthersContext } from "../context/EthersContext";
import useMigrateLPState, { MigrateLPState, MigrateMode } from "../hooks/useMigrateLPState";
import useTranslation from "../hooks/useTranslation";
import MetamaskError from "../types/MetamaskError";
import { isEmptyValue, parseBalance } from "../utils";
import Screen from "./Screen";

const MigrateLPScreen = () => {
    const t = useTranslation();
    return (
        <Screen>
            <Container>
                <BackgroundImage />
                <Content>
                    <Title text={t("migrate-liquidity")} />
                    <Text light={true}>{t("migrate-liquidity-desc")}</Text>
                    <Migrate />
                </Content>
                {Platform.OS === "web" && <WebFooter />}
            </Container>
            <MigrateSubMenu />
        </Screen>
    );
};

const Migrate = () => {
    const { ethereum, chainId } = useContext(EthersContext);
    const state = useMigrateLPState();
    if (chainId !== 1) return <ChangeNetwork />;
    return (
        <View style={{ marginTop: Spacing.large }}>
            {!ethereum?.isWalletConnect && (
                <>
                    <MigrateModeSelect state={state} />
                    <Border />
                </>
            )}
            <OhGeezLiquidity state={state} />
            <Border />
            <AmountInput state={state} />
            <AmountInfo state={state} />
        </View>
    );
};

const MigrateModeSelect = ({ state }: { state: MigrateLPState }) => {
    const t = useTranslation();
    const options: Option[] = [
        {
            key: "permit",
            title: t("non-hardware-wallet"),
            description: t("non-hardware-wallet-desc")
        },
        {
            key: "approve",
            title: t("hardware-wallet"),
            description: t("hardware-wallet-desc")
        }
    ];
    return (
        <Select
            title={t("wallet-type")}
            options={options}
            option={options.find(option => option.key === state.mode)}
            setOption={option => state.setMode(option?.key as MigrateMode | undefined)}
        />
    );
};

const OhGeezLiquidity = ({ state }: { state: MigrateLPState }) => {
    const t = useTranslation();
    const title = "OH-GEEZ/WETH" + t("liquidity");
    if (!state.mode) {
        return <Heading text={title} disabled={true} />;
    }
    return (
        <LPTokenSelect
            state={state}
            title={title}
            emptyText={t("you-dont-have-liquidity")}
            Item={LPTokenItem}
            disabled={true}
        />
    );
};

const AmountInput = ({ state }: { state: MigrateLPState }) => {
    const t = useTranslation();
    if (!state.mode || !state.selectedLPToken) {
        return <Heading text={t("amount-of-tokens")} disabled={true} />;
    }
    return (
        <TokenInput
            title={t("amount-of-tokens")}
            token={state.selectedLPToken}
            amount={state.amount}
            onAmountChanged={state.setAmount}
        />
    );
};

const AmountInfo = ({ state }: { state: MigrateLPState }) => {
    const t = useTranslation();
    const disabled = !state.selectedLPToken || isEmptyValue(state.amount);
    return (
        <InfoBox>
            <Meta
                label={state.fromToken ? state.fromToken.symbol : t("1st-token")}
                text={state.fromAmount}
                disabled={disabled}
            />
            <Meta
                label={state.toToken ? state.toToken.symbol : t("2nd-token")}
                text={state.toAmount}
                disabled={disabled}
            />
            <Controls state={state} />
        </InfoBox>
    );
};

const Controls = ({ state }: { state: MigrateLPState }) => {
    const [error, setError] = useState<MetamaskError>({});
    useAsyncEffect(() => setError({}), [state.amount]);
    return (
        <View style={{ marginTop: Spacing.normal }}>
            {!state.selectedLPToken || isEmptyValue(state.amount) ? (
                <MigrateButton state={state} onError={setError} disabled={true} />
            ) : parseBalance(state.amount, state.selectedLPToken.decimals).gt(state.selectedLPToken.balance) ? (
                <InsufficientBalanceButton symbol={state.selectedLPToken.symbol} />
            ) : state.loading ? (
                <FetchingButton />
            ) : (
                <>
                    {state.mode === "approve" && !state.selectedLPTokenAllowed && (
                        <ApproveButton
                            token={state.selectedLPToken}
                            spender={MIGRATOOOOOOR}
                            onSuccess={() => state.setSelectedLPTokenAllowed(true)}
                            onError={setError}
                        />
                    )}
                    <MigrateButton
                        state={state}
                        onError={setError}
                        disabled={state.mode === "approve" && !state.selectedLPTokenAllowed}
                    />
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
    state: MigrateLPState;
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
    return <Button title={t("migrate-liquidity")} loading={state.migrating} onPress={onPress} disabled={disabled} />;
};

export default MigrateLPScreen;
