type OldState = {
  ui: {
    settings: {
      [settingsKey: string]: unknown
    }
    [sliceKey: string]: unknown
  }
  [otherSlice: string]: unknown
}

type NewState = {
  ui: {
    settings: {
      [settingsKey: string]: unknown
      showUnverifiedAssets: boolean
    }
    [sliceKey: string]: unknown
  }
  [otherSlice: string]: unknown
}

export default (prevState: Record<string, unknown>): NewState => {
  const typedPrevState = prevState as OldState
  delete typedPrevState.ui.settings.showHiddenAssets

  return {
    ...prevState,
    ui: {
      ...typedPrevState.ui,
      settings: {
        ...typedPrevState.ui.settings,
        showUnverifiedAssets: false,
      },
    },
  }
}
