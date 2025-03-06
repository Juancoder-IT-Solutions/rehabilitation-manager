'use client'

import sampleController from "../controllers/sample_controller"

const About = () => {

    const test = async () => {
       const data = await sampleController.sample_api()
       console.log(data)
    }

    return (
        <div className="page-wrapper">
            <div className="page-header d-print-none">
                <div className="container-xl">
                    <div className="row g-2 align-items-center">
                        <div className="col">
                            <h2 className="page-title">
                                About
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-body">
                            This is about

                            <button onClick={test}>Click</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About