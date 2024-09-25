import React, { useEffect } from 'react';
import "./test.css"
const YouTubeAudioPlayer = () => {
    useEffect(() => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = () => {
            new window.YT.Player('player', {
                height: '0',
                width: '0',
                videoId: 'aPiZ--ASZI0',
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
            });
            pauseButton.addEventListener('click', () => {
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
            setInterval(() => {
                document.getElementById('timestamp').innerHTML = formatTime(event.target.getCurrentTime()) + ' / ' + formatTime(event.target.getDuration());
                const progressWidth = (event.target.getCurrentTime() / event.target.getDuration()) * 100;
                progressBar.style.width = progressWidth + '%';
            }, 1000);
        };

        // Event handler for player state change
        const onPlayerStateChange = (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
                event.target.stopVideo();
            }
        };

        // Format time function
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time - minutes * 60);
            return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        };

        return () => {
            window.onYouTubeIframeAPIReady = null; // Clean up the global callback
        };
    }, []);

    return (
        <div>
            <div id="player"></div>
            <button id="play">Play</button>
            <button id="pause">Pause</button>
            <button id="rewind">Rewind 10s</button>
            <button id="forward">Forward 10s</button>
            <div id="progress" >
                <div id="progress-bar"></div>
            </div>
            <div id="timestamp"></div>
        </div>
    );
};

export default YouTubeAudioPlayer;
