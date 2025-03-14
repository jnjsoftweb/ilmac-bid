'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Notice } from '@/lib/scraper/types';

export default function ScraperPage() {
  const [names, setNames] = useState<string>('강남구');
  const [results, setResults] = useState<Notice[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const nameList = names.split(',').map((name) => name.trim());
      const response = await fetch('/api/scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names: nameList }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '스크래핑 중 오류가 발생했습니다.');
      }

      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : '스크래핑 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">공고 스크래퍼</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-4 mb-4">
          <Input
            type="text"
            value={names}
            onChange={(e) => setNames(e.target.value)}
            placeholder="기관명 (쉼표로 구분)"
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? '스크래핑 중...' : '스크래핑 시작'}
          </Button>
        </div>
      </form>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {results.map((orgResults, orgIndex) => (
        <Card key={orgIndex} className="mb-6">
          <CardHeader>
            <CardTitle>{orgResults[0]?.기관명 || `기관 ${orgIndex + 1}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      제목
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작성일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작성자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      스크래핑 시간
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orgResults.map((notice, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {notice.상세페이지주소 ? (
                          <a
                            href={notice.상세페이지주소}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {notice.제목}
                          </a>
                        ) : (
                          notice.제목
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{notice.작성일}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{notice.작성자}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{notice.scraped_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
