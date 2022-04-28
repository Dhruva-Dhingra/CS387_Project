import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import SearchBoxFinder from "../apis/SearchBoxFinder";
import DisplayPostHomepage from "../components/DisplayPostHomepage";
import SearchBox from "../components/SearchBox"
import { Context } from '../context/Context';
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
    
    const {L1, SL1} = useContext(Context);
    let history = useNavigate();
    useEffect( ()=>{
        const fetchData = async () => {
            try {
                const response = await SearchBoxFinder.get("/");
                console.log(response);
                SL1 (response.data.data.results);
            } catch (err) {console.log(err.stack);}   
        }
        fetchData();
    },[])
    
    const handlePostSelect = (id) => {
        history.push(`/search`);
      };


    return <div className='list-group'>
        <SearchBox/>
        Your Searches.
    <table className="table table-hover table-dark table-striped table-bordered">
        <thead>
          <tr className='bg-primary'>
              {/* <th scope = "col">Post ID</th> */}
              <th scope = "col">User ID list</th>
          </tr>
        </thead>
        <tbody>
            {L1 && L1.map(search => {
                return (
                  <tr onClick={() => handlePostSelect(search.user_id)} 
                  key={search.user_id}>
                    {/* <td>{posts.post_id}</td> */}
                    <td>{search.user_id}</td>
                </tr>
                )
            })}
        </tbody>
    </table>
</div>;
};

export default SearchPage;
