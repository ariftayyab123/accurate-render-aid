import { supabase } from "@/integrations/supabase/client";

export interface AuthorizationDetails {
  client?: { name?: string } | null;
  redirect_url?: string;
  redirect_to?: string;
}

type Result = Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;

export type OAuthApi = {
  getAuthorizationDetails: (id: string) => Result;
  approveAuthorization: (id: string) => Result;
  denyAuthorization: (id: string) => Result;
};

export function oauthApi(): OAuthApi {
  return (supabase.auth as unknown as { oauth: OAuthApi }).oauth;
}
