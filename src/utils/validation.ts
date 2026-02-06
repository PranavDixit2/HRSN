import type { ScreeningAnswers, Demographics } from '../types/screening';

/**
 * Check if all required questions are answered
 */
export function areQuestionsComplete(answers: Partial<ScreeningAnswers>): boolean {
    // Q1-Q8 and Q10 are required
    // Q9 is optional
    return !!(
        answers.q1 &&
        answers.q2 &&
        answers.q3 &&
        answers.q4 &&
        answers.q5 &&
        answers.q6 &&
        answers.q7 &&
        answers.q8 &&
        answers.q10
    );
}

/**
 * Check if demographics are complete
 */
export function areDemographicsComplete(demographics: Partial<Demographics>): boolean {
    // Must have either DOB or age
    const hasAge = !!(demographics.dob || demographics.age);

    return !!(
        hasAge &&
        demographics.race &&
        demographics.ethnicity &&
        demographics.preferred_language &&
        demographics.zip &&
        isValidZip(demographics.zip)
    );
}

/**
 * Check if entire screening is complete
 */
export function isScreeningComplete(
    answers: Partial<ScreeningAnswers>,
    demographics: Partial<Demographics>
): boolean {
    return areQuestionsComplete(answers) && areDemographicsComplete(demographics);
}

/**
 * Validate ZIP code (5 digits)
 */
export function isValidZip(zip: string): boolean {
    return /^\d{5}$/.test(zip);
}

/**
 * Validate date of birth (MM/DD/YYYY)
 */
export function isValidDOB(dob: string): boolean {
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!regex.test(dob)) return false;

    // Check if it's a valid date
    const [month, day, year] = dob.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day &&
        date <= new Date() // Can't be in the future
    );
}

/**
 * Get list of missing required fields
 */
export function getMissingFields(
    answers: Partial<ScreeningAnswers>,
    demographics: Partial<Demographics>
): string[] {
    const missing: string[] = [];

    // Check questions
    if (!answers.q1) missing.push('Question 1 (Housing instability - past 12 months)');
    if (!answers.q2) missing.push('Question 2 (Housing instability - next 2 months)');
    if (!answers.q3) missing.push('Question 3 (Food insecurity)');
    if (!answers.q4) missing.push('Question 4 (Transportation barriers)');
    if (!answers.q5) missing.push('Question 5 (Utilities shut-off - past 12 months)');
    if (!answers.q6) missing.push('Question 6 (Utilities shut-off - next 2 months)');
    if (!answers.q7) missing.push('Question 7 (Safety)');
    if (!answers.q8) missing.push('Question 8 (Interpersonal violence)');
    if (!answers.q10) missing.push('Question 10 (Resource assistance)');

    // Check demographics
    if (!demographics.dob && !demographics.age) missing.push('Date of Birth or Age');
    if (!demographics.race) missing.push('Race');
    if (!demographics.ethnicity) missing.push('Ethnicity');
    if (!demographics.preferred_language) missing.push('Preferred Language');
    if (!demographics.zip) missing.push('ZIP Code');
    else if (!isValidZip(demographics.zip)) missing.push('Valid ZIP Code (5 digits)');

    return missing;
}

/**
 * Calculate progress percentage (0-100)
 */
export function calculateProgress(
    answers: Partial<ScreeningAnswers>,
    demographics: Partial<Demographics>
): number {
    let completed = 0;
    const total = 14; // 9 required questions + 5 demographics fields

    // Count answered questions (Q1-Q8, Q10)
    if (answers.q1) completed++;
    if (answers.q2) completed++;
    if (answers.q3) completed++;
    if (answers.q4) completed++;
    if (answers.q5) completed++;
    if (answers.q6) completed++;
    if (answers.q7) completed++;
    if (answers.q8) completed++;
    if (answers.q10) completed++;

    // Count demographics
    if (demographics.dob || demographics.age) completed++;
    if (demographics.race) completed++;
    if (demographics.ethnicity) completed++;
    if (demographics.preferred_language) completed++;
    if (demographics.zip && isValidZip(demographics.zip)) completed++;

    return Math.round((completed / total) * 100);
}
