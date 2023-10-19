import React,{useState} from 'react'
import Ehizua from "../assets/Ehizua-Hub-Logo-PNG-1536x211.png";
import { Link } from 'react-router-dom';
import Ehz1 from "../assets/ehz1.avif";
import {HiOutlineQueueList} from "react-icons/hi2";
import {LiaTimesSolid} from "react-icons/lia"



const Home = () => {
  const[nav,setNav] = useState(false);

  function click(){
     setNav(!nav)
  }
  return (
    <div>
      <div className='flex justify-around items-center h-20 w-full px-24 bg-white-400 border-solid shadow-lg'>
      <div className='text-[30px]'><img className='w-[150px]' src={Ehizua} alt='pivc'/></div>
      <div class="space-x-6 hidden lg:block text-blue-500 font-extrabold uppercase">
        {/* <a href="/">Home</a> */}
        <a href="#Courses">Courses</a>
        <a href="#tutors">Tutors</a>
        {/* <a href="#about">About</a> */}
      </div>
      
      <div class="space-x-3 hidden xl:block ">
        <Link to="/adminlogin">
        <button  class="font-semibold border rounded-3xl p-2 border-black hover:bg-blue-950  hover:text-white">Student sign In</button>
        </Link>
        <Link
          to="/studentlogin"
          class="font-semibold border rounded-3xl p-2 border-black hover:bg-blue-950  hover:text-white"
        >
          Admin Login
        </Link>
      </div>

      
      <button onClick={click} className="flex xl:hidden ">
        {
              nav? <LiaTimesSolid size={32}/> :
               <HiOutlineQueueList size={32}/>
            }
        </button>
          
      

    </div>

    {
          nav?   <div className=" xl:hidden w-full bg-[#134574] h-screen text-white absolute top-[80px] right-0 flex flex-col space-y-8 justify-center items-center z-50">
          
          <Link to="/studentlogin" className='border bg-[#134574] text-white px-6 py-3'>Student Sign In</Link>
          <Link to="/adminlogin" className='border bg-[#134574] text-white px-6 py-3'>Admin Login</Link>
          </div> : ""
        }



    



      <section class="flex w-[100%] h-[540px] mt-6  relative ">
        <div class="mx-auto lg:w-[50%] relative p-6">
          <h1 class="mx-10 font-bold text-[20px] lg:text-[35px] ">
            Get world class <br /> courses from world class mentors
          </h1>
          <p class="mx-10 text-[10px] lg:text-[20px] ">
            Get quality courses with us with the best price. Now you can get the
            best course from us. we have top mentors in Hub
          </p>
          <div class="mx-10 my-10 flex items-center">
            <Link
              class=" p-3 bg-blue-900 text-white rounded-xl"
              to="/stafflogin"
            >
              Get started
            </Link>

            <button>
              <i class="bx bx-play  ml-4 border-1 rounded-full p-3 border-black"></i>{" "}
              How it works?
            </button>
          </div>
        </div>
        <div className='w-[0%] lg:w-[50%]'>
          <img src={Ehz1}/>
        </div>
      </section>






      <section class=" p-6 ">
        <h1 class="mx-auto flex font-bold text-3xl justify-center text-blue-700">
          Our popular courses
        </h1>
        <div class="flex flex-col lg:flex-row space-x-6 mt-6 justify-center items-center">
          <a class="font-bold" href="">
            All categories
          </a>
          <a href="">Front End</a>
          <a href="">Back-End</a>
          <a href="">Full stack</a>
          <a href="">Ui/Ux Design</a>
          <a href="">Business</a>
          <a href="">Desktop publishing</a>
          <a href="">Cinematography</a>
        </div>
      </section>
    </div>
  )
}

export default Home
