import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type {
    ScreeningAnswers,
    Demographics,
    ClinicInfo,
    ScreeningStatus,
    YesNoAnswer,
    SafetyAnswer,
    RefugeeAnswer,
} from '../types/screening';
import { saveScreeningData } from '../utils/localStorage';
import { screeningAPI } from '../api/screening';
import { mockAPI } from '../api/mockAPI';

interface ScreeningContextType {
    // State
    token: string | null;
    clinicInfo: ClinicInfo | null;
    answers: Partial<ScreeningAnswers>;
    demographics: Partial<Demographics>;
    status: ScreeningStatus;
    currentQuestion: number;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;

    // Actions
    setToken: (token: string) => void;
    setClinicInfo: (info: ClinicInfo) => void;
    setStatus: (status: ScreeningStatus) => void;
    updateAnswer: (questionId: keyof ScreeningAnswers, value: YesNoAnswer | SafetyAnswer | RefugeeAnswer) => Promise<void>;
    updateDemographics: (data: Partial<Demographics>) => Promise<void>;
    goToQuestion: (questionNumber: number) => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
    setError: (error: string | null) => void;
    initializeScreening: (
        token: string,
        clinicInfo: ClinicInfo,
        answers: Partial<ScreeningAnswers>,
        demographics: Partial<Demographics>,
        status: ScreeningStatus
    ) => void;
}

const ScreeningContext = createContext<ScreeningContextType | undefined>(undefined);

export function ScreeningProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [clinicInfo, setClinicInfo] = useState<ClinicInfo | null>(null);
    const [answers, setAnswers] = useState<Partial<ScreeningAnswers>>({});
    const [demographics, setDemographics] = useState<Partial<Demographics>>({});
    const [status, setStatus] = useState<ScreeningStatus>('not_started');
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [isLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initializeScreening = useCallback(
        (
            newToken: string,
            newClinicInfo: ClinicInfo,
            newAnswers: Partial<ScreeningAnswers>,
            newDemographics: Partial<Demographics>,
            newStatus: ScreeningStatus
        ) => {
            setToken(newToken);
            setClinicInfo(newClinicInfo);
            setAnswers(newAnswers);
            setDemographics(newDemographics);
            setStatus(newStatus);
        },
        []
    );

    const updateAnswer = useCallback(
        async (questionId: keyof ScreeningAnswers, value: YesNoAnswer | SafetyAnswer | RefugeeAnswer) => {
            if (!token) return;

            const updatedAnswers = { ...answers, [questionId]: value };
            setAnswers(updatedAnswers);

            // Save to localStorage immediately
            saveScreeningData(token, updatedAnswers, demographics);

            // Autosave to backend
            setIsSaving(true);
            try {
                const api = token === 'demo-token-12345' ? mockAPI : screeningAPI;
                await api.updateScreening(token, { answers: updatedAnswers });
            } catch (error) {
                console.error('Autosave failed:', error);
                // Don't block user flow on autosave failure
            } finally {
                setIsSaving(false);
            }
        },
        [token, answers, demographics]
    );

    const updateDemographics = useCallback(
        async (data: Partial<Demographics>) => {
            if (!token) return;

            const updatedDemographics = { ...demographics, ...data };
            setDemographics(updatedDemographics);

            // Save to localStorage immediately
            saveScreeningData(token, answers, updatedDemographics);

            // Autosave to backend
            setIsSaving(true);
            try {
                const api = token === 'demo-token-12345' ? mockAPI : screeningAPI;
                await api.updateScreening(token, { demographics: updatedDemographics });
            } catch (error) {
                console.error('Autosave failed:', error);
            } finally {
                setIsSaving(false);
            }
        },
        [token, answers, demographics]
    );

    const goToQuestion = useCallback((questionNumber: number) => {
        setCurrentQuestion(questionNumber);
    }, []);

    const nextQuestion = useCallback(() => {
        setCurrentQuestion((prev) => Math.min(prev + 1, 10));
    }, []);

    const previousQuestion = useCallback(() => {
        setCurrentQuestion((prev) => Math.max(prev - 1, 1));
    }, []);

    const value: ScreeningContextType = {
        token,
        clinicInfo,
        answers,
        demographics,
        status,
        currentQuestion,
        isLoading,
        isSaving,
        error,
        setToken,
        setClinicInfo,
        setStatus,
        updateAnswer,
        updateDemographics,
        goToQuestion,
        nextQuestion,
        previousQuestion,
        setError,
        initializeScreening,
    };

    return <ScreeningContext.Provider value={value}>{children}</ScreeningContext.Provider>;
}

export function useScreening() {
    const context = useContext(ScreeningContext);
    if (context === undefined) {
        throw new Error('useScreening must be used within a ScreeningProvider');
    }
    return context;
}
