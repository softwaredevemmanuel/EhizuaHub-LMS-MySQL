import React from 'react'
import './HomePage.css'
import Frame from './Frame.png'


const HomePage = () => {
    return (
        <div className='col box'>

            <div className='row'>
                <div className='col boxa'> </div>

            </div>
            <div className='row'>
                <div className='col boxb d-flex flex-column'>

                    <div className='row'>
                        <div className='col-12 text-white text-center'>
                            <h6 className='pt-4 m-2 d-flex flex-column reduced-font-home emma'>Evaluate your learning with every click</h6>
                            <button className="m-4 btn btn-primary button-custom">
                                Create Memo
                            </button>
                        </div>


                    </div>

                </div>
            </div>

            <div className='container'>
                <div className='row  justify-content-center'>
                    <div className='col-9 boxa'>
                        <div className='row'>
                            <div className='col-6 col-sm-4 col-lg-6 boxc'>
                                {/* Content for the first box */}
                            </div>
                            <div className='col-6 col-sm-4 col-lg-6 boxc'>
                                {/* Content for the second box */}
                            </div>
                            <div className='col-6 col-sm-4 col-lg-6 boxc'>
                                {/* Content for the third box */}
                            </div>
                            <div className='col-6 col-sm-4 col-lg-6 boxc'>
                                {/* Content for the fourth box */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>






        </div>

    )
}

export default HomePage