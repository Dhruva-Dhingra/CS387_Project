import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import SearchBox from "../components/SeachBox";
import { Context } from '../context/Context';

const HomePage = () => {
    return (
<div>
    <SearchBox/>
    Homepage!</div>
    );
};

export default HomePage;