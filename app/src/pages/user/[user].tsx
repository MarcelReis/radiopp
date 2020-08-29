import React from "react";
import Head from "next/head";

const UserPage = (): React.ReactNode => {
  return (
    <div>
      <Head>
        <title>Radiopp - As melhores Rádios online</title>
        <meta
          name="description"
          content="As melhores rádios do Brasil, escute as rádios da sua cidade e do mundo online"
        />
      </Head>
      <h1>UserPage</h1>
    </div>
  );
};

export default UserPage;
