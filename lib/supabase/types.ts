export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      lawyers: {
        Row: {
          id: string;
          name: string;
          role: string;
          practice_areas: string[];
          experience_years: number;
          bio: string | null;
          headshot_url: string | null;
          is_active: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          practice_areas: string[];
          experience_years: number;
          bio?: string | null;
          headshot_url?: string | null;
          is_active?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          practice_areas?: string[];
          experience_years?: number;
          bio?: string | null;
          headshot_url?: string | null;
          is_active?: boolean | null;
          created_at?: string;
        };
      };
      case_studies: {
        Row: {
          id: string;
          title: string;
          summary: string | null;
          practices: string[];
          impact_metric: string | null;
          published_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          summary?: string | null;
          practices: string[];
          impact_metric?: string | null;
          published_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          summary?: string | null;
          practices?: string[];
          impact_metric?: string | null;
          published_at?: string;
        };
      };
      news_articles: {
        Row: {
          id: string;
          headline: string;
          slug: string | null;
          body: string | null;
          published_at: string;
          source_url: string | null;
          author: string | null;
        };
        Insert: {
          id?: string;
          headline: string;
          slug?: string | null;
          body?: string | null;
          published_at?: string;
          source_url?: string | null;
          author?: string | null;
        };
        Update: {
          id?: string;
          headline?: string;
          slug?: string | null;
          body?: string | null;
          published_at?: string;
          source_url?: string | null;
          author?: string | null;
        };
      };
      insights: {
        Row: {
          id: number;
          title: string;
          body: string | null;
          source_url: string | null;
          published_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          body?: string | null;
          source_url?: string | null;
          published_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          body?: string | null;
          source_url?: string | null;
          published_at?: string;
        };
      };
      faqs: {
        Row: {
          id: number;
          question: string;
          answer: string | null;
          related_practice: string | null;
        };
        Insert: {
          id?: number;
          question: string;
          answer?: string | null;
          related_practice?: string | null;
        };
        Update: {
          id?: number;
          question?: string;
          answer?: string | null;
          related_practice?: string | null;
        };
      };
      automation_failures: {
        Row: {
          id: number;
          source: string;
          payload: Json | null;
          error: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          source: string;
          payload?: Json | null;
          error?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          source?: string;
          payload?: Json | null;
          error?: string | null;
          created_at?: string;
        };
      };
      lead_intake: {
        Row: {
          id: string;
          email: string;
          company: string | null;
          phone: string | null;
          message: string | null;
          source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          company?: string | null;
          phone?: string | null;
          message?: string | null;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          company?: string | null;
          phone?: string | null;
          message?: string | null;
          source?: string | null;
          created_at?: string;
        };
      };
      quick_contacts: {
        Row: {
          id: string;
          name: string;
          phone: string;
          consultation_type: string;
          message: string | null;
          status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          consultation_type: string;
          message?: string | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          consultation_type?: string;
          message?: string | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      consultations: {
        Row: {
          id: string;
          visitor_name: string;
          visitor_email: string;
          visitor_phone: string;
          legal_issue: string;
          status: string | null;
          assigned_lawyer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          visitor_name: string;
          visitor_email: string;
          visitor_phone: string;
          legal_issue: string;
          status?: string | null;
          assigned_lawyer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          visitor_name?: string;
          visitor_email?: string;
          visitor_phone?: string;
          legal_issue?: string;
          status?: string | null;
          assigned_lawyer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          consultation_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          consultation_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          consultation_id?: string;
          role?: "user" | "assistant" | "system";
          content?: string;
          created_at?: string;
        };
      };
      faq_embeddings: {
        Row: {
          faq_id: number;
          embedding: number[] | null;
        };
        Insert: {
          faq_id: number;
          embedding?: number[] | null;
        };
        Update: {
          faq_id?: number;
          embedding?: number[] | null;
        };
      };
      admin_profiles: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// 편리하게 각 테이블 타입 추출
export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];
