import axios, { type AxiosInstance, AxiosError } from 'axios';
import type {
    ScreeningResponse,
    UpdateScreeningPayload,
    SubmitScreeningResponse,
} from '../types/screening';

class ScreeningAPI {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        });

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response) {
                    // Server responded with error status
                    console.error('API Error:', error.response.status, error.response.data);
                } else if (error.request) {
                    // Request made but no response
                    console.error('Network Error:', error.message);
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Get screening state by token
     */
    async getScreening(token: string): Promise<ScreeningResponse> {
        try {
            const response = await this.client.get<ScreeningResponse>(
                `/public/screening/${token}`
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                throw new Error('INVALID_TOKEN');
            }
            throw error;
        }
    }

    /**
     * Update screening (autosave)
     * Implements retry logic for network failures
     */
    async updateScreening(
        token: string,
        payload: UpdateScreeningPayload,
        retryCount = 0
    ): Promise<void> {
        const MAX_RETRIES = 3;
        const RETRY_DELAY = 1000; // 1 second

        try {
            await this.client.patch(`/public/screening/${token}`, payload);
        } catch (error) {
            if (retryCount < MAX_RETRIES) {
                // Wait before retrying
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
                return this.updateScreening(token, payload, retryCount + 1);
            }
            // All retries failed
            console.error('Autosave failed after', MAX_RETRIES, 'attempts');
            throw error;
        }
    }

    /**
     * Submit screening (final submission)
     */
    async submitScreening(token: string): Promise<SubmitScreeningResponse> {
        try {
            const response = await this.client.post<SubmitScreeningResponse>(
                `/public/screening/${token}/submit`
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                return error.response.data as SubmitScreeningResponse;
            }
            throw error;
        }
    }
}

// Export singleton instance
export const screeningAPI = new ScreeningAPI();
