import { IAccountName, IEntity, IBudget } from "./supabase"

export interface ICalendarProps {
  date: Date
  entities?: IEntity[]
}

export interface IChangeNameDialogProps extends IAccountName {
  modelValue: boolean
}

export interface IBudgetProps extends IBudget {}
