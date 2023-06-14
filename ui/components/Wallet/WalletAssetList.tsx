import React, { ReactElement, useState } from "react"
import { CompleteAssetAmount } from "@tallyho/tally-background/redux-slices/accounts"
import { useTranslation } from "react-i18next"
import {
  SmartContractFungibleAsset,
  SwappableAsset,
} from "@tallyho/tally-background/assets"
import WalletAssetListItem from "./WalletAssetListItem"
import AssetWarningWrapper from "./UnverifiedAsset/AssetWarningWrapper"

type WalletAssetListProps = {
  assetAmounts: CompleteAssetAmount<SwappableAsset>[]
  initializationLoadingTimeExpired: boolean
}

export default function WalletAssetList(
  props: WalletAssetListProps
): ReactElement {
  const { t } = useTranslation("translation", {
    keyPrefix: "wallet.activities",
  })

  const { assetAmounts, initializationLoadingTimeExpired } = props

  const [warnedAsset, setWarnedAsset] = useState<
    CompleteAssetAmount<SmartContractFungibleAsset>["asset"] | null
  >(null)

  if (!assetAmounts) return <></>

  return (
    <>
      <AssetWarningWrapper
        asset={warnedAsset}
        close={() => {
          setWarnedAsset(null)
        }}
      />
      <ul>
        {assetAmounts.map((assetAmount) => (
          <WalletAssetListItem
            assetAmount={assetAmount}
            key={assetAmount.asset.symbol}
            initializationLoadingTimeExpired={initializationLoadingTimeExpired}
            onUnverifiedAssetWarningClick={(asset) => setWarnedAsset(asset)}
          />
        ))}
        {!initializationLoadingTimeExpired && (
          <li className="loading">{t("loadingActivities")}</li>
        )}
        <style jsx>{`
          .loading {
            display: flex;
            justify-content: center;
            padding-top: 5px;
            padding-bottom: 40px;
            color: var(--green-60);
            font-size: 15px;
          }
        `}</style>
      </ul>
    </>
  )
}
