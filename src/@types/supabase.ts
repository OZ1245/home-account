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
