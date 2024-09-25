import React,{useState} from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useStateProvider } from "../../utils/StateProvider";
import {useNavigate} from "react-router-dom"
export default function Navbar({ navBackground }) {
  const [{ userInfo }] = useStateProvider();
  const[searchq,setSearchq]=useState("")
  const[log,setLog]=useState(false)
  const navigate=useNavigate()

  const handlechange = (event) => {
    setSearchq(event.target.value);
};
  const handleLogout=()=>{
    localStorage.setItem('token','')
    window.location.href = '/'
  }
    const func=async()=>{
      navigate(`/search/${searchq}`);
      window.location.reload()
    }
    return (
      <Container navBackground={navBackground}>
        <div className="search__bar">
          <FaSearch onClick={()=>func()}/>
        <input type="text" placeholder="Artists, songs, or albums" onChange={handlechange}/>
      </div>
      <div className="avatar" onClick={()=>{setLog(!log)}}>  
        <a href={userInfo?.userUrl}>
          <CgProfile  onClick={()=>{setLog(!log)}}/>
          <span >{userInfo?.name}</span>
          {log && (
              <PlaylistsBox>
                  <span onClick={handleLogout}>Logout</span>
              </PlaylistsBox>
          )}
        </a>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  height: 15vh;
  position: sticky;
  top: 0;
  transition: 0.3s ease-in-out;
  background-color: ${({ navBackground }) =>
    navBackground ? "rgba(0,0,0,0.7)" : "none"};
  .search__bar {
    background-color: white;
    width: 30%;
    padding: 0.4rem 1rem;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    input {
      border: none;
      height: 2rem;
      width: 100%;
      &:focus {
        outline: none;
      }
    }
  }
  .avatar {
    background-color: black;
    padding: 0.3rem 0.4rem;
    padding-right: 1rem;
    border-radius: 2rem;
    display: flex;
    cursor:pointer;
    justify-content: center;
    align-items: center;
    a {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: white;
      font-weight: bold;
      svg {
        font-size: 1.3rem;
        background-color: #282828;
        padding: 0.2rem;
        border-radius: 1rem;
        color: #c7c5c5;
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
  margin-top: 72px;
  right:31px;
  width:75px;  
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