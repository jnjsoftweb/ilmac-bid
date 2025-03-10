'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { type SettingsList } from '@/lib/api/settings';
import SettingsEditModal from './SettingsEditModal';
import { cn } from '@/lib/utils';

type SortField = '기관명' | '지역' | 'url';
type SortOrder = 'asc' | 'desc';

interface SettingsTableProps {
  settings: SettingsList[];
  onUpdate: (setting: SettingsList) => Promise<void>;
}

export default function SettingsTable({ settings, onUpdate }: SettingsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSettings, setSelectedSettings] = useState<string[]>([]);
  const [editingSetting, setEditingSetting] = useState<SettingsList | null>(null);
  const [sortConfig, setSortConfig] = useState<{ field: SortField; order: SortOrder }>({
    field: '기관명',
    order: 'asc',
  });

  // 정렬 함수
  const sortData = (a: SettingsList, b: SettingsList, field: SortField) => {
    const aValue = String(a[field] || '');
    const bValue = String(b[field] || '');

    if (field === 'createdAt' || field === 'updatedAt') {
      return sortConfig.order === 'asc'
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime();
    }

    return sortConfig.order === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  };

  // 검색 및 정렬된 데이터
  const filteredAndSortedSettings = settings
    .filter(
      (setting) =>
        setting.기관명.toLowerCase().includes(searchTerm.toLowerCase()) ||
        setting.지역.toLowerCase().includes(searchTerm.toLowerCase()) ||
        setting.등록.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => sortData(a, b, sortConfig.field));

  // 정렬 토글
  const toggleSort = (field: SortField) => {
    setSortConfig({
      field,
      order: sortConfig.field === field && sortConfig.order === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleRowClick = (setting: SettingsList) => {
    setEditingSetting(setting);
  };

  const handleSave = async (updatedSetting: SettingsList) => {
    await onUpdate(updatedSetting);
    setEditingSetting(null);
  };

  const toggleCheckbox = (기관명: string) => {
    setSelectedSettings(prev => 
      prev.includes(기관명)
        ? prev.filter(name => name !== 기관명)
        : [...prev, 기관명]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="기관 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div>
          <span className="text-sm text-gray-500">
            선택된 기관: {selectedSettings.length}
          </span>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedSettings.length === settings.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedSettings(settings.map(s => s.기관명));
                    } else {
                      setSelectedSettings([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => toggleSort('기관명')} 
                  className="hover:bg-transparent"
                >
                  기관명
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>URL</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => toggleSort('지역')} 
                  className="hover:bg-transparent"
                >
                  지역
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedSettings.map((setting) => (
              <TableRow 
                key={setting.기관명}
                className={cn(
                  "cursor-pointer hover:bg-gray-50",
                  setting.use === 0 && "text-gray-400"
                )}
                onClick={() => handleRowClick(setting)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedSettings.includes(setting.기관명)}
                    onCheckedChange={() => toggleCheckbox(setting.기관명)}
                  />
                </TableCell>
                <TableCell>{setting.기관명}</TableCell>
                <TableCell className="max-w-xs truncate">{setting.url}</TableCell>
                <TableCell>{setting.지역 || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SettingsEditModal
        setting={editingSetting}
        isOpen={!!editingSetting}
        onClose={() => setEditingSetting(null)}
        onSave={handleSave}
      />
    </div>
  );
} 