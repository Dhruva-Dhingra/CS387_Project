import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from '../context/Context';
import AddPost  from "../components/AddPost";
import DisplayPost from "../components/DisplayPost";
const TimelinePage = () => {
    return (
<div>Timeline!
    <AddPost></AddPost>
    <DisplayPost></DisplayPost>
</div>
    );
};

export default TimelinePage;