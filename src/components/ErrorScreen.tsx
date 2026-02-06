import { useTranslation } from 'react-i18next';

interface ErrorScreenProps {
    type: 'invalid' | 'expired' | 'declined' | 'network';
    message?: string;
}

export function ErrorScreen({ type, message }: ErrorScreenProps) {
    const { t } = useTranslation();

    const getErrorMessage = () => {
        if (message) return message;

        switch (type) {
            case 'invalid':
                return t('errors.invalidToken');
            case 'expired':
                return t('errors.expiredToken');
            case 'declined':
                return t('errors.declinedScreening');
            case 'network':
                return t('errors.networkError');
            default:
                return t('errors.networkError');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-8 h-8 text-error-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {type === 'network' ? 'Connection Error' : 'Unable to Load Screening'}
                </h1>
                <p className="text-gray-600 leading-relaxed">{getErrorMessage()}</p>
            </div>
        </div>
    );
}
