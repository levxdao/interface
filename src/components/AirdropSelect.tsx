import React, { useCallback, useContext } from "react";
import { FlatList, View } from "react-native";

import airdrops from "../constants/airdrops";
import { IS_DESKTOP, Spacing } from "../constants/dimension";
import { EthersContext } from "../context/EthersContext";
import { AirdropsState } from "../hooks/useAirdropsState";
import useTranslation from "../hooks/useTranslation";
import Airdrop from "../types/Airdrop";
import TokenWithValue from "../types/TokenWithValue";
import { formatBalance } from "../utils";
import CloseIcon from "./CloseIcon";
import Expandable from "./Expandable";
import FlexView from "./FlexView";
import { ITEM_SEPARATOR_HEIGHT } from "./ItemSeparator";
import Loading from "./Loading";
import Selectable from "./Selectable";
import SelectIcon from "./SelectIcon";
import Text from "./Text";
import TokenLogo from "./TokenLogo";
import TokenSymbol from "./TokenSymbol";

const AirdropSelect = ({ state }: { state: AirdropsState }) => {
    console.log(airdrops);
    const t = useTranslation();
    const { tokens } = useContext(EthersContext);
    const token = tokens.find(tk => tk.address === state.selectedAirdrop?.token);
    return (
        <>
            <Expandable
                title={t("list-of-airdrops")}
                expanded={!state.selectedAirdrop}
                onExpand={() => state.setSelectedAirdrop()}>
                <AirdropList onSelectAirdrop={state.setSelectedAirdrop} />
            </Expandable>
            {state.selectedAirdrop && token && (
                <AirdropItem
                    airdrop={state.selectedAirdrop}
                    token={token}
                    selected={true}
                    onSelectAirdrop={() => state.setSelectedAirdrop()}
                />
            )}
        </>
    );
};

const AirdropList = (props: { onSelectAirdrop: (airdrop: Airdrop) => void }) => {
    const { loadingTokens, tokens } = useContext(EthersContext);
    const renderItem = useCallback(
        ({ item }) => {
            const token = tokens.find(t => t.address === item.token);
            if (token) {
                return (
                    <AirdropItem
                        key={item.address}
                        airdrop={item}
                        token={token}
                        selected={false}
                        onSelectAirdrop={props.onSelectAirdrop}
                    />
                );
            } else {
                return <View />;
            }
        },
        [tokens, props.onSelectAirdrop]
    );
    return loadingTokens ? (
        <Loading />
    ) : (
        <FlatList keyExtractor={item => item.token} data={airdrops} renderItem={renderItem} />
    );
};

// tslint:disable-next-line:max-func-body-length
const AirdropItem = (props: {
    airdrop: Airdrop;
    token: TokenWithValue;
    selected: boolean;
    onSelectAirdrop: (airdrop: Airdrop) => void;
}) => {
    const t = useTranslation();
    const onPress = useCallback(() => {
        props.onSelectAirdrop(props.airdrop);
    }, [props.onSelectAirdrop, props.airdrop]);
    return (
        <Selectable
            selected={props.selected}
            onPress={onPress}
            containerStyle={{
                marginBottom: ITEM_SEPARATOR_HEIGHT
            }}>
            <FlexView style={{ alignItems: "center" }}>
                <TokenLogo token={props.token} />
                <View style={{ marginLeft: Spacing.small }}>
                    <Text note={true} fontWeight={"light"}>
                        {props.airdrop.description}
                    </Text>
                    <Text caption={true} numberOfLines={1} ellipsizeMode={"tail"} style={{ width: 180 }}>
                        {props.airdrop.name}
                    </Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                    {props.airdrop.snapshot && (
                        <Text note={true} fontWeight={"light"}>
                            {t("block-", { number: props.airdrop.snapshot })}
                        </Text>
                    )}
                    <FlexView>
                        <Text caption={IS_DESKTOP}>{formatBalance(props.airdrop.amount, 18, 8)}</Text>
                        {IS_DESKTOP && <TokenSymbol token={props.token} />}
                    </FlexView>
                </View>
                {props.selected ? <CloseIcon /> : <SelectIcon />}
            </FlexView>
        </Selectable>
    );
};

export default AirdropSelect;
