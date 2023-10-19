import React, { useState } from 'react';
import ehz from '../assets/Ehizua-Hub-Logo-PNG-1536x211.png'
import { Link } from 'react-router-dom';
import {HiOutlineQueueList} from "react-icons/hi2";
import {LiaTimesSolid} from "react-icons/lia";

const NavLoggedIn = () => {
const[nav,setNav] = useState(false)

 function click(){
    setNav(!nav)
 }

  return (
    <div>
       <nav className='fixed top-0 right-0 left-0 z-[10px] flex justify-between w-full h-[80px] border-b items-center px-[100px] shadow-lg'>
        <div className='w-[200px]'><img src={ehz} alt="ehz" /></div>
        <div className='hidden xl:flex items-center space-x-10'>
           <div className='border bg-[#134574] text-white px-4 py-3'>Welcome Admin</div>
           <Link to="/adminlogin" className='border bg-[#134574] text-white px-6 py-3'>Logout</Link>
        </div>



        <button className="flex xl:hidden" onClick={click}>
            {
              nav? <LiaTimesSolid size={32}/> :
               <HiOutlineQueueList size={32}/>
            }
              
        </button>
        {
          nav?   <div className=" xl:hidden w-full bg-[#134574] h-screen text-white absolute top-[80px] right-0 flex flex-col space-y-8 justify-center items-center">
          <div className=''>Welcome Admin</div>
          <Link to="/adminlogin" className='border bg-[#134574] text-white px-6 py-3'>Logout</Link>
          </div> : ""
        }
      
      </nav>
    </div>
  )
}

export default NavLoggedIn
