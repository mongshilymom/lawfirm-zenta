export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      lawyers: {
        Row: {
          id: string;
          name: string;
          role: "Partner" | "Associate";
          practice_areas: string[];
          experience_years: number;
          bio: string | null;
          headshot_url: string | null;
          is_active: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          role: "Partner" | "Associate";
          practice_areas: string[];
          experience_years: number;
          bio?: string | null;
          headshot_url?: string | null;
          is_active?: boolean | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["lawyers"]["Insert"]>;
      };      faqs: {
        Row: {
          id: number;
          question: string | null;
          answer: string | null;
          related_practice: string | null;
        };
        Insert: {
          id?: number;
          question?: string | null;
          answer?: string | null;
          related_practice?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["faqs"]["Insert"]>;
      };
      insights: {
        Row: {
          id: number;
          title: string | null;
          body: string | null;
          source_url: string | null;
          published_at: string | null;
        };
        Insert: {
          id?: number;
          title?: string | null;
          body?: string | null;
          source_url?: string | null;
          published_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["insights"]["Insert"]>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};