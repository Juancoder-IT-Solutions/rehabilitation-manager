'use client'
const Footer = () => {
    return (
        <footer className="footer footer-transparent d-print-none">
            <div className="container-xl">
                <div className="row text-center align-items-center flex-row-reverse">
                    <div className="col-lg-auto ms-lg-auto">
                        <ul className="list-inline list-inline-dots mb-0">
                            <li className="list-inline-item"><a href="./documentation" target="_blank" className="link-secondary" rel="noopener">Documentation</a></li>
                        </ul>
                    </div>
                    <div className="col-12 col-lg-auto mt-3 mt-lg-0">
                        <ul className="list-inline list-inline-dots mb-0">
                            <li className="list-inline-item">Copyright &copy; 2025
                                <a href="./" className="link-secondary"> E&S Food Products, Inc</a>. All rights reserved.
                            </li>
                            <li className="list-inline-item">
                                <a href="./change-log" className="link-secondary" rel="noopener">v0.0.1</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer