import { Suspense } from 'react';
import BidTable from '@/components/notices/BidTable';
import BidTableSkeleton from '@/components/notices/BidTableSkeleton';
import { Metadata } from 'next';
import { getNoticesByCategory, getCategoryKeywords } from '@/lib/api/notices';

interface PageProps {
  params: {
    categoryType: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await Promise.resolve(params);
    const categoryType = decodeURIComponent(resolvedParams.categoryType);
    const categoryInfo = await getCategoryKeywords(categoryType);
    const title = categoryInfo ? `${categoryInfo.categoryType} 입찰공고` : '입찰공고';

    return {
      title: `${title} | ILMAC BID`,
      description: `${title} 목록입니다.`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '입찰공고 | ILMAC BID',
      description: '입찰공고 목록입니다.',
    };
  }
}

export default async function CategoryPage({ params }: PageProps) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const categoryType = decodeURIComponent(resolvedParams.categoryType);
    const notices = await getNoticesByCategory(categoryType);

    return (
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<BidTableSkeleton />}>
          <BidTable notices={notices} currentCategory={categoryType} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error in CategoryPage:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">오류가 발생했습니다</h1>
        <p>데이터를 불러오는 중 문제가 발생했습니다.</p>
      </div>
    );
  }
}
