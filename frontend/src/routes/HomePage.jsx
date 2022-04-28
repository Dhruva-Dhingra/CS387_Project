import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import DisplayPostHomepage from "../components/DisplayPostHomepage";
import SearchBox from "../components/SearchBox"
import { Context } from '../context/Context';

const HomePage = () => {
    return (
<div>
    <SearchBox/>
    <DisplayPostHomepage></DisplayPostHomepage>
    Homepage!</div>
    );
};

export default HomePage;