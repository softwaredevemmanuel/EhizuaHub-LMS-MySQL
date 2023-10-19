import React from "react";
import img from "../assets/Ehizua-Hub-Logo-PNG-1536x211.png";
import { Link } from "react-router-dom";
import {HiOutlineQueueList} from "react-icons/hi2";
import {GiLaurelsTrophy} from "react-icons/gi"

const StudentNav = () => {
  return (
    <nav className="flex justify-between w-full h-[80px] border-b items-center px-[100px]">
      <div className="w-[200px]">
        <img src={img} alt="ehz" />
      </div>
      <div className="xl:flex items-center space-x-10 hidden">
        <button className="border bg-[#134574] text-white px-4 py-3">
          Welcome Nonso
        </button>
        <button className=" flex items-centerborder bg-[#134574] text-white px-4 py-3 gap-x-4">
          Download Certificate  <GiLaurelsTrophy size={30}/>
        </button>
        <Link  to="/studentlogin" className="border bg-[#134574] text-white px-6 py-3">Logout</Link>
      </div>
      <button className="flex xl:hidden"><HiOutlineQueueList size={32}/></button>
    </nav>
  );
};

export default StudentNav;
