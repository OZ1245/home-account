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
