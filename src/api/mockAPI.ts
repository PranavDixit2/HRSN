import type {
    ScreeningResponse,
    UpdateScreeningPayload,
    SubmitScreeningResponse,
} from '../types/screening';

// Mock data for demo mode
const mockScreeningResponse: ScreeningResponse = {
    clinic_info: {
        clinic_name: 'Demo Health Clinic',
        clinic_logo_url: '',
        patient_first_name: 'Demo Patient',
        language_preference: 'en',
    },
    screening_state: {
        status: 'not_started',
        answers: {
            q1: null,
            q2: null,
            q3: null,
            q4: null,
            q5: null,
            q6: null,
            q7: null,
            q8: null,
            q9: null,
            q10: null,
        },
        demographics: {
            dob: null,
            age: null,
            race: null,
            ethnicity: null,
            preferred_language: null,
            zip: null,
        },
        token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    },
};

// In-memory storage for demo mode
let demoData = { ...mockScreeningResponse };

export const mockAPI = {
    getScreening: async (_token: string): Promise<ScreeningResponse> => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        console.log('[DEMO MODE] Loading screening data');
        return { ...demoData };
    },

    updateScreening: async (
        _token: string,
        payload: UpdateScreeningPayload
    ): Promise<void> => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 200));

        console.log('[DEMO MODE] Saving data:', payload);

        // Update in-memory data
        if (payload.answers) {
            demoData.screening_state.answers = {
                ...demoData.screening_state.answers,
                ...payload.answers,
            };
        }

        if (payload.demographics) {
            demoData.screening_state.demographics = {
                ...demoData.screening_state.demographics,
                ...payload.demographics,
            };
        }

        demoData.screening_state.status = 'in_progress';
    },

    submitScreening: async (_token: string): Promise<SubmitScreeningResponse> => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log('[DEMO MODE] Submitting screening');

        demoData.screening_state.status = 'complete';

        return {
            success: true,
            message: 'Demo screening submitted successfully!',
            missing_fields: [],
        };
    },

    resetDemo: () => {
        console.log('[DEMO MODE] Resetting demo data');
        demoData = JSON.parse(JSON.stringify(mockScreeningResponse));
    },
};
