import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Building2Icon, MapPinIcon } from 'lucide-react';

interface Notice {
  nid: number;
  title: string;
  organization: string;
  createdAt: string;
  detailUrl: string;
  category?: string;
  region?: string;
  registration?: string;
}

interface NoticeListProps {
  notices: Notice[];
}

export default function NoticeList({ notices }: NoticeListProps) {
  return (
    <div className="grid gap-4">
      {notices.map((notice) => (
        <Card key={notice.nid} className="hover:bg-gray-50 transition-colors">
          <CardContent className="p-4">
            <a href={notice.detailUrl} target="_blank" rel="noopener noreferrer" className="block">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-2 text-gray-900">{notice.title}</h2>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Building2Icon className="w-4 h-4" />
                      <span>{notice.organization}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{notice.createdAt}</span>
                    </div>
                    {notice.region && (
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{notice.region}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {notice.registration && <Badge variant="outline">{notice.registration}</Badge>}
                  {notice.category && <Badge variant="secondary">{notice.category}</Badge>}
                </div>
              </div>
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
