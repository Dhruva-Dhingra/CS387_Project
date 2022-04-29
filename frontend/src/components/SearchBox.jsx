import React, { useState, useContext, useEffect, useCallback } from 'react';
import HomepageFinder from '../apis/HomepageFinder';
import { Context } from '../context/Context';
import { useNavigate } from 'react-router-dom';
import SearchBoxFinder from '../apis/SearchBoxFinder';

// import { Navigate } from 'react-router-dom';
const SearchBox = () => {

    const head = {
        color: '#7c795d', 'fontFamily': 'Trocchi', 
        'fontSize': '60px', 'fontWeight': 'normal', 'lineHeight': '48px', 
        'textAlign': 'center'
      }
      const head2 = {
        color: '#7c795d', 'fontFamily': 'Trocchi', 
        'fontSize': '40px', 'fontWeight': 'normal', 'lineHeight': '48px', 
        'textAlign': 'center'
      }

    const {resultSB, searchBox} = useContext(Context)
    const [search, setSearchBox] = useState("")
    let navigate= useNavigate();
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await SearchBoxFinder.post("/", {
            'input' : search
          }).then(response => {searchBox(response.data.result); console.log("resultSB = ",resultSB);});
          return true;
        } catch (err) {
          
        }
    }

    const handleOnClick = useCallback((user_id) => navigate(`/timeline/${user_id}`, {replace: true}), [navigate]);
    
    return <div className='mb-4'>
    <h1 style = {head2}>Search your friends! </h1>
    <form action="">
        <div className="form-row">
          <div className="col">
              <input name = "search" value = {search} onChange={(e) => setSearchBox(e.target.value)} type="text" className='form-control' placeholder='Search your friends and pages!'/>
          </div>
          <br></br>
          <center><button onClick={handleSubmit} type = "submit" className="btn btn-warning btn-lg">Search</button></center>          
        </div>
    </form>
    <div className='list-group'>
    <table className="table table-hover table-dark table-striped table-bordered">
        <thead>
          <tr className='bg-primary'>
              <th scope = "col">User ID</th>
              <th scope = "col">First Name</th>
              <th scope = "col">Last Name</th>

              {/* <th scope = "col">F</th> */}
          </tr>
        </thead>
        <tbody>
            {resultSB && resultSB.map(res=> {
                return (
                  //   @T - Do we need more key attributes?
                  <tr  onClick={() => {handleOnClick(res.user_id)}} 
                  key={res.user_id}>
                  <td>{res.user_id}  </td>
                  <td>{res.first_name}</td>
                  <td>{res.last_name}</td>
                 </tr>
                )
                
            })}
        </tbody>
    </table>

</div>
</div>;
}

export default SearchBox;