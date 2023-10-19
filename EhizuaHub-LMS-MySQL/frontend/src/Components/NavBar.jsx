import React,{useState} from 'react';
import img from "../assets/Ehizua-Hub-Logo-PNG-1536x211.png";
import { Link } from 'react-router-dom';
import {HiOutlineQueueList} from "react-icons/hi2";
import {LiaTimesSolid} from "react-icons/lia"


const NavBar = ({clicks}) => {
   
  const[nav,setNav] = useState(false)

 function click(){
    setNav(!nav)
    clicks()
 }


  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 flex justify-between border-b h-[80px] items-center px-48 shadow-md z-[10px] bg-transparent">
         <div className="w-[250px] mx-[40px]">
            <img src={img} alt="img" />
         </div>
         <div className="space-x-20 hidden xl:flex font-extrabold text-blue-900" >   
           <Link className="hover:underline hover:ease-out hover:duration-300 hover:animate-pulse" to="/upskill">Upskill</Link>
            <Link className=" hover:underline hover:ease-out hover:duration-300 hover:animate-pulse" to="/creativetech">Creative Technology Program</Link>
            <Link className=" hover:underline hover:ease-out hover:duration-300 hover:animate-pulse" to="/about">About</Link>
            <Link className=" hover:underline hover:ease-out hover:duration-300 hover:animate-pulse" to="/hubs">Hubs</Link>
         </div>   
        <div>
           {/* {}  */}
        </div>
        <button onClick={click} className="flex xl:hidden">
        {
              nav? <LiaTimesSolid size={32}/> :
               <HiOutlineQueueList size={32}/>
            }
        </button>
       
      </nav>
    </div>
  )
}

export default NavBar
