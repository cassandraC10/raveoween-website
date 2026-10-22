-- Raveoween community database schema draft
-- Version 0.1 | PostgreSQL | Provider integration remains conditional
-- Review and adapt auth.users reference and UUID generation to selected auth provider before execution.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE application_status AS ENUM ('draft','submitted','age_verification_pending','under_review','approved','rejected','withdrawn');
CREATE TYPE age_verification_status AS ENUM ('initiated','pending_user_action','verified_21_plus','under_21','failed','expired','cancelled','provider_error','manual_review_required');
CREATE TYPE vouch_status AS ENUM ('active','revoked','invalidated');
CREATE TYPE membership_status AS ENUM ('pending','active','suspended','revoked','expired');
CREATE TYPE publication_status AS ENUM ('draft','published','archived');

CREATE TABLE profiles (
  id uuid PRIMARY KEY,
  display_name text NOT NULL,
  avatar_url text,
  profile_status text NOT NULL DEFAULT 'active' CHECK (profile_status IN ('active','disabled','deleted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  status application_status NOT NULL DEFAULT 'draft',
  full_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  referral_waived boolean NOT NULL DEFAULT false,
  waiver_reason_code text,
  submitted_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id) ON DELETE RESTRICT,
  reviewed_at timestamptz,
  decision_reason_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (NOT referral_waived OR waiver_reason_code IS NOT NULL)
);
CREATE INDEX applications_applicant_status_idx ON applications(applicant_id,status,submitted_at DESC);

CREATE TABLE age_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE RESTRICT,
  provider_code text NOT NULL,
  provider_reference text,
  status age_verification_status NOT NULL DEFAULT 'initiated',
  is_over_21 boolean,
  method text,
  verified_at timestamptz,
  expires_at timestamptz,
  policy_version text NOT NULL,
  failure_reason_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((status = 'verified_21_plus' AND is_over_21 = true AND verified_at IS NOT NULL)
      OR status <> 'verified_21_plus')
);
CREATE INDEX age_verifications_applicant_status_idx ON age_verifications(applicant_id,status,created_at DESC);
CREATE INDEX age_verifications_application_idx ON age_verifications(application_id,created_at DESC);

CREATE TABLE vouches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE RESTRICT,
  voucher_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  status vouch_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  note_code text,
  UNIQUE(application_id,voucher_profile_id)
);
CREATE INDEX vouches_application_status_idx ON vouches(application_id,status);

CREATE TABLE memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE RESTRICT,
  status membership_status NOT NULL DEFAULT 'pending',
  started_at timestamptz,
  ended_at timestamptz,
  approved_by uuid REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ended_at IS NULL OR started_at IS NULL OR ended_at >= started_at)
);
CREATE INDEX memberships_profile_status_idx ON memberships(profile_id,status);

CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE CHECK (code IN ('super_admin','application_reviewer','community_moderator','content_editor')),
  description text NOT NULL
);
CREATE TABLE user_roles (
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  assigned_by uuid REFERENCES profiles(id) ON DELETE RESTRICT,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  PRIMARY KEY(profile_id,role_id)
);

CREATE TABLE editions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_number integer NOT NULL UNIQUE CHECK (edition_number > 0),
  roman_numeral text NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  event_date date,
  venue_label text,
  status publication_status NOT NULL DEFAULT 'draft',
  flyer_asset_path text NOT NULL,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id uuid UNIQUE REFERENCES editions(id) ON DELETE RESTRICT,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  summary text,
  description text,
  start_at timestamptz,
  end_at timestamptz,
  venue_label text,
  ticket_provider text NOT NULL DEFAULT 'eventcove',
  ticket_url text,
  visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','members_only','unlisted')),
  status publication_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE house_rules_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_label text NOT NULL UNIQUE,
  content text NOT NULL,
  effective_at timestamptz NOT NULL,
  published_by uuid REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE application_rule_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE RESTRICT,
  rules_version_id uuid NOT NULL REFERENCES house_rules_versions(id) ON DELETE RESTRICT,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(application_id,rules_version_id)
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  type_code text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  destination_path text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notifications_recipient_read_created_idx ON notifications(recipient_profile_id,read_at,created_at DESC);

CREATE TABLE audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_profile_id uuid REFERENCES profiles(id) ON DELETE RESTRICT,
  action_code text NOT NULL,
  target_type text NOT NULL,
  target_id uuid,
  reason_code text,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  request_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_events_target_created_idx ON audit_events(target_type,target_id,created_at DESC);

-- Security TODO before production:
-- 1. Enable RLS and add policies for every table.
-- 2. Restrict writes to verification statuses, roles, memberships and application decisions to server-side privileged functions.
-- 3. Add transaction-safe approval procedure requiring a verified 21+ result and a valid vouch OR authorised referral waiver.
-- 4. Add protections against removing the last active Super Admin.
-- 5. Ensure logs never include raw DOB, NIN/BVN, ID images, access tokens or provider payloads.
-- 6. Confirm auth identity mapping before creating profiles and define retention/deletion jobs.
