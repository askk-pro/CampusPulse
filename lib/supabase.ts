import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    name: string | null
                    role: "student" | "faculty" | "admin"
                    created_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    name?: string | null
                    role: "student" | "faculty" | "admin"
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string | null
                    role?: "student" | "faculty" | "admin"
                    created_at?: string
                }
            }
            students: {
                Row: {
                    id: string
                    user_id: string
                    department: string | null
                    year: number | null
                    skills: Record<string, number> | null
                    category: "Explorer" | "Doer" | "Achiever" | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    department?: string | null
                    year?: number | null
                    skills?: Record<string, number> | null
                    category?: "Explorer" | "Doer" | "Achiever" | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    department?: string | null
                    year?: number | null
                    skills?: Record<string, number> | null
                    category?: "Explorer" | "Doer" | "Achiever" | null
                    created_at?: string
                }
            }
            // Add other table types as needed
        }
    }
}
