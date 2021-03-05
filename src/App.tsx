import React from "react";
import logo from "./logo.svg";
import { ComboBox, Item } from "./ComboBox";

const arr = Array.from({ length: 1000 }, (v, k) => k + 1);

function App() {
  return (
    <div className="p-3">
      <div className="font-bold text-xl">COMBO BOX</div>
      <ComboBox label="Favorite Number (limit 1000)">
        {arr.map((i) => (
          <Item key={i.toString()}>{i.toString()}</Item>
        ))}
      </ComboBox>
    </div>
  );
}

export default App;
