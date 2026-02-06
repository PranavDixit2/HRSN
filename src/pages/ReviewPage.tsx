import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useScreening } from '../contexts/ScreeningContext';
import { ReviewSummary } from '../components/ReviewSummary';
import { screeningAPI } from '../api/screening';
import { mockAPI } from '../api/mockAPI';
import { clearScreeningData } from '../utils/localStorage';

interface ReviewPageProps {
    onEdit: (section: 'question' | 'demographics', questionNumber?: number) => void;
    onSubmitComplete: () => void;
}

export function ReviewPage({ onEdit, onSubmitComplete }: ReviewPageProps) {
    const { t } = useTranslation();
    const { token } = useScreening();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!token) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const api = token === 'demo-token-12345' ? mockAPI : screeningAPI;
            const response = await api.submitScreening(token);

            if (response.success) {
                // Clear localStorage on successful submission
                clearScreeningData(token);
                onSubmitComplete();
            } else {
                // Show missing fields error
                if (response.missing_fields && response.missing_fields.length > 0) {
                    setSubmitError(
                        `${t('review.missingFields')} ${response.missing_fields.join(', ')}`
                    );
                } else {
                    setSubmitError(response.message || t('errors.submitError'));
                }
            }
        } catch (error) {
            console.error('Submit failed:', error);
            setSubmitError(t('errors.submitError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {submitError && (
                <div className="bg-error-50 border-l-4 border-error-500 p-4 mb-4">
                    <p className="text-error-800 font-medium">{submitError}</p>
                </div>
            )}

            <ReviewSummary
                onEdit={onEdit}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
