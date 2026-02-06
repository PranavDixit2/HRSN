import { useTranslation } from 'react-i18next';
import { useScreening } from '../contexts/ScreeningContext';

export function ProgressIndicator() {
    const { t } = useTranslation();
    const { currentQuestion, isSaving } = useScreening();

    const totalQuestions = 10;
    const progress = (currentQuestion / totalQuestions) * 100;
    const remaining = totalQuestions - currentQuestion;

    // Dynamic progress message
    const getProgressMessage = () => {
        if (currentQuestion === 5) {
            return t('ui.progressHalfway');
        }
        if (remaining > 0) {
            return t('ui.progressRemaining', { remaining });
        }
        return t('ui.progress', { current: currentQuestion, total: totalQuestions });
    };

    return (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="max-w-2xl mx-auto">
                {/* Progress text */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                        {getProgressMessage()}
                    </span>
                    {isSaving && (
                        <span className="text-xs text-gray-500 animate-pulse">
                            {t('ui.saving')}
                        </span>
                    )}
                    {!isSaving && currentQuestion > 1 && (
                        <span className="text-xs text-success-600 transition-opacity duration-1000">
                            {t('ui.saved')}
                        </span>
                    )}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                        role="progressbar"
                        aria-valuenow={currentQuestion}
                        aria-valuemin={1}
                        aria-valuemax={totalQuestions}
                        aria-label={`Question ${currentQuestion} of ${totalQuestions}`}
                    />
                </div>
            </div>
        </div>
    );
}
