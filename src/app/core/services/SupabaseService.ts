import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'cknedrdeyzjseckxspqx',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrbmVkcmRleXpqc2Vja3hzcHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyODI0MzgsImV4cCI6MjA2NTg1ODQzOH0.0WzXarBa41fl7mB0NorAlm66kU69BCM6Ct_EPtEr0UI'
    );
  }

  getClient() {
    return this.supabase;
  }
}