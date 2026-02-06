export type ScreeningStatus = 'not_started' | 'in_progress' | 'complete' | 'declined' | 'expired';

export type YesNoAnswer = 'yes' | 'no';
export type SafetyAnswer = 'yes' | 'no' | 'prefer_not_to_answer';
export type RefugeeAnswer = 'yes' | 'no' | 'prefer_not_to_answer' | null;

export interface ScreeningAnswers {
    q1: YesNoAnswer | null; // Housing instability (past 12 months)
    q2: YesNoAnswer | null; // Housing instability (next 2 months)
    q3: YesNoAnswer | null; // Food insecurity
    q4: YesNoAnswer | null; // Transportation barriers
    q5: YesNoAnswer | null; // Utilities shut-off (past 12 months)
    q6: YesNoAnswer | null; // Utilities shut-off (next 2 months)
    q7: SafetyAnswer | null; // Safety
    q8: SafetyAnswer | null; // Interpersonal violence
    q9: RefugeeAnswer; // Refugee/immigration status (optional)
    q10: YesNoAnswer | null; // Resource assistance
}

export interface Demographics {
    dob: string | null; // MM/DD/YYYY format
    age: number | null; // Alternative to DOB
    race: string | null;
    ethnicity: 'hispanic' | 'not_hispanic' | null;
    preferred_language: string | null;
    zip: string | null; // 5 digits
}

export interface ClinicInfo {
    clinic_name: string;
    clinic_logo_url?: string;
    patient_first_name?: string;
    language_preference?: string;
}

export interface ScreeningState {
    status: ScreeningStatus;
    answers: ScreeningAnswers;
    demographics: Demographics;
    token_expires_at: string; // ISO date string
}

export interface ScreeningResponse {
    clinic_info: ClinicInfo;
    screening_state: ScreeningState;
}

export interface UpdateScreeningPayload {
    answers?: Partial<ScreeningAnswers>;
    demographics?: Partial<Demographics>;
}

export interface SubmitScreeningResponse {
    success: boolean;
    missing_fields?: string[];
    message?: string;
}

// Race options (OMB categories)
export const RACE_OPTIONS = [
    { value: 'american_indian_alaska_native', label: 'American Indian or Alaska Native' },
    { value: 'asian', label: 'Asian' },
    { value: 'black_african_american', label: 'Black or African American' },
    { value: 'native_hawaiian_pacific_islander', label: 'Native Hawaiian or Other Pacific Islander' },
    { value: 'white', label: 'White' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_answer', label: 'Prefer not to answer' },
] as const;

// Language options
export const LANGUAGE_OPTIONS = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'zh', label: 'Chinese (Simplified)' },
    { value: 'ru', label: 'Russian' },
    { value: 'bn', label: 'Bengali' },
] as const;
