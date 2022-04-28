import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import SendMessage from "../components/SendMessage";
import { Context } from '../context/Context';
import DM from "../components/DM";
const MessagePage = () => {
    return (
<div>
<SendMessage/>
<DM></DM>
</div>
    );
};

export default MessagePage;