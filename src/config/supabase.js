import { createClient } from '@supabase/supabase-js'

const supabaseKey = import.meta.env.VITE_SUPABASE_LINK
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
