import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(`https://${process.env.VUE_APP_SUPABASE_PROJECT_ID}.supabase.co`, process.env.VUE_APP_SUPABASE_KEY)
