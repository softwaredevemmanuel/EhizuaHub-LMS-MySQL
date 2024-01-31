import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/js/dist/dropdown'
import Logo from './Ehizua-Hub-Logo.png'
import 'bootstrap/js/dist/collapse'
import './SideMenu.css'
import HomePage from './HomePage';


const SideMenu = () => {

  return (
    <div className='container-fluid'>
        <div className='row'>
            <div className='col-auto d-flex flex-column justify-content-between min-vh-100' style={{ backgroundColor: "#134574" }} >
                
                <div className='mt-2'>
                    <a className='text-decoration-none ms-4 d-flex align-items-center text-white d-none d-md-inline'>
                        <span className='f5-4 bg bg-white pb-2' style={{ paddingLeft: '10px', paddingRight: '10px', paddingBottom: '10px', borderRadius: '8px' }}>
                            <img src={Logo} alt='Logo' style={{ width: '150px' }} />
                        </span>
                    </a>
                  
                    <hr className='text-white d-none d-md-block'></hr>


                    <ul class="nav nav-pills flex-column mt-2 mt-sm-0" id='parentM'>
                        <li class="nav-item text-white my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i className='bi bi-speedometer2'></i>
                                <span className='ms-2 d-none d-md-inline reduced-font-size'> Dashboard</span>
                            </a>
                        </li>
                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#submenu" className="nav-link text-white" data-bs-toggle = "collapse" aria-current="page" >
                                <i class="bi bi-envelope-paper"></i>                                
                                <span className='ms-2 d-none d-md-inline reduced-font-size'> Memo</span>
                                <i className='bi bi-arrow-down-short ms-0 ms-md-3'></i>
                            </a>

                            <ul class="nav collapse ms-2 flex-column" id='submenu' data-bs-parent = "#parentM">
                                <li class="nav-item">
                                    <a class="nav-link  text-white" href="#" aria-current="page">
                                        <span className='d-none d-md-inline'> Item </span>
                                        1
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link text-white" href="#">
                                        <span className='d-none d-md-inline'> Item</span>
                                        2
                                    </a>
                                </li>

                            </ul>
                        </li>

                    

                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i class="bi bi-building-fill-add"></i>                                
                                <span className='ms-2 d-none d-md-inline reduced-font-size'> EhizuaHub Offices</span>
                            </a>
                        </li>
                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i class="bi bi-people"></i>                                
                                <span className='ms-2 d-none d-md-inline reduced-font-size'> Staff Section</span>
                            </a>
                        </li>
                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i class="bi bi-alarm"></i>                                
                                <span className='ms-2 d-none d-md-inline reduced-font-size'> Attendance</span>
                            </a>
                        </li>
                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i class="bi bi-box-arrow-right"></i>                                
                                <span className='ms-2 d-none d-md-inline reduced-font-size'> Leave Section</span>
                            </a>
                        </li>
                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i class="bi bi-person-raised-hand"></i>
                                <span className='ms-2 d-none d-md-inline reduced-font-size'> Staff Complaints</span>
                            </a>
                        </li>
                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i class="bi bi-book"></i>
                                <span className='ms-2 d-none d-md-inline reduced-font-size'> Courses & Curriculum</span>
                            </a>
                        </li>
                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i class="bi bi-mortarboard"></i>
                                <span className='ms-2 d-none d-md-inline reduced-font-size'> Students Section</span>
                            </a>
                        </li>
                      
                       
                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i class="bi bi-graph-down-arrow"></i>
                                <span className='ms-2 d-none d-md-inline reduced-font-size'> Course Discount</span>
                            </a>
                        </li>

                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i class="bi bi-person-raised-hand"></i>
                                <span className='ms-2 d-none d-md-inline reduced-font-size'> Students Complaints</span>
                            </a>
                        </li>

                        
                        
                       
                    </ul>
                </div>

               
                
                <div className="dropdown open pb-4">
                        <a href="#" class="btn border-none dropdown-toggle text-white"  id="triggerId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className='bi bi-person f5-4'></i>
                                <span className='f5-4 ms-3 d-none d-md-inline'>Admin</span>
                        </a>
            

                        <ul class="dropdown-menu" aria-labelledby="triggerId">
                            <li>
                                <a class="dropdown-item" href="#">Profile</a>

                            </li>
                            <li>
                                <a class="dropdown-item " href="#">Logout</a>

                            </li>
                        </ul>
                </div>

                <div className='mt-4 pb-4'>
                    <div class="text-center text-white reduced-font-size1">
                    &copy; 2023
                        <span className='d-none d-md-inline'> <i class="bi bi-building-fill-lock "></i> EhizuaHub-CRM -</span>
                        

                        <a className="text-white d-none d-md-inline" >Privacy</a>
                    </div>

                </div>


            </div>

            <HomePage/> 



        </div>
    </div>
  )
}

export default SideMenu