import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { questionsAPI, signAPI } from '@api/client';

export const useQuestionsByState = (state: string): UseQueryResult => {
  return useQuery({
    queryKey: ['questions', state],
    queryFn: () => questionsAPI.getByState(state),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useQuestionsByCategory = (
  state: string,
  category: string
): UseQueryResult => {
  return useQuery({
    queryKey: ['questions', state, category],
    queryFn: () => questionsAPI.getByCategory(state, category),
    staleTime: 1000 * 60 * 60,
  });
};

export const useSignIdentify = (): UseMutationResult => {
  return useMutation({
    mutationFn: (formData: FormData) => signAPI.identify(formData),
  });
};

export const useAllSigns = (): UseQueryResult => {
  return useQuery({
    queryKey: ['signs'],
    queryFn: () => signAPI.getAll(),
    staleTime: 1000 * 60 * 60,
  });
};

export const useSignsByCategory = (category: string): UseQueryResult => {
  return useQuery({
    queryKey: ['signs', category],
    queryFn: () => signAPI.getByCategory(category),
    staleTime: 1000 * 60 * 60,
  });
};
