import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScreening } from '../contexts/ScreeningContext';
import { screeningAPI } from '../api/screening';
import { mockAPI } from '../api/mockAPI';
import { loadScreeningData } from '../utils/localStorage';
import { LoadingState } from '../components/LoadingState';
import { ErrorScreen } from '../components/ErrorScreen';
import { LanguageSelector } from '../components/LanguageSelector';
import { QuestionPage } from './QuestionPage';
import { DemographicsPage } from './DemographicsPage';
import { ReviewPage } from './ReviewPage';
import { ConfirmationScreen } from '../components/ConfirmationScreen';

export function ScreeningPage() {
    const { token } = useParams<{ token: string }>();
    const { i18n } = useTranslation();
    const { initializeScreening, currentQuestion } = useScreening();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<{ type: 'invalid' | 'expired' | 'declined' | 'network'; message?: string } | null>(null);
    const [currentView, setCurrentView] = useState<'questions' | 'demographics' | 'review' | 'complete'>('questions');

    useEffect(() => {
        if (!token) {
            setError({ type: 'invalid' });
            setIsLoading(false);
            return;
        }

        loadScreening();
    }, [token]);

    const loadScreening = async () => {
        if (!token) return;

        try {
            setIsLoading(true);

            // Check if this is demo mode
            const isDemoMode = token === 'demo-token-12345';
            const api = isDemoMode ? mockAPI : screeningAPI;

            // Fetch screening data from backend (or mock in demo mode)
            const response = await api.getScreening(token);

            // Check token expiration
            const expiresAt = new Date(response.screening_state.token_expires_at);
            if (expiresAt < new Date()) {
                setError({ type: 'expired' });
                setIsLoading(false);
                return;
            }

            // Check status
            if (response.screening_state.status === 'declined') {
                setError({ type: 'declined' });
                setIsLoading(false);
                return;
            }

            if (response.screening_state.status === 'complete') {
                setCurrentView('complete');
            }

            // Load from localStorage and merge with backend data
            const localData = loadScreeningData(token);
            const mergedAnswers = {
                ...localData?.answers,
                ...response.screening_state.answers,
            };
            const mergedDemographics = {
                ...localData?.demographics,
                ...response.screening_state.demographics,
            };

            // Initialize screening context
            initializeScreening(
                token,
                response.clinic_info,
                mergedAnswers,
                mergedDemographics,
                response.screening_state.status
            );

            // Set language preference if provided
            if (response.clinic_info.language_preference) {
                i18n.changeLanguage(response.clinic_info.language_preference);
            }

            setIsLoading(false);
        } catch (err: any) {
            console.error('Failed to load screening:', err);
            if (err.message === 'INVALID_TOKEN') {
                setError({ type: 'invalid' });
            } else {
                setError({ type: 'network' });
            }
            setIsLoading(false);
        }
    };

    const handleQuestionComplete = () => {
        if (currentQuestion === 10) {
            setCurrentView('demographics');
        }
    };

    const handleDemographicsComplete = () => {
        setCurrentView('review');
    };

    const handleSubmitComplete = () => {
        setCurrentView('complete');
    };

    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorScreen type={error.type} message={error.message} />;
    }

    if (currentView === 'complete') {
        return (
            <>
                <LanguageSelector />
                <ConfirmationScreen />
            </>
        );
    }

    if (currentView === 'review') {
        return (
            <>
                <LanguageSelector />
                <ReviewPage
                    onEdit={(section: 'question' | 'demographics') => {
                        if (section === 'question') {
                            setCurrentView('questions');
                        } else {
                            setCurrentView('demographics');
                        }
                    }}
                    onSubmitComplete={handleSubmitComplete}
                />
            </>
        );
    }

    if (currentView === 'demographics') {
        return (
            <>
                <LanguageSelector />
                <DemographicsPage onComplete={handleDemographicsComplete} />
            </>
        );
    }

    return (
        <>
            <LanguageSelector />
            <QuestionPage onComplete={handleQuestionComplete} />
        </>
    );
}
