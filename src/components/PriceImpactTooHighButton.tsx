import React from "react";

import useTranslation from "../hooks/useTranslation";
import Button from "./Button";

const PriceImpactTooHighButton = () => {
    const t = useTranslation();
    return <Button title={t("price-impact-too-high")} disabled={true} />;
};
export default PriceImpactTooHighButton;
