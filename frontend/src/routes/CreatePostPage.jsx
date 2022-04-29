import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import DisplayPostHomepage from "../components/DisplayPostHomepage";
import AddPost from "../components/AddPost"
import { Context } from '../context/Context';

const CreatePostPage = () => {
    return (
<div>
    <AddPost></AddPost>
    </div>
    );
};

export default CreatePostPage;