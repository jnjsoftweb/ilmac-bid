import { gql } from '@apollo/client';

export const GET_NOTICES_BY_CATEGORY = gql`
  query GetNoticesByCategory($category: String!) {
    noticesByCategory(category: $category) {
      nid
      title
      organization
      createdAt
      detailUrl
      region
      registration
    }
  }
`; 