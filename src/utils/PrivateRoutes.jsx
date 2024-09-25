import React, { useEffect } from 'react'
import {useNavigate} from "react-router-dom"
import axios from "axios"
export default function PrivateRoutes(props) {
    const {Component}=props
    const navigate=useNavigate()
    useEffect(()=>{
        const check=async()=>{
        const token=localStorage.getItem('token')
        try{
        const response= await axios.get(`http://127.0.0.1:5000/protected`,{
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
        })
        if(response.status!=200)
        {
          window.location.href = '/'
          // window.location.reload()
        }
        }catch(err){
          window.location.href = '/'
          // window.location.reload()

        }
    }
    check()
    },[])
  return (
    <div>
        <Component/>
    </div>
  )
}
