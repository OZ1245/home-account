interface IBudgetDataItem {
  value: string
  date: string
}

export interface IBudgetData {
  prepayment: IBudgetDataItem
  wage: IBudgetDataItem
}

export interface IBudget {
  readonly created_at?: string
  readonly updated_at?: string
  readonly owner?: string
  uuid?: string
  date: string // YYYY MM
  data: IBudgetData
}

export interface IUploadAvatar {
  fileName: string
  file: File
}

export interface IAccountName {
  firstName?: string
  lastName?: string
}

export interface IAccount extends IAccountName {
  avatar?: string | null,
  email?: string,
  createdAt?: string
}

export interface IAccountPasswords {
  oldPassword: string,
  newPassword: string,
  newPasswordRepeat: string
}

export interface ISignUp {
  email: string,
  password: string
  firstName: string
  lastName?: string
}

export interface ILogin {
  email: string,
  password: string
}

export interface IEntity {
  readonly uuid?: string
  readonly created_at?: string
  updated_at?: string
  date?: string // YYYY-MM-DD
  name?: string
  amount?: string | null
  note?: string
  owner?: string
}

export interface IAddEntity {
  date: string
  name?: string
  amount?: number | null
  note?: string
}

export interface IUpdateEntity {
  uuid: string
  date?: string
  name?: string
  amount?: number | null
  note?: string
}
