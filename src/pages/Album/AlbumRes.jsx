import React, { useEffect ,useState} from 'react'
import styled from "styled-components"
import axios from "axios"
import { CgMoreVerticalO } from "react-icons/cg";
import { useStateProvider } from '../../utils/StateProvider';
import { reducerCases } from "../../utils/constants";
import {useNavigate} from "react-router-dom"

export default function AlbumRes({alParam,headerBackground}) {
    const navigate=useNavigate()

    const [Lis, setLis] = useState({});
    const [Lis1, setLis1] = useState({ tracks: [] });

    const [{ selectedPlaylist, selectedPlaylistId,playlists }, dispatch] =useStateProvider();
    const [plists, setPlists] = useState([]);
    const [showMenu, setShowMenu] = useState([]); // State to control menu visibility

    useEffect(()=>{
        const getres=async()=>{
            const token=localStorage.getItem('token')
            const response=await axios.get(`http://127.0.0.1:5000/album`,{
              headers: {
                  Authorization: "Bearer " + token,
                  "Content-Type": "application/json",
                  "Album-Param": alParam
              },
          })
          console.log(response.data)
          
          const tracks = response.data.tracks;
          const selectedPlaylist= {
            id: response.data.album_id,
            name: response.data.album_name,
           image:response.data.image,
            tracks:[],
            rel_date:response.data.rel_date,
            tot_duration:response.data.total_duration,
          };
          const selectedPlaylist1 = {
            tracks:[]
          };
          for (let i = 0; i < tracks.length; i++) {
                const trackData = tracks[i];
                if (!trackData) {
                console.error("Invalid track data:", trackData);
                continue; // Skip to the next iteration if track data is invalid
                }
                
                var artists=[]
                var mar=JSON.stringify(trackData.artists);
                var ke=JSON.parse(mar)
                // var mai=JSON.parse(ke);
                ke.forEach(obj => {
                var temp={
                    'artist_id':obj.artist_id,
                    'artist_name':obj.artist_name,
                }
                artists.push(temp)
                });
                console.log(artists)
                const trackObject = {
                id: trackData.song_id,
                name: trackData.song_name,
                artists: artists,
                image: trackData.image,
                album: trackData.album,
                video_id:trackData.video_id,
                album_id:trackData.album_id
                };
                selectedPlaylist.tracks.push(trackObject);
                selectedPlaylist1.tracks.push(trackObject);
                var car=[]
                for(var j=0;j<selectedPlaylist.length;j++)
                {
                    var cd=false;
                    car.append(cd)
                }
                setShowMenu(car)
                setLis(selectedPlaylist)
                console.log(Lis.tracks)
                setLis1(selectedPlaylist1)
            }
    
        }
        getres()
    },[])
    const playTrack = async (
        id,
        name,
        artists,
        image,
        video_id
      ) => {
        const token = localStorage.getItem('token');
        const response = await axios.put(
          `http://127.0.0.1:5000/change-current/${id}`,
          {
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.status === 204) {
          const currentPlaying = {
            id,
            name,
            artists,
            image,
            video_id
          };
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
          dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
          window.location.reload();
  
        } else {
          dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
        }
      };
      const fetchPlaylists = (index) => {
        console.log("hello")
        
        setPlists(playlists)    
        console.log(plists)
        setShowMenu(prevState => ({
          ...prevState=false,
          [index]: !prevState[index] // Toggle the state for the clicked row
      }))
    }
    const addtoplay=async (play_id,id)=>{
      const token = localStorage.getItem('token');
      console.log(play_id," ",id)
      const response=await axios.post(`http://127.0.0.1:5000/addtoplay`,{ play_id: play_id, song_id: id },{
        headers:{ 
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        }
      })
      console.log(response)

      if(response.ok)
      {
        console.log("Successful")
      }
      else{
        console.log("no")

      }
    };
  return (
    <Container >
      {Lis && (
        <>
          <div className="playlist">
            <div className="image">
              <img src={Lis.image} alt="selected playlist" />
            </div>
            <div className="details">
              <span className="type">ALBUM</span>
              <h1 className="title">{Lis.name}</h1>
            </div>
          </div>
          <div className="list">
            <div className="header-row">
              <div className="col">
                <span>#</span>
              </div>
              <div className="col">
                <span>TITLE</span>
              </div>
              <div className="col">
                <span>ALBUM</span>
              </div>
              <div className="col">
                <span>ARTISTS</span>
              </div>
              <div className="col">
                <span>ACTION</span>
              </div>
              
            </div>
            <div className="tracks">
              {Lis1.tracks.map(
                (
                  {
                    id,
                    name,
                    artists,
                    image,
                    album,
                    video_id,
                    album_id
                  },
                  index
                ) => {
                  return (
                    <div
                      className="row"
                      key={id}
                    >
                      <div className="col" onClick={() =>
                        playTrack(
                          id,
                          name,
                          artists,
                          image,
                          video_id
                        )}>
                        <span>{index + 1}</span>
                      </div>
                      <div className="col detail" onClick={() =>
                        playTrack(
                          id,
                          name,
                          artists,
                          image,
                          video_id
                        )}>
                        <div className="image">
                          <img src={image} alt="track" />
                        </div>
                        <div className="info">
                          <span className="name">{name}</span>
                        </div>
                      </div>
                      <div className="col">
                        <span className="albumLink" onClick={()=>{navigate(`/album/${album_id}`)}}>{album}</span>
                      </div>
                      <div className="col">
                          <span>
                          {artists.map(({ artist_id, artist_name }, index) => {
                            const handleClick = () => {
                              navigate(`/artist/${artist_id}`); 
                            };

                            return (
                              <React.Fragment key={artist_id}>
                                <span className="albumLink" onClick={handleClick}>{artist_name}</span>
                                {index !== artists.length - 1 && ", "}
                              </React.Fragment>
                            );
                          })}
                          </span>
                      </div>

                      <div className='col'>
                      <CgMoreVerticalO  onClick={()=>fetchPlaylists(index)}/>
                        
                      {showMenu[index] && (
                                        <PlaylistsBox>
                                            <h5>Playlists</h5>
                                            <ul>
                                            {plists.map(({ play_id, play_name }) => (
                                            <li key={play_id} onClick={()=>addtoplay(play_id,id)}>{play_name}</li>
                                            ))}
                                            </ul>
                                        </PlaylistsBox>
                                    )}
                        </div>
                      
                    </div>
                  );
                }
              )}
                </div>
              </div>
          </>
        )
            
        }
        </Container>
  )
}
const Container = styled.div`
  .playlist {
    margin: 0 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    .image {
      img {
        height: 15rem;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
      }
    }
    .details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      color: #e0dede;
      .title {
        color: white;
        font-size: 4rem;
      }
    }
  }
  .albumLink {
    display: inline-block;
    transition: background-color 0.3s, text-decoration 0.3s;
    cursor: pointer;
}

.albumLink:hover {
    text-decoration: underline;
    color: #fff
  }
  .list {
  .header-row {
    display: grid;
    grid-template-columns: 2.5fr 2.0fr 1.9fr 3fr 0.5fr;
    margin: 1rem 0 0 0;
    color: #dddcdc;
    position: sticky;
    top: 15vh;
    padding: 1rem 3rem;
    transition: 0.3s ease-in-out;
    background-color: ${({ headerBackground }) =>
      headerBackground ? "#000000dc" : "none"};
  }
  .tracks {
    margin: 0 2rem;
    display: flex;
    flex-direction: column;
    margin-bottom: 5rem;
    .row {
      padding: 0.5rem 1rem;
      display: grid;
      grid-template-columns: 0.3fr 4fr 2fr 3fr 0.5fr;
      &:hover {
        background-color: rgba(0, 0, 0, 0.7);
      }
      .col {
        display: flex;
        align-items: center;
        color: #dddcdc;
        img {
          height: 40px;
          width: 40px;
        }
      }
      .detail {
        display: flex;
        gap: 1rem;
        .info {
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
}
`;  
const PlaylistsBox = styled.div`
  position: fixed  ;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top:175px;
  right:10px;
  width:135px;  
  max-height: 200px; 
  overflow-y: auto;
  h5 {
    margin-bottom: 10px;
  }
  
  ul {
   
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;

    margin: 0;
    
  }
  
  li {
    margin-bottom: 5px;
    font-size: 16px;
    transition: 0.3s ease-in-out;
    cursor: pointer;
    &:hover {
        color: white;
    }
  }
`;