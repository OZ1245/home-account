export interface IEntity {
  uuid: string
  created_at: string
  updated_at: string
  date: string
  name: string
  amount: number
  note: string
  owner: string
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
