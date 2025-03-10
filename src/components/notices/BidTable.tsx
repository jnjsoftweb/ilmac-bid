'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Search, Star } from 'lucide-react';
import { type Notice } from '@/types/notice';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNoticeFilterStore } from '@/store/noticeFilterStore';
import { filterNotices } from '@/lib/utils/filterNotices';
import { AdvancedSearchModal } from './AdvancedSearchModal';
import { SettingsModal } from './SettingsModal';
import { useSettingsStore } from '@/store/settingsStore';
import { NoticeDetailModal } from './NoticeDetailModal';

type SortField = 'title' | 'organization' | 'createdAt' | 'region' | 'registration';
type SortOrder = 'asc' | 'desc';

interface BidTableProps {
  notices: Notice[];
  currentCategory?: string;
}

const CATEGORIES = [
  { value: '공사점검', label: '공사점검' },
  { value: '성능평가', label: '성능평가' },
  { value: '기타', label: '기타' },
];

export default function BidTable({ notices, currentCategory }: BidTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNids, setSelectedNids] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ field: SortField; order: SortOrder }>({
    field: 'createdAt',
    order: 'desc',
  });
  const { filter } = useNoticeFilterStore();
  const { perPage } = useSettingsStore();
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (value: string) => {
    router.push(`/notices/category/${encodeURIComponent(value)}`);
  };

  // 정렬 함수
  const sortData = (a: Notice, b: Notice, field: SortField) => {
    const aValue = String(a[field] || ''); // 문자열로 변환
    const bValue = String(b[field] || ''); // 문자열로 변환

    if (field === 'createdAt') {
      return sortConfig.order === 'asc'
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime();
    }

    // 문자열 비교
    if (sortConfig.order === 'asc') {
      return aValue.localeCompare(bValue);
    }
    return bValue.localeCompare(aValue);
  };

  // 검색 및 정렬된 데이터
  const filteredAndSortedNotices = notices
    .filter(
      (notice) =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (notice.region && notice.region.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => sortData(a, b, sortConfig.field));

  const filteredNotices = filterNotices(filteredAndSortedNotices, filter);

  // 페이지네이션 로직
  const totalPages = perPage === 0 ? 1 : Math.ceil(filteredNotices.length / perPage);
  const paginatedNotices =
    perPage === 0 ? filteredNotices : filteredNotices.slice((currentPage - 1) * perPage, currentPage * perPage);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 정렬 토글
  const toggleSort = (field: SortField) => {
    setSortConfig({
      field,
      order: sortConfig.field === field && sortConfig.order === 'asc' ? 'desc' : 'asc',
    });
  };

  // 체크박스 토글
  const toggleCheckbox = (nid: number) => {
    setSelectedNids((prev) => (prev.includes(nid) ? prev.filter((id) => id !== nid) : [...prev, nid]));
  };

  // 즐겨찾기 추가
  const handleAddToFavorites = () => {
    if (selectedNids.length === 0) {
      alert('선택된 공고가 없습니다.');
      return;
    }
    alert(`선택된 공고 ID: ${selectedNids.join(', ')}`);
  };

  // 행 클릭 핸들러
  const handleRowClick = (notice: Notice, event: React.MouseEvent) => {
    // 체크박스와 제목 링크를 클릭한 경우는 제외
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' || // 체크박스
      target.tagName === 'A' || // 링크
      target.closest('button') || // 버튼
      target.closest('a') // 링크의 자식 요소
    ) {
      return;
    }
    setSelectedNotice(notice);
  };

  if (filteredNotices.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 category-page">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Select value={currentCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex items-center gap-2 w-[500px]">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 search-icon" />
              <Input
                placeholder="입찰공고 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <AdvancedSearchModal />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleAddToFavorites} variant="outline" size="icon" title="즐겨찾기에 추가">
            <Star className="h-4 w-4" />
          </Button>
          <SettingsModal />
        </div>
      </div>

      <div className="border rounded-md table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">-</TableHead>
              <TableHead className="hidden hover:bg-transparent">번호</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => toggleSort('title')}
                  className="hover:bg-transparent p-0"
                >
                  제목
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => toggleSort('createdAt')}
                  className="hover:bg-transparent p-0"
                >
                  작성일
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => toggleSort('organization')}
                  className="hover:bg-transparent p-0"
                >
                  기관명
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => toggleSort('region')}
                  className="hover:bg-transparent p-0"
                >
                  지역
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => toggleSort('registration')}
                  className="hover:bg-transparent p-0"
                >
                  등록
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedNotices.map((notice) => (
              <TableRow key={notice.nid} className="cursor-pointer" onClick={(e) => handleRowClick(notice, e)}>
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedNids.includes(notice.nid)}
                    onCheckedChange={() => toggleCheckbox(notice.nid)}
                  />
                </TableCell>
                <TableCell className="hidden">{notice.nid}</TableCell>
                <TableCell>
                  <a
                    href={notice.detailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {notice.title}
                  </a>
                </TableCell>
                <TableCell>
                  {(() => {
                    try {
                      if (typeof notice.createdAt === 'string') {
                        return notice.createdAt.split('T')[0];
                      }
                      return new Date(notice.createdAt).toISOString().split('T')[0];
                    } catch (error) {
                      return '-';
                    }
                  })()}
                </TableCell>
                <TableCell>{notice.organization}</TableCell>
                <TableCell className="text-center">{notice.region || '-'}</TableCell>
                <TableCell className="text-center">{notice.registration || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {perPage > 0 && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
        </div>
      )}

      {/* 상세 정보 모달 */}
      {selectedNotice && (
        <NoticeDetailModal
          notice={selectedNotice}
          open={!!selectedNotice}
          onOpenChange={(open) => !open && setSelectedNotice(null)}
        />
      )}
    </div>
  );
}
