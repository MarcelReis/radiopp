import React from "react";
import Head from "next/head";
import Layout from "src/components/Layout";

const NotFoundPage = (): React.ReactNode => {
  return (
    <div>
      <Head>
        <title>Radiopp - Página não encontrada</title>
      </Head>

      <h1>404 - Página não encontrada</h1>
    </div>
  );
};

export default NotFoundPage;
