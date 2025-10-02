import { Injectable } from '@angular/core';
import { createClient, PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  private _authExpired$ = new Subject<void>();
  authExpired$ = this._authExpired$.asObservable();

  constructor() {
    this.supabase = createClient(
      'https://cknedrdeyzjseckxspqx.supabase.co',
      'sb_publishable_EwMJmI0Prj2CsOuul2KjgQ_5sGSBFrJ',
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        console.warn('Sessão expirada');
        this._authExpired$.next();
      }
    });
  }




  signInWithEmailPassword(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  signInWithGoogleIdToken(idToken: string) {
    return this.supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken
    });
  }

  getClient() {
    return this.supabase;
  }

  async getSession() {
    const res = await this.supabase.auth.getSession();
    return res;
  }

  signOut() {
    return this.supabase.auth.signOut();
  }
  async getUser() {
    const res = await this.supabase.auth.getUser();
    return res;

  }

  async getUserId(): Promise<string | null> {
    const { data, error } = await this.supabase.auth.getUser();
    return data?.user?.id ?? null;
  }


  handleError(error: any) {
    console.log('[handleError] Tratando erro:', error);
    if (error?.code === 'PGRST303' || error?.message?.includes('JWT expired')) {
      console.warn('[handleError] JWT expirado detectado no Supabase');
      this._authExpired$.next();
    }
    return error;
  }
}