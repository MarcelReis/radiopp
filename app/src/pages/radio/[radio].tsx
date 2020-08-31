import React from "react";
import { useRouter } from "next/router";
import { GetServerSidePropsResult, GetServerSidePropsContext } from "next";

import { initializeApollo } from "src/api/apollo";

type PropsType = {
  id: number;
};

function RadioPage(): React.ReactNode {
  const router = useRouter();
  const { radio } = router.query;

  return <div>Radio Page {radio}</div>;
}

export async function GetServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PropsType>> {
  const apolloClient = initializeApollo();

  return {
    props: { id: 1 },
  };
}

export default RadioPage;
