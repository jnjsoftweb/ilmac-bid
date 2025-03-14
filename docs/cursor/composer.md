`notices/category/[categoryType]`

검색 영역 우측에 '상세검색' 버튼을 만들고, 버튼을 누르면 '상세 검색' 모달창이 나오도록 해주세요.
'상세 검색' 모달창에는 아래와 같은 내용을 넣어주세요.

"""
- 카테고리
[ ] 공사점검 [ ] 성능평가 [ ] 기타
---
- 작성일
종료일 [DatePicker] 기간 [14]

- 스크랩일
종료일 [DatePicker] 기간 [14]

---
- 기관(여러 개 입력시 ',' 사용)
제외 기관 [] 포함 기관 []

- 지역(여러 개 입력시 ',' 사용)
제외 지역 [] 포함 지역 [ ]

<최소> <적용>
"""

===

- '상세 검색' 버튼을 '검색' 영역 바로 우측에 위치해주세요.
- '즐겨찾기에 추가' 버튼 우측에 '설정' 버튼을 아이콘으로 만들어주세요.
- '즐겨찾기에 추가' 버튼은 별 아이콘만 남기고 글자는 제거해주세요.

====

'설정' 버튼을 누르면 '설정' 모달창이 나오도록 해주세요.
'상세 검색' 모달창에는 아래와 같은 내용을 넣어주세요.

"""
- 페이지
페이지당 게시물 수 [20]
---
- UI
  - 테마 [light]
  - 주색상 [red]
"""

---

- 페이지당 게시물 수(perPage)는 pagination시에 한 페이지당 게시물 수를 나타내며, '0'인 경우 pagination을 하지 않습니다.
- 테마는 'light' / 'dark' 모드가 있습니다.
- 주색상은 'red/blue/green/orange/pink/purple'이 있고, 그에 따른 테이블의 header, body 배경색, 글자색을 적용합니다.

색상 코드는 첨부한 이미지를 참고해주세요.


---

'설정'에서 UI 테마는 사이트 전체에 light/dark 테마를 지정하는 용도이므로, 나중에 전체 사이트의 header에 반영할 예정이므로, 우선 삭제해주세요.
'설정'에서 UI '주색상'은 `category/[categoryType]` 페이지에만 적용되는 것으로,
- 테이블 위에 있는 select, 검색, 버튼, ... 등의 요소들에 대한 css와 테이블 header의 배경색, 글자색, body의 배경색, 글자색, link색에도 적용되도록 해주세요.
  - header의 경우 배경색은 짙은 컬러를 사용하고, 글자색은 옅은 컬러
  - body의 경우 header의 글자색을 배경색으로 하고, link의 색상은 글자색보다 짙은 컬러를 적용하도록 해주세요.

---
사이트 전체에 사용할 header를 만들어주세요. 내용은 아래와 같아요.

"""
## 좌측 정렬
- ILE
---
- 공고 목록
  - 자동 스크랩
  - 수동 스크랩
- 관심 종목
  - 보관함
  - 진행중
  - 완료

- 통계
  - 일별/주별/월별 통계
  - 기관별/지역별 통계
  - 에러 통계

- 설정
  - 목록 스크랩
  - 상세 스크랩
  - 카테고리 설정
  - 보관함 설정
  - 메모

---
## 우측 정렬
- 로그인(프로필)
- 설정
"""


===

`notices/category/[categoryType]` 페이지의 테이블에 '작성일' 컬럼을 추가해주세요.

===

`notices/category/[categoryType]` 페이지의 테이블 header에 hover 효과를 없애주세요.

===

`notices/category/[categoryType]` 페이지의 테이블 header의 셀 안에 있는 button의 너비를 셀 크기에서 1px을 뺀 크기로 하고, 가로정렬을 중앙으로 해주세요.