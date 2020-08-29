import React, { useState } from "react";

import RadioContainer from "../container/RadioContainer";
import PlayerContainer from "../container/PlayerContainer";

import { Radio } from "src/types/graphql";
import Layout from "src/components/Layout";

export default function HomePage(): JSX.Element {
  const [radio, setRadio] = useState<null | Radio>(null);

  return (
    <Layout>
      <RadioContainer setRadio={setRadio} />
      <PlayerContainer radio={radio} />
    </Layout>
  );
}
