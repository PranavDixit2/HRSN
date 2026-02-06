import { useTranslation } from 'react-i18next';

export function ConfirmationScreen() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-success-50 to-success-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                {/* Success icon */}
                <div className="w-20 h-20 bg-success-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    {t('confirmation.title')}
                </h1>

                {/* Message */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                    {t('confirmation.message')}
                </p>

                {/* Follow-up message */}
                <p className="text-sm text-gray-600 mb-6">
                    {t('confirmation.followUp')}
                </p>

                {/* Close message */}
                <p className="text-sm text-gray-500">
                    {t('confirmation.closeMessage')}
                </p>
            </div>
        </div>
    );
}
