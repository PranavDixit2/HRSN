import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useScreening } from '../contexts/ScreeningContext';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { QuestionCard } from '../components/QuestionCard';
import { NavigationButtons } from '../components/NavigationButtons';
import { PrivacyInterstitial } from '../components/PrivacyInterstitial';
import type { YesNoAnswer, SafetyAnswer, RefugeeAnswer } from '../types/screening';

interface QuestionPageProps {
    onComplete: () => void;
}

export function QuestionPage({ onComplete }: QuestionPageProps) {
    const { t } = useTranslation();
    const { currentQuestion, answers, updateAnswer, nextQuestion, previousQuestion } = useScreening();

    const [showPrivacyInterstitial, setShowPrivacyInterstitial] = useState(false);

    useEffect(() => {
        // Show privacy interstitial before Q7 if not already shown
        if (currentQuestion === 7 && !answers.q7) {
            setShowPrivacyInterstitial(true);
        }
    }, [currentQuestion, answers.q7]);

    const getCurrentQuestionData = () => {
        const questionId = `q${currentQuestion}` as keyof typeof answers;
        const questionText = t(`questions.${questionId}`);

        let options;
        if (currentQuestion === 7 || currentQuestion === 8 || currentQuestion === 9) {
            // Questions with "Prefer not to answer" option
            options = [
                { value: 'yes', label: t('options.yes') },
                { value: 'no', label: t('options.no') },
                { value: 'prefer_not_to_answer', label: t('options.preferNotToAnswer') },
            ];
        } else {
            // Yes/No questions
            options = [
                { value: 'yes', label: t('options.yes') },
                { value: 'no', label: t('options.no') },
            ];
        }

        const value = answers[questionId];
        const isOptional = currentQuestion === 9; // Q9 is optional
        const showBenefitsNote = currentQuestion >= 1 && currentQuestion <= 4; // Q1-Q4 (housing, food, transportation, utilities)
        const showSensitiveNote = currentQuestion === 7 || currentQuestion === 8; // Q7-Q8

        return { questionId, questionText, options, value, isOptional, showBenefitsNote, showSensitiveNote };
    };

    const handleAnswerChange = async (value: YesNoAnswer | SafetyAnswer | RefugeeAnswer) => {
        const questionId = `q${currentQuestion}` as keyof typeof answers;
        await updateAnswer(questionId, value);
    };

    const handleNext = () => {
        if (currentQuestion === 10) {
            onComplete();
        } else {
            nextQuestion();
        }
    };

    const handleBack = () => {
        if (currentQuestion > 1) {
            previousQuestion();
        }
    };

    if (showPrivacyInterstitial) {
        return (
            <PrivacyInterstitial
                onContinue={() => setShowPrivacyInterstitial(false)}
            />
        );
    }

    const { questionId, questionText, options, value, isOptional, showBenefitsNote, showSensitiveNote } = getCurrentQuestionData();
    const isAnswered = value !== null && value !== undefined;

    // Milestone message
    const getMilestoneMessage = () => {
        if (currentQuestion === 3) {
            return t('ui.progressMilestone');
        }
        return null;
    };

    const milestoneMessage = getMilestoneMessage();

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <ProgressIndicator />

            {milestoneMessage && (
                <div className="max-w-2xl mx-auto px-4 py-2">
                    <p className="text-sm text-success-600 font-medium text-center">
                        {milestoneMessage}
                    </p>
                </div>
            )}

            <div className="flex items-center justify-center px-4 py-8">
                <QuestionCard
                    questionId={questionId}
                    questionText={questionText}
                    options={options}
                    value={value ?? null}
                    onChange={handleAnswerChange}
                    optional={isOptional}
                    showBenefitsNote={showBenefitsNote}
                    showSensitiveNote={showSensitiveNote}
                />
            </div>

            <NavigationButtons
                onBack={currentQuestion > 1 ? handleBack : undefined}
                onNext={handleNext}
                showBack={currentQuestion > 1}
                nextDisabled={!isAnswered && !isOptional}
                nextLabel={currentQuestion === 10 ? t('ui.continue') : t('ui.next')}
            />
        </div>
    );
}
