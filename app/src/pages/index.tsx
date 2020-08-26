import React, { useState } from "react";

import { RadioType } from "../api/radios";

import RadioContainer from "../container/RadioContainer";
import PlayerContainer from "../container/PlayerContainer";

import AppBar from "../components/AppBar";

export default function HomePage() {
  const [radio, setRadio] = useState<null | RadioType>(null);

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
