import React, { useEffect, useState } from "react";
import { ComboBox, Item } from "./ComboBox";
import { Button } from "./Button";
import { ToggleButton } from "./ToggleButton";
import { Checkbox } from "./Checkbox";
import { Meter } from "./Meter";
import { ProgressBar } from "./ProgressBar";
import { Breadcrumbs, BreadcrumbItem } from "./Breadcrumbs";

const useRandomValue = () => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setValue(Math.random()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return value;
};

const useIncreasingValue = (start: number, end: number, increment: number) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () =>
        setValue((prev) => {
          const next = prev + increment;
          if (next > end) {
            return start;
          } else {
            return next;
          }
        }),
      100
    );
    return () => {
      clearInterval(interval);
    };
  }, []);

  return value;
};

const arr = Array.from({ length: 1000 }, (v, k) => k + 1);

function App() {
  const meterValue = useRandomValue();
  const progressValue = useIncreasingValue(0, 100, 1);

  return (
    <div className="p-6">
      <div className="text-4xl uppercase font-bold pb-2">React Aria</div>
      <div className="pb-6">
        A really cool library for building component libs
      </div>
      <Section>
        <Heading>Button</Heading>
        <Button onPress={() => alert("Button pressed!")}>Test</Button>
      </Section>
      <Section>
        <Heading>Toggle Button</Heading>
        <ToggleButton>Test</ToggleButton>
      </Section>
      <Section>
        <Heading>Combo Box</Heading>
        <ComboBox label="Favorite Number (limit 1000)">
          {arr.map((i) => (
            <Item key={i.toString()}>{i.toString()}</Item>
          ))}
        </ComboBox>
      </Section>
      <Section>
        <Heading>Checkbox</Heading>
        <Checkbox />
      </Section>
      <Section>
        <Heading>Meter</Heading>
        <Meter
          label="Storage space"
          value={meterValue * 1000}
          maxValue={1000}
        />
      </Section>
      <Section>
        <Heading>Progress bar</Heading>
        <ProgressBar label="Loading..." value={progressValue} />
      </Section>
      <Section>
        <Heading>Breadcrumbs</Heading>
        <Breadcrumbs>
          <BreadcrumbItem onPress={() => alert("Pressed Folder 1")}>
            Folder 1
          </BreadcrumbItem>
          <BreadcrumbItem onPress={() => alert("Pressed Folder 2")}>
            Folder 2
          </BreadcrumbItem>
          <BreadcrumbItem>Folder 3</BreadcrumbItem>
        </Breadcrumbs>
      </Section>
    </div>
  );
}

const Section: React.FC = ({ children }) => {
  return <div className="pb-3">{children}</div>;
};

const Heading: React.FC = ({ children }) => {
  return <div className="font-bold text-xl uppercase pb-1">{children}</div>;
};

export default App;
