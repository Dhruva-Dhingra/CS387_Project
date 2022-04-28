import React, { useState, useContext } from 'react';
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

    const {searchBox} = useContext(Context)
    const [search, setSearchBox] = useState("")
    let navigate= useNavigate();
    

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          const response = await SearchBoxFinder.get("/", {
            input : e
          })
          searchBox(response.data.data.search);
          console.log(response);
        } catch (err) {
  
        }
    }


    return <div className='mb-4'>
    <h1 style = {head2}>Search your friends! </h1>
    <form action="">
        <div className="form-row">
          <div className="col">
              <input value = {search} onChange={(e) => setSearchBox(e.target.value)} type="text" className='form-control' placeholder='Search your friends and pages!'/>
          </div>
          <br></br>
          <center><button onClick={handleSubmit} type = "submit" className="btn btn-warning btn-lg">Search</button></center>          
        </div>
    </form>
</div>;
}

export default SearchBox;