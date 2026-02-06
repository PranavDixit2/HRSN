import { useTranslation } from 'react-i18next';
import type { YesNoAnswer, SafetyAnswer, RefugeeAnswer } from '../types/screening';

interface QuestionOption {
    value: string;
    label: string;
}

interface QuestionCardProps {
    questionId: string;
    questionText: string;
    options: QuestionOption[];
    value: YesNoAnswer | SafetyAnswer | RefugeeAnswer | null;
    onChange: (value: any) => void;
    optional?: boolean;
    showBenefitsNote?: boolean;
    showSensitiveNote?: boolean;
}

export function QuestionCard({
    questionId,
    questionText,
    options,
    value,
    onChange,
    optional = false,
    showBenefitsNote = false,
    showSensitiveNote = false,
}: QuestionCardProps) {
    const { t } = useTranslation();

    return (
        <div className="question-card">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 leading-relaxed">
                {questionText}
                {optional && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                        ({t('ui.optional')})
                    </span>
                )}
            </h2>

            {/* Support text under question */}
            <div className="mb-6 space-y-1">
                <p className="text-sm text-gray-600">
                    {t('questionSupport.general')}
                </p>
                {showBenefitsNote && (
                    <p className="text-sm text-gray-600">
                        {t('questionSupport.benefits')}
                    </p>
                )}
                {optional && (
                    <p className="text-sm text-gray-600">
                        {t('questionSupport.optional')}
                    </p>
                )}
            </div>

            <div className="space-y-3">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className={`radio-option ${value === option.value ? 'border-primary-600 bg-primary-100' : ''
                            }`}
                    >
                        <input
                            type="radio"
                            name={questionId}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className="sr-only"
                            aria-label={option.label}
                        />
                        <div className="flex items-center w-full">
                            <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${value === option.value
                                    ? 'border-primary-600 bg-primary-600'
                                    : 'border-gray-400'
                                    }`}
                            >
                                {value === option.value && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </div>
                            <span className="text-gray-900 font-medium">{option.label}</span>
                        </div>
                    </label>
                ))}
            </div>

            {/* Sensitive question reassurance */}
            {showSensitiveNote && (
                <p className="text-sm text-gray-600 mt-4">
                    {t('questionSupport.sensitiveSkip')}
                </p>
            )}
        </div>
    );
}
