import React, { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { reducerCases } from "../../utils/constants";
import { useStateProvider } from "../../utils/StateProvider";

export default function CurrentTrack() {
    const [{ token, currentPlaying  }, dispatch] = useStateProvider();
    useEffect(()=>{const getCurrentTrack = async () => {    
        const token = localStorage.getItem('token');
        const response = await axios.get(
          "http://127.0.0.1:5000/currently-playing",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        console.log(response.data)
        if (response.data !== "") {
          const currentPlaying = {
            id: response.data.song_id,
            name: response.data.song_name,
            artists: response.data.artists.map((artist) => artist.artist_name),
            image: response.data.image,
          };
          console.log(currentPlaying)
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
        } else {
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: null });
        }
      };
      getCurrentTrack();
    }, [token, dispatch]);
  return (
    <Container>
      {currentPlaying && (
        <div className="track">
          <div className="track__image">
            <img src={currentPlaying.image} alt="currentPlaying" />
          </div>
          <div className="track__info">
            <h4 className="track__info__track__name">{currentPlaying.name}</h4>
            <h6 className="track__info__track__artists">
              {currentPlaying.artists.join(", ")}
            </h6>
          </div>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  .track {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 0%;

    &__image {
      position: absolute; 
      width: 100px; 
      height: 100px;
      overflow: hidden;

      img {
        width: 100%; 
        height: 100%;
        object-fit: cover;
      }
    }

    &__info {
      padding-left: 140px;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;

      &__track__name {
        color: white;
         
        overflow: hidden;
      }

      &__track__artists {
        color: #b3b3b3;
        width: 100%;
        white-space: nowrap; 
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`;
