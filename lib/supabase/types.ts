export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      consultations: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          case_type: string;
          description: string;
          status: string;
          assigned_lawyer_id: string | null;
          created_at: string;
          updated_at: string;
          visitor_name: string | null;
          visitor_email: string | null;
          visitor_phone: string | null;
          legal_issue: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          case_type: string;
          description: string;
          status?: string;
          assigned_lawyer_id?: string | null;
          created_at?: string;
          updated_at?: string;
          visitor_name?: string | null;
          visitor_email?: string | null;
          visitor_phone?: string | null;
          legal_issue?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          case_type?: string;
          description?: string;
          status?: string;
          assigned_lawyer_id?: string | null;
          created_at?: string;
          updated_at?: string;
          visitor_name?: string | null;
          visitor_email?: string | null;
          visitor_phone?: string | null;
          legal_issue?: string | null;
        };
      };
      lawyers: {
        Row: {
          id: string;
          name: string;
          email: string;
          specialty: string;
          phone: string | null;
          bio: string | null;
          image_url: string | null;
          years_experience: number | null;
          created_at: string;
          updated_at: string;
          role: string | null;
          practice_areas: string[] | null;
          experience_years: number | null;
          headshot_url: string | null;
          is_active: boolean | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          specialty: string;
          phone?: string | null;
          bio?: string | null;
          image_url?: string | null;
          years_experience?: number | null;
          created_at?: string;
          updated_at?: string;
          role?: string | null;
          practice_areas?: string[] | null;
          experience_years?: number | null;
          headshot_url?: string | null;
          is_active?: boolean | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          specialty?: string;
          phone?: string | null;
          bio?: string | null;
          image_url?: string | null;
          years_experience?: number | null;
          created_at?: string;
          updated_at?: string;
          role?: string | null;
          practice_areas?: string[] | null;
          experience_years?: number | null;
          headshot_url?: string | null;
          is_active?: boolean | null;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          author_id: string | null;
          published: boolean;
          featured_image: string | null;
          category: string | null;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          author_id?: string | null;
          published?: boolean;
          featured_image?: string | null;
          category?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          author_id?: string | null;
          published?: boolean;
          featured_image?: string | null;
          category?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          case_type: string;
          rating: number;
          content: string;
          approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          case_type: string;
          rating: number;
          content: string;
          approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_name?: string;
          case_type?: string;
          rating?: number;
          content?: string;
          approved?: boolean;
          created_at?: string;
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
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

// 편리하게 각 테이블 타입 추출
export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T];
