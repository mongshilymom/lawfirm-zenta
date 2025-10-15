import { cookies } from "next/headers";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";

export interface AdminSession {
  userId: string;
  email: string;
  isAdmin: boolean;
  role: string;
}

/**
 * Get current admin session
 * Returns null if user is not authenticated or not an admin
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = cookies();
    
    // Get access token from cookies
    const accessToken = cookieStore.get("sb-access-token")?.value;
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;

    if (!accessToken) {
      return null;
    }

    // Verify session with regular client
    const supabase = createServerSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return null;
    }

    // Check if user is admin
    const adminClient = createAdminSupabase();
    const { data: adminProfile, error: adminError } = await adminClient
      .from("admin_profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (adminError || !adminProfile) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email || "",
      isAdmin: true,
      role: adminProfile.role,
    };
  } catch (error) {
    console.error("Error getting admin session:", error);
    return null;
  }
}

/**
 * Check if user is admin
 * Simpler version that just returns boolean
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}

/**
 * Require admin session or throw error
 * Use in Server Actions or Route Handlers
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  
  if (!session) {
    throw new Error("Unauthorized: Admin access required");
  }

  return session;
}
