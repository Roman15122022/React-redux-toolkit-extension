export type TextStatDomainProps = {
  allActualDomenDataText: Data[]
  isInBlackList: (domain: string) => boolean
  handleToggleBlackList: (domain: string) => void
  removeFromBlack: string
  addToBlack: string
  btnRemove: string
  btnAddBl: string
}

type Data = {
  label: string
  value: string
}
