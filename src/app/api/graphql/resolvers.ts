import { fetchAllNotices, fetchNoticesByCategory, getCategoryKeywords } from '@/lib/api/notices';

interface NoticeArgs {
  category: string;
  startDate?: string;
}

interface AllNoticesArgs {
  limit: number;
}

export const resolvers = {
  Query: {
    notices: async (_, { category }) => {
      return await fetchNoticesByCategory(category);
    },
    allNotices: async (_, { limit }) => {
      return await fetchAllNotices(limit);
    },
    categoryKeywords: async (_, { categoryType }) => {
      return await getCategoryKeywords(categoryType);
    },
  },
};
