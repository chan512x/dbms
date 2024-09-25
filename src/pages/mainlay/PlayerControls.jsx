import React, { useState,useEffect } from 'react';
import "./test.css"
import { reducerCases } from '../../utils/constants';
import { useStateProvider } from '../../utils/StateProvider';
import axios from "axios";
import { TbRewindBackward10 } from "react-icons/tb";
import styled from "styled-components"
import { TbRewindForward10 } from "react-icons/tb";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";

const YouTubeAudioPlayer = () => {
  const [{ token, currentPlaying  }, dispatch] = useStateProvider();
  const[play,setPlay]=useState(false);
  let player;
  console.log("yo")
  useEffect(() => {
    var videoId;
    const getcurrent = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/get-current`,
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
    
        // Check if the request was successful (status code 201)
        if (response.status === 201) {
          videoId = response.data.video_id;

        } else {
          console.log("Unexpected response status:", response.status); // Log unexpected response status
        }
      } catch (error) {
        // Handle errors here
        console.error("Error fetching current song:", error);
        throw error; // Re-throw the error if necessary
      }
    };
    
    getcurrent();
    if (1) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {
          player = new window.YT.Player('player', {
              height: '0',
              width: '0',
              videoId: videoId,
              playerVars: {
                  controls: 0,
                  disablekb: 1,
                  iv_load_policy: 3,
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0
              },
              events: {
                  onReady: onPlayerReady,
                  onStateChange: onPlayerStateChange
              } 
          });
      
      };

      // Event handler when player is ready
      const onPlayerReady = (event) => {
          const playButton = document.getElementById('play');
          const pauseButton = document.getElementById('pause');
          const rewindButton = document.getElementById('rewind');
          const forwardButton = document.getElementById('forward');
          const progress = document.getElementById('progress');
          const progressBar = document.getElementById('progress-bar');
          
          playButton.addEventListener('click', () => {
            event.target.playVideo();
            setPlay(true);

              
          });
          pauseButton.addEventListener('click', () => {
            setPlay(false);
            event.target.pauseVideo();
        });
          rewindButton.addEventListener('click', () => {
              event.target.seekTo(event.target.getCurrentTime() - 10);
          });
          forwardButton.addEventListener('click', () => {
              event.target.seekTo(event.target.getCurrentTime() + 10);
          });
          progress.addEventListener('click', (e) => {
              const mouseX = e.pageX - progress.offsetLeft;
              const progressBarWidth = progress.clientWidth;
              const seekTime = (mouseX / progressBarWidth) * event.target.getDuration();
              event.target.seekTo(seekTime, true);
          });
          let intervalId;
          intervalId =setInterval(() => {
            try {
              document.getElementById('timestamp').innerHTML = formatTime(event.target.getCurrentTime()) + ' / ' + formatTime(event.target.getDuration());
              const progressWidth = (event.target.getCurrentTime() / event.target.getDuration()) * 100;
              progressBar.style.width = progressWidth + '%';
            }catch (error) {
              console.error("Error occurred during interval execution:", error);
              window.location.reload()
              clearInterval(intervalId); // Clear the interval in case of error
          }
          }, 1000);
      };

      const onPlayerStateChange = (event) => {
          if (event.data === window.YT.PlayerState.ENDED) {
              event.target.stopVideo();
          }
      };

      const formatTime = (time) => {
          const minutes = Math.floor(time / 60);
          const seconds = Math.floor(time - minutes * 60);
          return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
      };

      return () => {
          player = null; 
      };
    }
  }, []);

  return (
    <Container>
      <div className='ye'>
        <div className='mai'>
          <div id="player" className='player'></div>
          <TbRewindBackward10 id="rewind"  className='tem'/>
          <FaPlay id="play" style={{ display: play ? 'none' : 'inline' }} />
          <FaPause id="pause" style={{ display: play ? 'inline' : 'none' }} />
          <TbRewindForward10 id="forward" className='tem'/>


          </div>
          <div id="progress" >
              <div id="progress-bar"></div>
          </div>
          <div id="timestamp"></div>
      </div>

      </Container>
  );
};

export default YouTubeAudioPlayer;

const Container=styled.div`
  .ye{
    margin-left:25%
  }
  .mai{
    margin-left: 18%;
    
  }
  .tem{
    height: 100%;
    justify-content: center;
  }
  #rewind
  {
    font-size: 24px;
    margin-left: 10%;
  }
  #pause{
    font-size: 20px;
    margin-left: 12%;

  }
  #play{
    font-size: 20px;
    margin-left: 12%;

  }
  #forward {
    font-size: 24px; /* Adjust the font size to increase button size */
    margin-left: 10%;
  }
`;
