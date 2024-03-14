import { IAccountName } from "./supabase_account"
import { IEntity } from "./supabase_entity"
import { IBudget, IBudgetData } from './supabase'

export interface ICalendarProps {
  date: Date
  entities?: IEntity[]
}

export interface IChangeNameDialogProps extends IAccountName {
  modelValue: boolean
}

export interface IBudgetProps extends IBudget {}
