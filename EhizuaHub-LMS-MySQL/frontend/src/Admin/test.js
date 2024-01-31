import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/js/dist/dropdown'
import Logo from './Ehizua-Hub-Logo.png'
import 'bootstrap/js/dist/collapse'
import './SideMenu.css'

const SideMenu = () => {
  return (
    <div className='container-fluid'>
        <div className='row'>
            <div className='col-auto col-sm-3 d-flex flex-column justify-content-between min-vh-100' style={{ backgroundColor: "#134574" }} >
                <div className='mt-2'>
                    <a className='text-decoration-none ms-4 d-flex align-items-center text-white d-none d-md-inline'>
                        <span className='fs-4 bg bg-white pb-2' style={{ paddingLeft: '10px', paddingRight: '10px', paddingBottom: '10px', borderRadius: '8px' }}>
                            <img src={Logo} alt='Logo' style={{ width: '150px' }} />
                        </span>
                    </a>
                    {/* <a className='text-decoration-none ms-4 d-flex align-items-center text-white d-none d-sm-inline' role='button'>
                        <span className='f5-4'> Side Menu</span>
                    </a> */}
                    <hr className='text-white d-none d-md-block'></hr>
                    <ul class="nav nav-pills flex-column mt-2 mt-sm-0" id='parentM'>
                        <li class="nav-item text-white my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i className='bi bi-speedometer2'></i>
                                <span className='ms-2 d-none d-md-inline'> Dashboard</span>
                            </a>
                        </li>
                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#submenu" className="nav-link text-white" data-bs-toggle = "collapse" aria-current="page" >
                                <i class="bi bi-envelope-paper"></i>                                
                                <span className='ms-2 d-none d-md-inline'> Memo</span>
                                <i className='bi bi-arrow-down-short ms-0 ms-sm-3'></i>
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
                                <span className='ms-2 d-none d-md-inline'> EhizuaHub Offices</span>
                            </a>
                        </li>
                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i class="bi bi-people"></i>                                
                                <span className='ms-2 d-none d-md-inline'> Staff Section</span>
                            </a>
                        </li>
                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i class="bi bi-alarm"></i>                                
                                <span className='ms-2 d-none d-md-inline'> Attendance</span>
                            </a>
                        </li>
                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i class="bi bi-box-arrow-right"></i>                                
                                <span className='ms-2 d-none d-md-inline'> Leave Section</span>
                            </a>
                        </li>
                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i class="bi bi-person-raised-hand"></i>
                                <i class="bi bi-envelope-x"></i>                                
                                <span className='ms-2 d-none d-md-inline'> Staff Complaints</span>
                            </a>
                        </li>
                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i class="bi bi-book"></i>
                                <span className='ms-2 d-none d-md-inline'> Courses & Curriculum</span>
                            </a>
                        </li>
                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i class="bi bi-mortarboard"></i>
                                <span className='ms-2 d-none d-md-inline'> Students Section</span>
                            </a>
                        </li>
                      
                       
                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i class="bi bi-graph-down-arrow"></i>
                                <span className='ms-2 d-none d-md-inline'> Course Discount</span>
                            </a>
                        </li>

                        <li class="nav-item my-1 py-2 py-sm-0">
                            <a href="#" className="nav-link text-white" aria-current="page">
                                <i class="bi bi-person-raised-hand"></i>
                                <i class="bi bi-envelope-x"></i> 
                                <span className='ms-2 d-none d-md-inline'> Students Complaints</span>
                            </a>
                        </li>
                        
                       
                    </ul>
                </div>
                
                <div className="dropdown open pb-4">
                        <a href="#" class="btn border-none dropdown-toggle text-white"  id="triggerId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className='bi bi-person f5-4'></i><span className='f5-4 ms-3 d-none d-sm-inline'>Admin</span>
                        </a>
                        <div class="dropdown-menu" aria-labelledby="triggerId">
                            <a class="dropdown-item" href="#">Profile</a>
                            <a class="dropdown-item " href="#">Logout</a>
                        </div>
                </div>


            </div>

        </div>
    </div>
  )
}

export default SideMenu