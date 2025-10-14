"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle, Clock, UserCheck, Mail, Phone, Calendar, MessageSquare } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Consultation {
  id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  visitor_phone: string | null;
  legal_issue: string | null;
  status: "active" | "completed" | "assigned";
  assigned_lawyer_id: string | null;
  created_at: string;
  updated_at: string;
  assigned_lawyer?: {
    id: string;
    name: string;
    role: string;
  } | null;
}

interface Lawyer {
  id: string;
  name: string;
  role: string;
  practice_areas: string[];
}

interface ConsultationsListProps {
  initialConsultations: Consultation[];
  lawyers: Lawyer[];
}

const statusConfig = {
  active: { label: "대기중", icon: Clock, color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  assigned: { label: "배정완료", icon: UserCheck, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  completed: { label: "완료", icon: CheckCircle, color: "text-green-500 bg-green-500/10 border-green-500/20" },
};
