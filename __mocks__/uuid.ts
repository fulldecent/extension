const uuidMock = jest.createMockFromModule<typeof import("uuid")>("uuid")
const uuidActual = jest.mock<typeof import("uuid")>("uuid", () => ({
  ...jest.requireActual("uuid"),
  v4: jest.fn().mockImplementation(() => {
    jest.requireActual("uuid").v4()
  }),
}))

module.exports = {
  ...uuidMock,
  v4: uuidActual.v4,
}
