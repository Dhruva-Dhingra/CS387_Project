import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from '../context/Context';
import Messenger from "../components/Messenger";

const MessageBasePage = () => {
    return (
<div>Your Messages!
    <Messenger/>
</div>
    );
};

export default MessageBasePage;