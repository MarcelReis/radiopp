import React from "react";

import {
  grommet,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Grid,
  Text,
} from "grommet";

import { Radio } from "src/types/graphql";

type PropsType = {
  radios: Radio[];
  selectRadio: (radio: Radio) => void;
};

const RadioList = (props: PropsType): JSX.Element => {
  return (
    <section>
      <Text as="h2">Radios</Text>

      <Grid
        as="ul"
        columns={{ count: "fill", size: "300px" }}
        gap="small"
        style={{ padding: 0 }}
      >
        {props.radios.map((radio) => (
          <Card
            as="li"
            pad="small"
            gap="medium"
            key={radio.id}
            onClick={() => props.selectRadio(radio)}
            direction="row"
          >
            <Image
              src={radio.thumb}
              height="64px"
              width="64px"
              style={{ borderRadius: "8px" }}
            />
            <CardBody justify="around">
              <Text weight="bold">{radio.name}</Text>
              <Text size="small" color="dark-2">
                {radio.location.city}, {radio.location.state}
              </Text>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </section>
  );
};

export default RadioList;
