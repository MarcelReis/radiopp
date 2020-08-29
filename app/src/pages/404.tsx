import React from "react";
import Head from "next/head";
import Layout from "src/components/Layout";

const NotFoundPage = (): React.ReactNode => {
  return (
    <div>
      <Head>
        <title>Radiopp - Página não encontrada</title>
      </Head>

      <Layout>
        <h1>404 - Página não encontrada</h1>
      </Layout>
    </div>
  );
};

export default NotFoundPage;
