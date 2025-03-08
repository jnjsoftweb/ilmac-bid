import { fetchAllNotices, getNoticesByCategory, getCategoryKeywords } from '@/lib/api/notices';

interface CategoryArgs {
  categoryType: string;
}

interface NoticesArgs {
  category: string;
}

interface AllNoticesArgs {
  limit: number;
}

export const resolvers = {
  Query: {
    notices: async (_parent: unknown, { category }: NoticesArgs) => {
      return await getNoticesByCategory(category);
    },
    allNotices: async (_parent: unknown, { limit }: AllNoticesArgs) => {
      return await fetchAllNotices(limit);
    },
    categoryKeywords: async (_parent: unknown, { categoryType }: CategoryArgs) => {
      return await getCategoryKeywords(categoryType);
    },
  },
};
