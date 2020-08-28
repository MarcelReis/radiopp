export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Radio = {
  __typename?: "Radio";
  id?: Maybe<Scalars["Int"]>;
  name: Scalars["String"];
  originalURL: Scalars["String"];
  thumb: Scalars["String"];
  website: Scalars["String"];
  streamURL: Scalars["String"];
  city: Scalars["String"];
  state: Scalars["String"];
  country: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  radios: Array<Radio>;
};
