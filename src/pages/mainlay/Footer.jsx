import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import CurrentTrack from './CurrentTrack';
import PlayerControls from './PlayerControls';
import { useStateProvider } from '../../utils/StateProvider';
export default function Footer() {
  const [vid,setVid]=useState('')
  const[{currentPlaying},dispatch]=useStateProvider()
  useEffect(() => {
         console.log(currentPlaying.video_id);

    setVid(currentPlaying.video_id);
  }, [currentPlaying]);
  return(
    <Container>
      <CurrentTrack/>
      <PlayerControls vid={vid}/>
    </Container>
  );
}
const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: #181818;
  border-top: 1px solid #282828;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
`;