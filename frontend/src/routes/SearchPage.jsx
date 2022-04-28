import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import SearchBoxFinder from "../apis/SearchBoxFinder";
import DisplayPostHomepage from "../components/DisplayPostHomepage";
import SearchBox from "../components/SearchBox"
import { Context } from '../context/Context';
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
    
    return (
        <div>
            <SearchBox/>
            </div>
            );
};

export default SearchPage;
