'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { type SettingsList } from '@/lib/api/settings';
import { Textarea } from "@/components/ui/textarea";

interface SettingsEditModalProps {
  setting: SettingsList | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (setting: SettingsList) => void;
}

export default function SettingsEditModal({ 
  setting, 
  isOpen, 
  onClose, 
  onSave 
}: SettingsEditModalProps) {
  const [editedSetting, setEditedSetting] = useState<SettingsList | null>(setting);

  useEffect(() => {
    setEditedSetting(setting);
  }, [setting]);

  if (!editedSetting) return null;

  const handleChange = (field: keyof SettingsList, value: any) => {
    setEditedSetting(prev => ({
      ...prev!,
      [field]: field === 'use' ? (value ? 1 : 0) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedSetting);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>기관 정보 수정</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* 기본 정보 */}
            <div className="space-y-2">
              <Label htmlFor="기관명">기관명 *</Label>
              <Input
                id="기관명"
                value={editedSetting.기관명}
                onChange={(e) => handleChange('기관명', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="지역">지역</Label>
              <Input
                id="지역"
                value={editedSetting.지역 || ''}
                onChange={(e) => handleChange('지역', e.target.value)}
              />
            </div>

            {/* URL 및 iframe 설정 */}
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={editedSetting.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iframe">iframe</Label>
              <Input
                id="iframe"
                value={editedSetting.iframe || ''}
                onChange={(e) => handleChange('iframe', e.target.value)}
              />
            </div>

            {/* XPath 및 페이징 설정 */}
            <div className="space-y-2">
              <Label htmlFor="rowXpath">Row XPath</Label>
              <Input
                id="rowXpath"
                value={editedSetting.rowXpath || ''}
                onChange={(e) => handleChange('rowXpath', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paging">페이징</Label>
              <Input
                id="paging"
                value={editedSetting.paging || ''}
                onChange={(e) => handleChange('paging', e.target.value)}
              />
            </div>

            {/* 페이지 범위 설정 */}
            <div className="space-y-2">
              <Label htmlFor="startPage">시작 페이지</Label>
              <Input
                id="startPage"
                type="number"
                value={editedSetting.startPage || ''}
                onChange={(e) => handleChange('startPage', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endPage">종료 페이지</Label>
              <Input
                id="endPage"
                type="number"
                value={editedSetting.endPage || ''}
                onChange={(e) => handleChange('endPage', parseInt(e.target.value))}
              />
            </div>

            {/* 로그인 정보 */}
            <div className="col-span-2 space-y-2">
              <Label htmlFor="login">로그인 정보</Label>
              <Textarea
                id="login"
                value={editedSetting.login || ''}
                onChange={(e) => handleChange('login', e.target.value)}
                rows={3}
              />
            </div>

            {/* 스크래핑 설정 */}
            <div className="space-y-2">
              <Label htmlFor="제목">제목 XPath</Label>
              <Input
                id="제목"
                value={editedSetting.제목 || ''}
                onChange={(e) => handleChange('제목', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="상세페이지주소">상세페이지 XPath</Label>
              <Input
                id="상세페이지주소"
                value={editedSetting.상세페이지주소 || ''}
                onChange={(e) => handleChange('상세페이지주소', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="작성일">작성일 XPath</Label>
              <Input
                id="작성일"
                value={editedSetting.작성일 || ''}
                onChange={(e) => handleChange('작성일', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="작성자">작성자 XPath</Label>
              <Input
                id="작성자"
                value={editedSetting.작성자 || ''}
                onChange={(e) => handleChange('작성자', e.target.value)}
              />
            </div>

            {/* 제외항목 */}
            <div className="col-span-2 space-y-2">
              <Label htmlFor="제외항목">제외항목</Label>
              <Textarea
                id="제외항목"
                value={editedSetting.제외항목 || ''}
                onChange={(e) => handleChange('제외항목', e.target.value)}
                rows={2}
              />
            </div>

            {/* 상태 설정 */}
            <div className="space-y-2">
              <Label htmlFor="등록">등록</Label>
              <Input
                id="등록"
                type="number"
                value={editedSetting.등록 || ''}
                onChange={(e) => handleChange('등록', parseInt(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="use"
                checked={editedSetting.use === 1}
                onCheckedChange={(checked) => handleChange('use', checked)}
              />
              <Label htmlFor="use">사용</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">저장</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 