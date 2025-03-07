'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Search, Star } from 'lucide-react';
import { type Notice } from '@/types/notice';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [sortConfig, setSortConfig] = useState<{ field: SortField; order: SortOrder }>({
    field: 'createdAt',
    order: 'desc',
  });

  // 카테고리 변경 핸들러
  const handleCategoryChange = (value: string) => {
    router.push(`/notices/category/${encodeURIComponent(value)}`);
  };

  // 정렬 함수
  const sortData = (a: Notice, b: Notice, field: SortField) => {
    const aValue = String(a[field] || '');  // 문자열로 변환
    const bValue = String(b[field] || '');  // 문자열로 변환

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

  // 정렬 토글
  const toggleSort = (field: SortField) => {
    setSortConfig({
      field,
      order: sortConfig.field === field && sortConfig.order === 'asc' ? 'desc' : 'asc',
    });
  };

  // 체크박스 토글
  const toggleCheckbox = (nid: number) => {
    setSelectedNids(prev => 
      prev.includes(nid) 
        ? prev.filter(id => id !== nid)
        : [...prev, nid]
    );
  };

  // 즐겨찾기 추가
  const handleAddToFavorites = () => {
    if (selectedNids.length === 0) {
      alert('선택된 공고가 없습니다.');
      return;
    }
    alert(`선택된 공고 ID: ${selectedNids.join(', ')}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Select
            value={currentCategory}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-[180px]">
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
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="입찰공고 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Button 
          onClick={handleAddToFavorites}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Star className="h-4 w-4" />
          즐겨찾기에 추가
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">-</TableHead>
              <TableHead className="hidden">번호</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => toggleSort('title')} 
                  className="hover:bg-transparent"
                >
                  제목
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => toggleSort('organization')} 
                  className="hover:bg-transparent"
                >
                  기관명
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => toggleSort('region')} 
                  className="hover:bg-transparent"
                >
                  지역
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => toggleSort('registration')} 
                  className="hover:bg-transparent"
                >
                  등록
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedNotices.map((notice, index) => (
              <TableRow key={`${notice.organization}-${notice.createdAt}-${index}`}>
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
                <TableCell>{notice.organization}</TableCell>
                <TableCell>{notice.region || '-'}</TableCell>
                <TableCell>{notice.registration || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
