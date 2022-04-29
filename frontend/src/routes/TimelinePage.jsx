import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from '../context/Context';
import AddPost  from "../components/AddPost";
import DisplayPostTimeline from "../components/DisplayPostTimeline";
const TimelinePage = () => {
    return (
<div>
    <DisplayPostTimeline></DisplayPostTimeline>
</div>
    );
};

export default TimelinePage;