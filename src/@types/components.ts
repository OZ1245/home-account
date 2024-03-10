import { IEntity } from "./supabase_entity"

export interface ICalendarProps {
  date: Date
  entities?: IEntity[]
}
