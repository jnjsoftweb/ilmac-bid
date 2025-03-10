import { Suspense } from 'react';
import { getClient } from '@/lib/apollo';
import { gql } from '@apollo/client';
import BidTable from '@/components/notices/BidTable';
import BidTableSkeleton from '@/components/notices/BidTableSkeleton';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    limit: string;
  }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

const GET_ALL_NOTICES = gql`
  query GetAllNotices($limit: Int!) {
    allNotices(limit: $limit) {
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { limit } = await params;

  return {
    title: `최근 ${limit}개 입찰공고 | ILMAC BID`,
    description: `최근 등록된 ${limit}개의 입찰공고 목록입니다.`,
  };
}

export default async function AllNoticesPage({ params }: PageProps) {
  const { limit } = await params;
  const limitNumber = parseInt(limit, 10);

  const { data } = await getClient().query({
    query: GET_ALL_NOTICES,
    variables: {
      limit: limitNumber,
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">최근 {limit}개 입찰공고</h1>
      <Suspense fallback={<BidTableSkeleton />}>
        <BidTable notices={data.allNotices} />
      </Suspense>
    </div>
  );
}
