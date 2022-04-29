import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from '../context/Context';
import AddPost  from "../components/AddPost";
import DisplayPostTimeline from "../components/DisplayPostTimeline";
import DisplayAbout from "../components/About";
const TimelinePage = () => {
    return (
<div>
    {/* <DisplayAbout></DisplayAbout> */}
    <DisplayPostTimeline></DisplayPostTimeline>
</div>
    );
};

export default TimelinePage;