import { useTranslation } from 'react-i18next';
import { useScreening } from '../contexts/ScreeningContext';
import { isScreeningComplete, getMissingFields } from '../utils/validation';

interface ReviewSummaryProps {
    onEdit: (section: 'question' | 'demographics', questionNumber?: number) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export function ReviewSummary({ onEdit, onSubmit, isSubmitting }: ReviewSummaryProps) {
    const { t } = useTranslation();
    const { answers, demographics } = useScreening();

    const isComplete = isScreeningComplete(answers, demographics);
    const missingFields = getMissingFields(answers, demographics);

    const getAnswerLabel = (value: string | null) => {
        if (!value) return '—';
        if (value === 'yes') return t('options.yes');
        if (value === 'no') return t('options.no');
        if (value === 'prefer_not_to_answer') return t('options.preferNotToAnswer');
        return value;
    };

    const questions = [
        { id: 'q1', number: 1 },
        { id: 'q2', number: 2 },
        { id: 'q3', number: 3 },
        { id: 'q4', number: 4 },
        { id: 'q5', number: 5 },
        { id: 'q6', number: 6 },
        { id: 'q7', number: 7 },
        { id: 'q8', number: 8 },
        { id: 'q9', number: 9 },
        { id: 'q10', number: 10 },
    ];

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {t('review.title')}
            </h1>

            {/* Screening Answers */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {t('review.screeningAnswers')}
                    </h2>
                    <button
                        onClick={() => onEdit('question', 1)}
                        className="text-primary-600 font-medium hover:text-primary-700"
                        aria-label={t('ui.edit')}
                    >
                        {t('ui.edit')}
                    </button>
                </div>

                <div className="space-y-3">
                    {questions.map((q) => {
                        const answer = answers[q.id as keyof typeof answers];
                        return (
                            <div key={q.id} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                                <span className="text-gray-700 font-medium">
                                    {t(`questions.${q.id}`).substring(0, 50)}...
                                </span>
                                <span className="text-gray-900 font-semibold ml-4">
                                    {getAnswerLabel(answer as string | null)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Demographics */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {t('review.demographics')}
                    </h2>
                    <button
                        onClick={() => onEdit('demographics')}
                        className="text-primary-600 font-medium hover:text-primary-700"
                        aria-label={t('ui.edit')}
                    >
                        {t('ui.edit')}
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-700 font-medium">{t('demographics.dob')}</span>
                        <span className="text-gray-900 font-semibold">{demographics.dob || '—'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-700 font-medium">{t('demographics.race')}</span>
                        <span className="text-gray-900 font-semibold">
                            {demographics.race ? t(`race.${demographics.race}`) : '—'}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-700 font-medium">{t('demographics.ethnicity')}</span>
                        <span className="text-gray-900 font-semibold">
                            {demographics.ethnicity === 'hispanic'
                                ? t('demographics.ethnicityHispanic')
                                : demographics.ethnicity === 'not_hispanic'
                                    ? t('demographics.ethnicityNotHispanic')
                                    : '—'}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-700 font-medium">{t('demographics.preferredLanguage')}</span>
                        <span className="text-gray-900 font-semibold">{demographics.preferred_language || '—'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-700 font-medium">{t('demographics.zip')}</span>
                        <span className="text-gray-900 font-semibold">{demographics.zip || '—'}</span>
                    </div>
                </div>
            </div>

            {/* Missing Fields Warning */}
            {!isComplete && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-4 mb-6">
                    <p className="text-error-800 font-medium mb-2">
                        {t('review.incompleteMessage')}
                    </p>
                    {missingFields.length > 0 && (
                        <div>
                            <p className="text-error-700 text-sm font-medium mb-1">
                                {t('review.missingFields')}
                            </p>
                            <ul className="list-disc list-inside text-error-700 text-sm space-y-1">
                                {missingFields.map((field, index) => (
                                    <li key={index}>{field}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Submit Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={onSubmit}
                        disabled={!isComplete || isSubmitting}
                        className="btn-primary w-full"
                        aria-label={t('review.submitButton')}
                    >
                        {isSubmitting ? t('ui.loading') : t('review.submitButton')}
                    </button>
                </div>
            </div>
        </div>
    );
}
