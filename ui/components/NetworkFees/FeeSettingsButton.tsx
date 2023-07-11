import React, { ReactElement } from "react"
import { isBuiltInNetwork } from "@tallyho/tally-background/constants"
import { selectCurrentNetwork } from "@tallyho/tally-background/redux-slices/selectors"
import { isEIP1559EnrichedTransactionRequest } from "@tallyho/tally-background/networks"
import { selectTransactionData } from "@tallyho/tally-background/redux-slices/selectors/transactionConstructionSelectors"
import { useTranslation } from "react-i18next"
import { useBackgroundSelector } from "../../hooks"
import SharedTooltip from "../Shared/SharedTooltip"
import FeeSettingsText from "./FeeSettingsText"

interface FeeSettingsButtonProps {
  onClick: () => void
}

export default function FeeSettingsButton({
  onClick,
}: FeeSettingsButtonProps): ReactElement {
  const transactionData = useBackgroundSelector(selectTransactionData)
  const selectedNetwork = useBackgroundSelector(selectCurrentNetwork)
  const currentNetwork = transactionData?.network || selectedNetwork

  const { t } = useTranslation()

  if (
    transactionData &&
    !isEIP1559EnrichedTransactionRequest(transactionData) &&
    !isBuiltInNetwork(currentNetwork)
  ) {
    return (
      <div>
        <SharedTooltip
          width={175}
          height={30}
          type="dark"
          horizontalShift={90}
          horizontalPosition="center"
          verticalPosition="bottom"
          IconComponent={() => (
            <>
              <div className="disabled_settings">
                <FeeSettingsText />
              </div>
              <style jsx>
                {`
                  .disabled_settings {
                    font-size: 16px;
                  }
                `}
              </style>
            </>
          )}
        >
          <div className="tooltip_container">
            <div>{t("networkFees.settingsDisabledOne")}</div>
            <div>{t("networkFees.settingsDisabledTwo")}</div>
          </div>
        </SharedTooltip>
      </div>
    )
  }

  return (
    <button className="settings" type="button" onClick={onClick}>
      <FeeSettingsText />
      <img className="settings_image" src="./images/cog@2x.png" alt="" />
      <style jsx>
        {`
          .settings {
            height: 32px;
            display: flex;
            align-items: center;
            color: var(--gold-5);
            font-size: 16px;
            line-height: 20px;
            border-radius: 4px;
            padding: 0.3rem;
            border: 1px solid #33514e;
            transition: all 0.3s ease;
          }
          .settings_image {
            width: 14px;
            height: 14px;
            padding: 0 8px;
            transition: all 0.3s ease;
          }
          .settings:hover {
            border: 1px solid #578f89;
          }
          .settings:hover .settings_image {
            filter: brightness(1.5);
          }
          .tooltip_container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        `}
      </style>
    </button>
  )
}
