import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function DemoPage() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const handleStartDemo = () => {
        // Set language before starting
        i18n.changeLanguage(selectedLanguage);
        // Use a special demo token
        navigate('/s/demo-token-12345');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        {t('welcome.headline')}
                    </h1>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        {t('welcome.body')}
                    </p>
                    <p className="text-sm text-gray-600">
                        {t('welcome.privacy')}
                    </p>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                        Select Language
                    </label>
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                        <option value="en">English</option>
                        <option value="es">Español (Spanish)</option>
                        <option value="zh">中文 (Chinese)</option>
                        <option value="ru">Русский (Russian)</option>
                        <option value="bn">বাংলা (Bengali)</option>
                    </select>
                </div>

                <button
                    onClick={handleStartDemo}
                    className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150"
                >
                    {t('welcome.startButton')}
                </button>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> This is a demo mode with mock data. No real data will be saved.
                    </p>
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>In production, patients access via unique token URLs:</p>
                    <code className="block mt-2 text-xs bg-gray-100 p-2 rounded">
                        /s/&#123;token&#125;
                    </code>
                </div>
            </div>
        </div>
    );
}
