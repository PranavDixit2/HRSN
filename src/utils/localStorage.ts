import type { ScreeningAnswers, Demographics } from '../types/screening';

const STORAGE_PREFIX = 'screening_';

export interface LocalStorageData {
    answers: Partial<ScreeningAnswers>;
    demographics: Partial<Demographics>;
    lastUpdated: string;
}

/**
 * Save screening data to localStorage
 */
export function saveScreeningData(
    token: string,
    answers: Partial<ScreeningAnswers>,
    demographics: Partial<Demographics>
): void {
    try {
        const data: LocalStorageData = {
            answers,
            demographics,
            lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(`${STORAGE_PREFIX}${token}`, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

/**
 * Load screening data from localStorage
 */
export function loadScreeningData(token: string): LocalStorageData | null {
    try {
        const data = localStorage.getItem(`${STORAGE_PREFIX}${token}`);
        if (!data) return null;
        return JSON.parse(data) as LocalStorageData;
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
        return null;
    }
}

/**
 * Clear screening data from localStorage
 */
export function clearScreeningData(token: string): void {
    try {
        localStorage.removeItem(`${STORAGE_PREFIX}${token}`);
    } catch (error) {
        console.error('Failed to clear localStorage:', error);
    }
}

/**
 * Check if localStorage data exists for token
 */
export function hasLocalData(token: string): boolean {
    return localStorage.getItem(`${STORAGE_PREFIX}${token}`) !== null;
}
