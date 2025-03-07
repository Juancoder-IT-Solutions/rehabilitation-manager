'use client'
import Footer from "../components/Footer"

const ServicesPage = () => {

    
    return (
        <div className="page-wrapper">
            
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">
                  Datatables
                </h2>
              </div>
            </div>
          </div>
        </div>
        
        <div className="page-body">
          <div className="container-xl">
            <div className="card">
              <div className="card-body">
                <div id="table-default" className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th><button className="table-sort" data-sort="sort-name">Name</button></th>
                        <th><button className="table-sort" data-sort="sort-city">City</button></th>
                        <th><button className="table-sort" data-sort="sort-type">Type</button></th>
                        <th><button className="table-sort" data-sort="sort-score">Score</button></th>
                        <th><button className="table-sort" data-sort="sort-date">Date</button></th>
                        <th><button className="table-sort" data-sort="sort-quantity">Quantity</button></th>
                      </tr>
                    </thead>
                    <tbody className="table-tbody">
                      <tr>
                        <td className="sort-name">Storm Chaser</td>
                        <td className="sort-city">Kentucky Kingdom, United States</td>
                        <td className="sort-type">RMC Steel</td>
                        <td className="sort-score">97,9%</td>
                        <td className="sort-date" data-date="1564805623">August 03, 2019</td>
                        <td className="sort-quantity">43</td>
                      </tr>
                      <tr>
                        <td className="sort-name">Helix</td>
                        <td className="sort-city">Liseberg, Sweden</td>
                        <td className="sort-type">Mack Looper, Steel, Terrain</td>
                        <td className="sort-score">97,9%</td>
                        <td className="sort-date" data-date="1633500491">October 06, 2021</td>
                        <td className="sort-quantity">151</td>
                        
                      </tr>
                      <tr>
                        <td className="sort-name">Outlaw Run</td>
                        <td className="sort-city">Silver Dollar City, United States</td>
                        <td className="sort-type">RMC Hybrid</td>
                        <td className="sort-score">96,6%</td>
                        <td className="sort-date" data-date="1547084027">January 10, 2019</td>
                        <td className="sort-quantity">131</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
}

export default ServicesPage