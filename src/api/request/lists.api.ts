import api from '@/lib/axios';
import type { List, CreateListDto, UpdateListDto } from '@/types';

// API Endpoints
const ENDPOINTS = {
  LISTS: '/lists',
  LIST_BY_ID: (id: number) => `/lists/${id}`,
};

/**
 * Fetch all lists for authenticated user
 */
export const fetchListsAPI = async (): Promise<List[]> => {
  const response = await api.get<{ lists: List[] }>(ENDPOINTS.LISTS);
  return response.data.lists || [];
};

/**
 * Get a single list by ID with tasks
 */
export const getListByIdAPI = async (listId: number): Promise<List> => {
  const response = await api.get<{ list: List }>(ENDPOINTS.LIST_BY_ID(listId));

  if (!response.data.list) {
    throw new Error('List not found');
  }

  return response.data.list;
};

/**
 * Create a new list
 */
export const createListAPI = async (data: CreateListDto): Promise<List> => {
  const response = await api.post<{ list: List }>(ENDPOINTS.LISTS, data);

  if (!response.data.list) {
    throw new Error('Failed to create list');
  }

  return response.data.list;
};

/**
 * Update an existing list
 */
export const updateListAPI = async (params: {
  id: number;
  data: UpdateListDto;
}): Promise<List> => {
  const { id, data } = params;
  const response = await api.put<{ list: List }>(
    ENDPOINTS.LIST_BY_ID(id),
    data
  );

  if (!response.data.list) {
    throw new Error('Failed to update list');
  }

  return response.data.list;
};

/**
 * Delete a list
 */
export const deleteListAPI = async (listId: number): Promise<void> => {
  await api.delete(ENDPOINTS.LIST_BY_ID(listId));
};
