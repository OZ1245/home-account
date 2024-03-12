import { IAccountName } from "./supabase_account"
import { IEntity } from "./supabase_entity"

export interface ICalendarProps {
  date: Date
  entities?: IEntity[]
}

export interface IChangeNameDialogProps extends IAccountName {
  modelValue: boolean
}
