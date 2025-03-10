'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Settings,
  ListTodo,
  Star,
  BarChart2,
  Cog,
  User,
  BookmarkPlus,
  BookmarkCheck,
  Archive,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  FolderKanban,
  StickyNote,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const notices = [
  {
    title: '공사점검',
    href: '/notices/category/공사점검',
    icon: BookmarkPlus,
  },
  {
    title: '성능평가',
    href: '/notices/category/성능평가',
    icon: BookmarkCheck,
  },
  {
    title: '기타',
    href: '/notices/category/기타',
    icon: BookmarkCheck,
  },
];

const favorites = [
  {
    title: '보관함',
    href: '/favorites/archive',
    description: '보관된 공고 목록',
    icon: Archive,
  },
  {
    title: '진행중',
    href: '/favorites/ongoing',
    description: '진행 중인 공고 목록',
    icon: PlayCircle,
  },
  {
    title: '완료',
    href: '/favorites/completed',
    description: '완료된 공고 목록',
    icon: CheckCircle,
  },
];

const statistics = [
  {
    title: '일별/주별/월별 통계',
    href: '/statistics/period',
    description: '기간별 공고 통계',
    icon: BarChart2,
  },
  {
    title: '기관별/지역별 통계',
    href: '/statistics/category',
    description: '기관 및 지역별 통계',
    icon: FileSpreadsheet,
  },
  {
    title: '에러 통계',
    href: '/statistics/errors',
    description: '스크랩 에러 통계',
    icon: AlertCircle,
  },
];

const settings = [
  {
    title: '목록 스크랩',
    href: '/settings/list',
    description: '목록 스크랩 설정',
    icon: ListTodo,
  },
  {
    title: '상세 스크랩',
    href: '/settings/detail',
    description: '상세 스크랩 설정',
    icon: Settings,
  },
  {
    title: '카테고리 설정',
    href: '/settings/categories',
    description: '카테고리 관리',
    icon: FolderKanban,
  },
  {
    title: '보관함 설정',
    href: '/settings/archive',
    description: '보관함 관리',
    icon: Archive,
  },
  {
    title: '메모',
    href: '/settings/notes',
    description: '메모 관리',
    icon: StickyNote,
  },
];

export function Header() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // 임시로 상태 추가

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-8">
            {/* 로고 */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold">ILE</span>
            </Link>

            {/* 메인 네비게이션 */}
            <NavigationMenu>
              <NavigationMenuList>
                {/* 공고 목록 */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <ListTodo className="mr-2 h-4 w-4" />
                    공고 목록
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {notices.map((item) => (
                        <ListItem key={item.title} title={item.title} href={item.href} icon={item.icon}>
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 관심 종목 */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Star className="mr-2 h-4 w-4" />
                    관심 종목
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {favorites.map((item) => (
                        <ListItem key={item.title} title={item.title} href={item.href} icon={item.icon}>
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 통계 */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <BarChart2 className="mr-2 h-4 w-4" />
                    통계
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {statistics.map((item) => (
                        <ListItem key={item.title} title={item.title} href={item.href} icon={item.icon}>
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 설정 */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Cog className="mr-2 h-4 w-4" />
                    설정
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {settings.map((item) => (
                        <ListItem key={item.title} title={item.title} href={item.href} icon={item.icon}>
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* 우측 메뉴 */}
          <div className="flex items-center">
            {isLoggedIn ? (
              <Link
                href="/profile"
                className={cn(
                  'flex items-center gap-2 px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors',
                  pathname === '/profile' && 'bg-accent'
                )}
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                className={cn(
                  'flex items-center gap-2 px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors',
                  pathname === '/login' && 'bg-accent'
                )}
              >
                <User className="h-4 w-4" />
                <span>로그인</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & {
    title: string;
    icon: LucideIcon;
  }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            <Icon className="h-4 w-4" />
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
