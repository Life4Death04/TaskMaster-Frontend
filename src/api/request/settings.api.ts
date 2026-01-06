import api from '@/lib/axios';
import type { Settings, UpdateSettingsDto, ApiResponse } from '@/types';

// API Endpoints
const ENDPOINTS = {
  SETTINGS: '/settings',
};

/**
 * Fetch user settings
 */
export const fetchSettingsAPI = async (): Promise<Settings> => {
  const response = await api.get<ApiResponse<{ settings: Settings }>>(
    ENDPOINTS.SETTINGS
  );

  if (!response.data.data?.settings) {
    throw new Error('Settings not found');
  }

  return response.data.data.settings;
};

/**
 * Update user settings
 */
export const updateSettingsAPI = async (
  data: UpdateSettingsDto
): Promise<Settings> => {
  const response = await api.put<ApiResponse<{ settings: Settings }>>(
    ENDPOINTS.SETTINGS,
    data
  );

  if (!response.data.data?.settings) {
    throw new Error('Failed to update settings');
  }

  return response.data.data.settings;
};
