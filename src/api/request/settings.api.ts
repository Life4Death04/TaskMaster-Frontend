import api from '@/lib/axios';
import type { Settings, UpdateSettingsDto } from '@/types';

// API Endpoints
const ENDPOINTS = {
  SETTINGS: '/settings',
};

/**
 * Fetch user settings
 */
export const fetchSettingsAPI = async (): Promise<Settings> => {
  const response = await api.get<{ settings: Settings }>(ENDPOINTS.SETTINGS);

  if (!response.data.settings) {
    throw new Error('Settings not found');
  }

  return response.data.settings;
};

/**
 * Update user settings
 */
export const updateSettingsAPI = async (
  data: UpdateSettingsDto
): Promise<Settings> => {
  const response = await api.put<{ settings: Settings }>(
    ENDPOINTS.SETTINGS,
    data
  );

  if (!response.data.settings) {
    throw new Error('Failed to update settings');
  }

  return response.data.settings;
};
