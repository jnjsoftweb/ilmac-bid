'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Search } from 'lucide-react';

interface Notice {
  nid: number;
  title: string;
  organization: string;
  createdAt: string;
  detailUrl: string;
  region?: string;
  registration?: string;
}

interface BidTableProps {
  notices: Notice[];
}

type SortField = 'createdAt' | 'organization' | 'region' | 'registration';
type SortOrder = 'asc' | 'desc';

export default function BidTable({ notices }: BidTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ field: SortField; order: SortOrder }>({
    field: 'createdAt',
    order: 'desc',
  });

  // 정렬 함수
  const sortData = (a: Notice, b: Notice, field: SortField) => {
    const aValue = a[field] || '';
    const bValue = b[field] || '';

    if (field === 'createdAt') {
      return sortConfig.order === 'asc'
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime();
    }

    return sortConfig.order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('organization')} className="h-8 font-medium">
                  기관명
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('createdAt')} className="h-8 font-medium">
                  작성일
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('region')} className="h-8 font-medium">
                  지역
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('registration')} className="h-8 font-medium">
                  등록
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedNotices.map((notice, index) => (
              <TableRow key={`${notice.organization}-${notice.createdAt}-${index}`}>
                <TableCell className="max-w-xl">
                  <a
                    href={notice.detailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary hover:underline"
                  >
                    {notice.title}
                  </a>
                </TableCell>
                <TableCell>{notice.organization}</TableCell>
                <TableCell>{notice.createdAt}</TableCell>
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
