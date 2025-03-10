'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Settings } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import type { PrimaryColor } from '@/store/settingsStore';

interface SettingsFormData {
  perPage: number;
  primaryColor: PrimaryColor;
}

const COLORS = [
  { value: 'red', label: '레드' },
  { value: 'blue', label: '블루' },
  { value: 'green', label: '그린' },
  { value: 'orange', label: '오렌지' },
  { value: 'pink', label: '핑크' },
  { value: 'purple', label: '퍼플' },
  { value: 'gray', label: '그레이' },
];

export function SettingsModal() {
  const [open, setOpen] = useState(false);
  const { perPage, primaryColor, setPerPage, setPrimaryColor } = useSettingsStore();

  const form = useForm<SettingsFormData>({
    defaultValues: {
      perPage,
      primaryColor,
    },
  });

  // 색상 변경 시 HTML 속성 업데이트
  useEffect(() => {
    document.documentElement.setAttribute('data-primary-color', primaryColor);
  }, [primaryColor]);

  const onSubmit = (data: SettingsFormData) => {
    setPerPage(data.perPage);
    setPrimaryColor(data.primaryColor);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="설정" className="hidden">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>설정</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="perPage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>페이지당 게시물 수</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        min={0}
                        className="w-20"
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">0인 경우 페이지네이션을 하지 않습니다.</p>
                  </FormItem>
                )}
              />

              <div className="h-px bg-border" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">UI</h3>
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>주색상</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="색상 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COLORS.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              {color.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button type="submit">저장</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
