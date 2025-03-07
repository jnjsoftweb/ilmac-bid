import { Suspense } from 'react';
import { getClient } from '@/lib/apollo';
import { gql } from '@apollo/client';
import BidTable from '@/components/notices/BidTable';
import BidTableSkeleton from '@/components/notices/BidTableSkeleton';
import { Metadata } from 'next';

interface PageProps {
  params: {
    categoryType: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

const GET_CATEGORY_NOTICES = gql`
  query GetCategoryNotices($category: String!) {
    notices(category: $category) {
      nid
      title
      organization
      createdAt
      detailUrl
      region
      registration
    }
  }
`;

const GET_CATEGORY_INFO = gql`
  query GetCategoryInfo($categoryType: String!) {
    categoryKeywords(categoryType: $categoryType) {
      categoryType
      keywords
      nots
      minPoint
      orgNames
    }
  }
`;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const categoryType = decodeURIComponent(params.categoryType);

  const { data } = await getClient().query({
    query: GET_CATEGORY_INFO,
    variables: {
      categoryType,
    },
  });

  const categoryInfo = data.categoryKeywords;
  const title = categoryInfo ? `${categoryInfo.categoryType} 입찰공고` : '입찰공고';

  return {
    title: `${title} | ILMAC BID`,
    description: `${title} 목록입니다.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const categoryType = decodeURIComponent(params.categoryType);

  const { data } = await getClient().query({
    query: GET_CATEGORY_NOTICES,
    variables: {
      category: categoryType,
    },
  });

  const { data: categoryData } = await getClient().query({
    query: GET_CATEGORY_INFO,
    variables: {
      categoryType,
    },
  });

  const categoryInfo = categoryData.categoryKeywords;
  const title = categoryInfo ? `${categoryInfo.categoryType} 입찰공고` : '입찰공고';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      {/* {categoryInfo && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">검색어:</span> {categoryInfo.keywords.join(', ')}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">제외어:</span> {categoryInfo.nots.join(', ')}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">최소점수:</span> {categoryInfo.minPoint}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">적용기관:</span> {categoryInfo.orgNames.join(', ')}
          </p>
        </div>
      )} */}
      <Suspense fallback={<BidTableSkeleton />}>
        <BidTable notices={data.notices} />
      </Suspense>
    </div>
  );
}
