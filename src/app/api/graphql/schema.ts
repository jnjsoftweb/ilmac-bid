export const typeDefs = `
  type Notice {
    nid: Int!
    title: String!
    organization: String!
    createdAt: String!
    detailUrl: String!
    category: String
    region: String
    registration: String
  }

  type CategoryKeyword {
    categoryType: String!
    keywords: [String!]!
    nots: [String!]!
    minPoint: Int!
    orgNames: [String!]!
  }

  type Query {
    notices(category: String!): [Notice]!
    allNotices(limit: Int!): [Notice]!
    categoryKeywords(categoryType: String!): CategoryKeyword
  }
`;
