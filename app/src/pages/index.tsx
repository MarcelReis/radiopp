import React, { useState } from "react";

import RadioContainer from "../container/RadioContainer";
import PlayerContainer from "../container/PlayerContainer";

import AppBar from "../components/AppBar";
import { Radio } from "src/types/graphql";

export default function HomePage(): JSX.Element {
  const [radio, setRadio] = useState<null | Radio>(null);

  return (
    <div className="App">
      <AppBar />
      <div style={{ maxWidth: "800px", margin: "auto", padding: "16px" }}>
        <RadioContainer setRadio={setRadio} />
        <PlayerContainer radio={radio} />
      </div>
    </div>
  );
}
