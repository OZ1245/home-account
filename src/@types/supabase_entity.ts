export interface IAddEntity {
  date: string
  name?: string
  amount?: number
  note?: number
}

export interface IUpdateEntity {
  uuid: string
  date?: string
  name?: string
  amount?: number
  note?: number
}
