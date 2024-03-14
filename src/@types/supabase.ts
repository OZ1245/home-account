interface IBudgetDataItem {
  value: number
  date: string
}

interface IBudgetData {
  prepayment: IBudgetDataItem
  wage: IBudgetDataItem
}

export interface IBudget {
  readonly uuid?: string
  readonly created_at?: string
  readonly updated_at?: string
  readonly owner?: string
  date?: string // YYYY MM
  data?: IBudgetData | null
}
