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
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrbmVkcmRleXpqc2Vja3hzcHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyODI0MzgsImV4cCI6MjA2NTg1ODQzOH0.0WzXarBa41fl7mB0NorAlm66kU69BCM6Ct_EPtEr0UI'
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
}