import React from "react";
import { Box, Button, Image, Text } from "grommet";
import { PlayArrow, Pause, Close } from "@styled-icons/material/";

import * as S from "./Player.styled";
import { Radio } from "src/types/graphql";

type PropsType = {
  initialized: boolean;
  hide: boolean;
  loading: boolean;
  playing: boolean;
  buffering: boolean;
  radio: Radio | null;
  children: React.ReactNode;

  play: () => void;
  pause: () => void;
  stop: () => void;
};

const Player = (props: PropsType): JSX.Element => {
  return (
    <S.Container active={!props.hide}>
      <Box
        direction="row"
        background="dark-1"
        height="100%"
        pad={{ horizontal: "xxsmall" }}
        align="center"
        justify="between"
      >
        <Box flex direction="row" margin="auto" width={{ max: "800px" }}>
          {props.children}
          {props.initialized && (
            <Button
              color="accent-1"
              onClick={
                props.loading || props.buffering
                  ? null
                  : props.playing
                  ? props.pause
                  : props.play
              }
              icon={
                props.loading || props.buffering ? (
                  <S.RotatingRadar size={24} />
                ) : props.playing ? (
                  <Pause size={24} />
                ) : (
                  <PlayArrow size={24} />
                )
              }
            />
          )}

          <Box direction="row" flex="grow" align="center" justify="start">
            <Image
              alt=""
              src={props.radio?.thumb}
              height="36px"
              width="36px"
              style={{ borderRadius: "4px" }}
              margin={{ left: "xsmall" }}
            />

            <Box pad="xsmall" margin={{ left: "small" }}>
              <Text weight="bold" size="small">
                {props.radio?.name}
              </Text>
              <Text size="small" color="dark-5">
                {props.radio?.location.city}
              </Text>
            </Box>
          </Box>

          <Button
            onClick={props.stop}
            color="accent-1"
            icon={<Close size={24} />}
          />
        </Box>
      </Box>
    </S.Container>
  );
};

export default Player;
