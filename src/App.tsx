import React, { useState } from "react";
import RadioContainer from "./container/RadioContainer";

import "normalize.css";
import PlayerContainer from "./container/PlayerContainer";
import { RadioType } from "./api/radios";

function App() {
  const [radio, setRadio] = useState<null | RadioType>(null);

  return (
    <div className="App">
      <div style={{ maxWidth: "800px", margin: "auto", padding: "16px" }}>
        <RadioContainer setRadio={setRadio} />
        <PlayerContainer radio={radio} />
      </div>
    </div>
  );
}

export default App;
