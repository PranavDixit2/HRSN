import { useTranslation } from 'react-i18next';

interface NavigationButtonsProps {
    onBack?: () => void;
    onNext: () => void;
    showBack?: boolean;
    nextDisabled?: boolean;
    nextLabel?: string;
}

export function NavigationButtons({
    onBack,
    onNext,
    showBack = true,
    nextDisabled = false,
    nextLabel,
}: NavigationButtonsProps) {
    const { t } = useTranslation();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="flex gap-3 max-w-2xl mx-auto">
                {showBack && onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="btn-secondary flex-1"
                        aria-label={t('ui.back')}
                    >
                        {t('ui.back')}
                    </button>
                )}
                <button
                    type="button"
                    onClick={onNext}
                    disabled={nextDisabled}
                    className="btn-primary flex-1"
                    aria-label={nextLabel || t('ui.next')}
                >
                    {nextLabel || t('ui.next')}
                </button>
            </div>
        </div>
    );
}
