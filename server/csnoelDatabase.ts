export type CSNoelDatabase = {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string;
          title: string;
          location: string;
          type: "Travel" | "LTC" | "Rapid Response" | "Per Diem";
          specialty: string;
          description: string;
          salary_range: string | null;
          requirements: string[] | null;
          benefits: string[] | null;
          is_active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Partial<CSNoelDatabase["public"]["Tables"]["jobs"]["Row"]> & Pick<CSNoelDatabase["public"]["Tables"]["jobs"]["Row"], "title" | "location" | "type" | "specialty" | "description">;
        Update: Partial<CSNoelDatabase["public"]["Tables"]["jobs"]["Row"]>;
        Relationships: [];
      };
      applications: {
        Row: {
          id: string;
          job_id: string | null;
          applicant_name: string;
          applicant_email: string;
          applicant_phone: string | null;
          resume_path: string | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: Partial<CSNoelDatabase["public"]["Tables"]["applications"]["Row"]> & Pick<CSNoelDatabase["public"]["Tables"]["applications"]["Row"], "job_id" | "applicant_name" | "applicant_email">;
        Update: Partial<CSNoelDatabase["public"]["Tables"]["applications"]["Row"]>;
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          type: "clinician" | "facility";
          message: string | null;
          source: string | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: Partial<CSNoelDatabase["public"]["Tables"]["leads"]["Row"]> & Pick<CSNoelDatabase["public"]["Tables"]["leads"]["Row"], "name" | "email" | "type">;
        Update: Partial<CSNoelDatabase["public"]["Tables"]["leads"]["Row"]>;
        Relationships: [];
      };
      resume_uploads: {
        Row: {
          id: string;
          object_path: string;
          original_filename: string;
          content_type: string;
          size_bytes: number;
          expires_at: string;
          consumed_at: string | null;
          created_at: string | null;
        };
        Insert: Partial<CSNoelDatabase["public"]["Tables"]["resume_uploads"]["Row"]> & Pick<CSNoelDatabase["public"]["Tables"]["resume_uploads"]["Row"], "object_path" | "original_filename" | "content_type" | "size_bytes" | "expires_at">;
        Update: Partial<CSNoelDatabase["public"]["Tables"]["resume_uploads"]["Row"]>;
        Relationships: [];
      };
      chat_conversations: {
        Row: {
          id: string;
          openai_response_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Partial<CSNoelDatabase["public"]["Tables"]["chat_conversations"]["Row"]>;
        Update: Partial<CSNoelDatabase["public"]["Tables"]["chat_conversations"]["Row"]>;
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: "user" | "assistant";
          content: string;
          created_at: string | null;
        };
        Insert: Partial<CSNoelDatabase["public"]["Tables"]["chat_messages"]["Row"]> & Pick<CSNoelDatabase["public"]["Tables"]["chat_messages"]["Row"], "conversation_id" | "role" | "content">;
        Update: Partial<CSNoelDatabase["public"]["Tables"]["chat_messages"]["Row"]>;
        Relationships: [];
      };
      owner_notifications: {
        Row: {
          id: string;
          kind: "application" | "lead";
          title: string;
          body: string;
          related_entity_id: string;
          is_read: boolean;
          created_at: string | null;
        };
        Insert: Partial<CSNoelDatabase["public"]["Tables"]["owner_notifications"]["Row"]> & Pick<CSNoelDatabase["public"]["Tables"]["owner_notifications"]["Row"], "kind" | "title" | "body" | "related_entity_id">;
        Update: Partial<CSNoelDatabase["public"]["Tables"]["owner_notifications"]["Row"]>;
        Relationships: [];
      };
      admin_profiles: {
        Row: {
          user_id: string;
          role: "admin" | "user";
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<CSNoelDatabase["public"]["Tables"]["admin_profiles"]["Row"]> & Pick<CSNoelDatabase["public"]["Tables"]["admin_profiles"]["Row"], "user_id">;
        Update: Partial<CSNoelDatabase["public"]["Tables"]["admin_profiles"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
