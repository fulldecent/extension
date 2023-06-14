import { HexString } from "@tallyho/tally-background/types"
import {
  Activity,
  INFINITE_VALUE,
} from "@tallyho/tally-background/redux-slices/activities"
import { sameEVMAddress } from "@tallyho/tally-background/lib/utils"
import { useTranslation } from "react-i18next"
import { TransactionAnnotation } from "@tallyho/tally-background/services/enrichment"

function isReceiveActivity(
  activity: Activity,
  activityInitiatorAddress: string
): boolean {
  return (
    activity.type === "asset-transfer" &&
    sameEVMAddress(activity.recipient?.address, activityInitiatorAddress)
  )
}

// The asset-transfer activity type splits into send and receive actions.
// Therefore, we exclude it from the activity icon types and add more precise types for it.
export type ActivityIconType =
  | Exclude<TransactionAnnotation["type"], "asset-transfer">
  | "asset-transfer-receive"
  | "asset-transfer-send"

type ActivityViewDetails = {
  icon: ActivityIconType
  label: string
  recipient: {
    address?: HexString
    name?: string
  }
  assetLogoURL?: string
  assetSymbol: string
  assetValue: string
}

export default function useActivityViewDetails(
  activity: Activity,
  activityInitiatorAddress: string
): ActivityViewDetails {
  const { t } = useTranslation("translation", {
    keyPrefix: "wallet.activities",
  })
  const baseDetails = {
    recipient: activity.recipient,
    assetLogoURL: activity.assetLogoUrl,
    assetSymbol: activity.assetSymbol,
    assetValue: activity.value,
  }
  switch (activity.type) {
    case "asset-transfer":
      return {
        ...baseDetails,
        label: isReceiveActivity(activity, activityInitiatorAddress)
          ? t("tokenReceived")
          : t("tokenSent"),
        icon: isReceiveActivity(activity, activityInitiatorAddress)
          ? "asset-transfer-receive"
          : "asset-transfer-send",
      }
    case "asset-approval":
      return {
        ...baseDetails,
        label: t("tokenApproved"),
        icon: "asset-approval",
        assetValue:
          activity.value === INFINITE_VALUE
            ? t("infiniteApproval")
            : activity.value,
      }
    case "asset-swap":
      return {
        ...baseDetails,
        icon: "asset-swap",
        label: t("tokenSwapped"),
      }
    case "contract-deployment":
    case "contract-interaction":
    default:
      return {
        ...baseDetails,
        icon: "contract-interaction",
        label: t("contractInteraction"),
      }
  }
}
