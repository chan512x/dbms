import React, { useEffect,useState } from 'react';
import styled from "styled-components"
import { reducerCases } from '../../utils/constants';
import { useStateProvider } from '../../utils/StateProvider';
import axios from "axios"
import { CiSquarePlus } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { FaRegTrashAlt } from "react-icons/fa";
import {useNavigate} from "react-router-dom"

import { CiTrash } from "react-icons/ci";


export default function FetchPlaylists() {
    const navigate=useNavigate()
    const [{ token,playlists }, dispatch] = useStateProvider();
    const [showInput, setShowInput] = useState(false);
    const [playlistName, setPlaylistName] = useState("");
    useEffect(() => {
        const fetchPlaylists = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(
                    "http://127.0.0.1:5000/playlists",
                    {
                        headers: {
                            Authorization: "Bearer " + token,
                            "Content-Type": "application/json",
                        },
                    }
                );
                const  items  = response.data;
                console.log(items)
                const playlists = items.map(({ play_name, play_id }) => {
                    return { play_name, play_id };
                });
                console.log(playlists)
                dispatch({ type: reducerCases.SET_PLAYLISTS, playlists: playlists});
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };
        fetchPlaylists();
    }, [ dispatch ]);

    const changeCurrentPlaylist = (selectedPlaylistId) => {
        navigate('/layout')
        dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId });
    };
    const toggleInput = () => {
        setShowInput(!showInput);
        setPlaylistName("");
    };

    const handleInputChange = (e) => {
        setPlaylistName(e.target.value);
    };
    const insPlay = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                `http://127.0.0.1:5000/addplaylist/${playlistName}`,
                {},
                {
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json",
                    }
                }
            );
            if (response.status === 201) {
                console.log("Playlist added successfully");
                const newPlaylist = { play_name: playlistName, play_id: response.data.play_id };
                const updatedPlaylists = [...playlists, newPlaylist];
                dispatch({ type: reducerCases.SET_PLAYLISTS, playlists: updatedPlaylists });
                setShowInput(!showInput);

            } else {
                console.log("Failed to add playlist");
            }
        } catch (error) {
            console.error("Error adding playlist:", error);
        }
    }
    const delet=async(play_id)=>{
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(
                `http://127.0.0.1:5000/playlists/${play_id}`,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json",
                    }
                }
            );
            if (response.status === 200) {
                console.log("Playlist deleted successfully");
                const updatedPlaylists = playlists.filter(playlist => playlist.play_id !== play_id);
                dispatch({ type: reducerCases.SET_PLAYLISTS, playlists: updatedPlaylists });

            }
        } catch (error) {
            console.error("Error adding playlist:", error);
        }
    }
    return (
        <Container>
            <h3>
            Playlists
                {showInput ? (
                    <MdCancel onClick={toggleInput} style={{marginLeft: "7.5rem"}}/>
                ) : (
                    <CiSquarePlus onClick={toggleInput} style={{marginLeft: "7.5rem"}}/>
                )}
            </h3>
            {showInput && (
                <div>
                <Input  
                    type="text"
                    value={playlistName}
                    onChange={handleInputChange}
                    placeholder="Enter playlist name"
                />
                <TiTick style={{marginLeft: "1.0rem"}} onClick={insPlay}/>
                </div>
            )
            }
            <ul>
                {playlists.map(({ play_name, play_id }) => {
                    return (
                        <li key={play_id} onClick={() => changeCurrentPlaylist(play_id)}>
                            {play_name}
                            <CiTrash style={{marginLeft:"0.5rem"}} onClick={() => delet(play_id)}/> 
                        </li>
                    );
                })}
            </ul>
        </Container>
    );
}

const Container = styled.div`
    color: #b3b3b3;
    height: 100%;
    overflow: hidden;
    ul {
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        height: 55vh;
        max-height: 100%;
        overflow: auto;
        &::-webkit-scrollbar {
            width: 0.7rem;
            &-thumb {
                background-color: rgba(255, 255, 255, 0.6);
            }
        }
        li {
            transition: 0.3s ease-in-out;
            cursor: pointer;
            &:hover {
                color: white;
            }
        }
    }
`;
const Input = styled.input`
    margin-top: 10px;
    padding: 5px;
    width: 75%;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
    &:focus {
        border-color: #007bff;
        box-shadow: 0 0 0 0.1rem rgba(0,123,255,.25);
    }
`;