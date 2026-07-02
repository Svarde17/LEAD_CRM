-- Create leads table
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'interested', 'won', 'lost')),
  value DECIMAL(10,2) DEFAULT 0,
  follow_up_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create follow-ups table
CREATE TABLE follow_ups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meeting_notes table
CREATE TABLE meeting_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  summary TEXT,
  action_items TEXT[],
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_notes ENABLE ROW LEVEL SECURITY;

-- RLS policies for leads (public access for demo)
CREATE POLICY "select_leads" ON leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_leads" ON leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_leads" ON leads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_leads" ON leads FOR DELETE TO authenticated USING (true);

-- RLS policies for follow_ups
CREATE POLICY "select_follow_ups" ON follow_ups FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_follow_ups" ON follow_ups FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_follow_ups" ON follow_ups FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_follow_ups" ON follow_ups FOR DELETE TO authenticated USING (true);

-- RLS policies for meeting_notes
CREATE POLICY "select_meeting_notes" ON meeting_notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_meeting_notes" ON meeting_notes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_meeting_notes" ON meeting_notes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_meeting_notes" ON meeting_notes FOR DELETE TO authenticated USING (true);

-- Create indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_follow_up_date ON leads(follow_up_date);
CREATE INDEX idx_follow_ups_due_date ON follow_ups(due_date);
CREATE INDEX idx_follow_ups_lead_id ON follow_ups(lead_id);