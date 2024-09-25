import React, { useEffect, useRef, useState } from "react";
import Sidebar from '../mainlay/Sidebar';
import Navbar from '../mainlay/Navbar';
import Footer from '../mainlay/Footer';
import TopSongs from './TopSongs';
import styled from "styled-components"
import { useStateProvider } from "../../utils/StateProvider";
import axios from "axios"
import { reducerCases } from "../../utils/constants";
export default function Home() {
  const [{token},dispatch]=useStateProvider()

  const [navBackground, setNavBackground] = useState(false);
  const [headerBackground, setHeaderBackground] = useState(false);
  const bodyRef = useRef();
  const bodyScrolled = () => {
    bodyRef.current.scrollTop >= 30
      ? setNavBackground(true)
      : setNavBackground(false);
    bodyRef.current.scrollTop >= 268
      ? setHeaderBackground(true)
      : setHeaderBackground(false);
  };
  useEffect(()=>{
    const getuserInfo= async ()=>{
      const token = localStorage.getItem('token');

      const response =await axios.get("http://127.0.0.1:5000/protected",
                    {
                        headers: {
                            Authorization: "Bearer " + token,
                            "Content-Type": "application/json",
                        },
                    })
        const data=response.data
        
        const userInfo = {
          userId: data[0].email,
          name: data[0].username
        };
        console.log(userInfo)
        dispatch({ type: reducerCases.SET_USER, userInfo });
      }
    getuserInfo()
  },[dispatch,token])
  return (
    <Container>
        <div className="spotify__body">
            <Sidebar />
            <div className="body" ref={bodyRef} onScroll={bodyScrolled} >
              <Navbar navBackground={navBackground}/>
              <div className="body__contents">
                <TopSongs headerBackground={headerBackground}/>

              </div>
            </div>
          </div>
          <div className="spotify__footer">
            <Footer />
          </div>
    </Container>
  )
}

const Container = styled.div`
max-width: 100vw;
max-height: 100vh;
overflow: hidden;
display: grid;
grid-template-rows: 85vh 15vh;
.spotify__body {
  display: grid;
  grid-template-columns: 15vw 85vw;
  height: 100%;
  width: 100%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 1));
  background-color: rgb(32, 87, 100);
  .body {
    height: 100%;
    width: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.7rem;
      max-height: 2rem;
      &-thumb {
        background-color: rgba(255, 255, 255, 0.6);
      }
    }
  }
}
`;
