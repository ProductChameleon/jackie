import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://lsqxpwguwsxjlnugxxpk.supabase.co'
const supabaseKey = 'sb_publishable_mUg1MeTz8daqawlGWf3T6A_dGuGpQMe'

export const supabase = createClient(supabaseUrl, supabaseKey)
