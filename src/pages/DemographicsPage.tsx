import { useTranslation } from 'react-i18next';
import { useScreening } from '../contexts/ScreeningContext';
import { DemographicsForm } from '../components/DemographicsForm';
import { NavigationButtons } from '../components/NavigationButtons';
import { areDemographicsComplete } from '../utils/validation';

interface DemographicsPageProps {
    onComplete: () => void;
}

export function DemographicsPage({ onComplete }: DemographicsPageProps) {
    const { t } = useTranslation();
    const { demographics, goToQuestion } = useScreening();

    const isComplete = areDemographicsComplete(demographics);

    const handleBack = () => {
        goToQuestion(10); // Go back to last question
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Almost done message */}
                <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-6">
                    <p className="text-success-800 font-medium text-center">
                        {t('ui.progressAlmostDone')}
                    </p>
                </div>

                <DemographicsForm />
            </div>

            <NavigationButtons
                onBack={handleBack}
                onNext={onComplete}
                showBack={true}
                nextDisabled={!isComplete}
                nextLabel={t('ui.continue')}
            />
        </div>
    );
}
