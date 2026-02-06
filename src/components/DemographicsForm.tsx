import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useScreening } from '../contexts/ScreeningContext';
import { RACE_OPTIONS, LANGUAGE_OPTIONS } from '../types/screening';
import { isValidZip, isValidDOB } from '../utils/validation';

export function DemographicsForm() {
    const { t } = useTranslation();
    const { demographics, updateDemographics } = useScreening();

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: string) => {
        // Clear error for this field
        setErrors((prev) => ({ ...prev, [field]: '' }));

        // Update demographics
        updateDemographics({ [field]: value });
    };

    const validateField = (field: string, value: string | null | undefined): string => {
        if (!value) {
            return t('validation.required');
        }

        if (field === 'zip' && !isValidZip(value)) {
            return t('validation.invalidZip');
        }

        if (field === 'dob' && !isValidDOB(value)) {
            return t('validation.invalidDOB');
        }

        return '';
    };

    const handleBlur = (field: string) => {
        const value = demographics[field as keyof typeof demographics];
        const error = validateField(field, value as string);
        if (error) {
            setErrors((prev) => ({ ...prev, [field]: error }));
        }
    };

    return (
        <div className="question-card">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('demographics.title')}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
                {t('demographics.intro')}
            </p>

            <div className="space-y-5">
                {/* Date of Birth */}
                <div>
                    <label htmlFor="dob" className="label-text">
                        {t('demographics.dob')}
                    </label>
                    <input
                        type="text"
                        id="dob"
                        placeholder={t('demographics.dobPlaceholder')}
                        value={demographics.dob || ''}
                        onChange={(e) => handleChange('dob', e.target.value)}
                        onBlur={() => handleBlur('dob')}
                        className={`input-field ${errors.dob ? 'border-error-500' : ''}`}
                        maxLength={10}
                        aria-required="true"
                        aria-invalid={!!errors.dob}
                        aria-describedby={errors.dob ? 'dob-error' : undefined}
                    />
                    {errors.dob && (
                        <p id="dob-error" className="error-text">
                            {errors.dob}
                        </p>
                    )}
                </div>

                {/* Race */}
                <div>
                    <label htmlFor="race" className="label-text">
                        {t('demographics.race')}
                    </label>
                    <select
                        id="race"
                        value={demographics.race || ''}
                        onChange={(e) => handleChange('race', e.target.value)}
                        onBlur={() => handleBlur('race')}
                        className={`input-field ${errors.race ? 'border-error-500' : ''}`}
                        aria-required="true"
                        aria-invalid={!!errors.race}
                    >
                        <option value="">Select...</option>
                        {RACE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {t(`race.${option.value}`)}
                            </option>
                        ))}
                    </select>
                    {errors.race && <p className="error-text">{errors.race}</p>}
                </div>

                {/* Ethnicity */}
                <div>
                    <label htmlFor="ethnicity" className="label-text">
                        {t('demographics.ethnicity')}
                    </label>
                    <select
                        id="ethnicity"
                        value={demographics.ethnicity || ''}
                        onChange={(e) => handleChange('ethnicity', e.target.value)}
                        onBlur={() => handleBlur('ethnicity')}
                        className={`input-field ${errors.ethnicity ? 'border-error-500' : ''}`}
                        aria-required="true"
                        aria-invalid={!!errors.ethnicity}
                    >
                        <option value="">Select...</option>
                        <option value="hispanic">{t('demographics.ethnicityHispanic')}</option>
                        <option value="not_hispanic">{t('demographics.ethnicityNotHispanic')}</option>
                    </select>
                    {errors.ethnicity && <p className="error-text">{errors.ethnicity}</p>}
                </div>

                {/* Preferred Language */}
                <div>
                    <label htmlFor="preferred_language" className="label-text">
                        {t('demographics.preferredLanguage')}
                    </label>
                    <select
                        id="preferred_language"
                        value={demographics.preferred_language || ''}
                        onChange={(e) => handleChange('preferred_language', e.target.value)}
                        onBlur={() => handleBlur('preferred_language')}
                        className={`input-field ${errors.preferred_language ? 'border-error-500' : ''}`}
                        aria-required="true"
                        aria-invalid={!!errors.preferred_language}
                    >
                        <option value="">Select...</option>
                        {LANGUAGE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.preferred_language && <p className="error-text">{errors.preferred_language}</p>}
                </div>

                {/* ZIP Code */}
                <div>
                    <label htmlFor="zip" className="label-text">
                        {t('demographics.zip')}
                    </label>
                    <input
                        type="text"
                        id="zip"
                        placeholder={t('demographics.zipPlaceholder')}
                        value={demographics.zip || ''}
                        onChange={(e) => {
                            // Only allow digits
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 5) {
                                handleChange('zip', value);
                            }
                        }}
                        onBlur={() => handleBlur('zip')}
                        className={`input-field ${errors.zip ? 'border-error-500' : ''}`}
                        maxLength={5}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        aria-required="true"
                        aria-invalid={!!errors.zip}
                        aria-describedby={errors.zip ? 'zip-error' : 'zip-help'}
                    />
                    {!errors.zip && (
                        <p id="zip-help" className="text-xs text-gray-600 mt-1">
                            {t('demographics.zipHelp')}
                        </p>
                    )}
                    {errors.zip && (
                        <p id="zip-error" className="error-text">
                            {errors.zip}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
