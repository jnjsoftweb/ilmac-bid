import { Suspense } from 'react';
import { fetchSettingsList, updateSettingsList, type SettingsList } from '@/lib/api/settings';
import SettingsTable from '@/components/settings/SettingsTable';
import { Metadata } from 'next';
import { revalidatePath } from 'next/cache';

export const metadata: Metadata = {
  title: '기관 목록 | ILMAC BID',
  description: '기관 목록을 관리합니다.',
};

export default async function SettingsListPage() {
  const settings = await fetchSettingsList();

  async function handleUpdate(setting: SettingsList) {
    'use server';
    await updateSettingsList(setting);
    revalidatePath('/settings/list');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">기관 목록</h1>
      <Suspense fallback={<div>로딩 중...</div>}>
        <SettingsTable 
          settings={settings} 
          onUpdate={handleUpdate}
        />
      </Suspense>
    </div>
  );
} 