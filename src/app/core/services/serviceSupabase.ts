import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://cknedrdeyzjseckxspqx.supabase.co',
      'sb_publishable_EwMJmI0Prj2CsOuul2KjgQ_5sGSBFrJ'
    );
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

  getSession() {
    return this.supabase.auth.getSession();
  }

  signOut() {
    return this.supabase.auth.signOut();
  }
  getUser() {
    return this.supabase.auth.getUser();
  }

  getUserId(): string {
    const id: string = undefined;
    this.supabase.auth.getUser().then((data) => {
      return data.data.user.id
    });
    return id;
  }
}