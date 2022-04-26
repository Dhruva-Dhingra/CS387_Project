import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import SendMessage from "../components/SendMessage";
import { Context } from '../context/Context';

const MessagePage = () => {
    return (
<div>Messages!
<SendMessage/>
</div>
    );
};

export default MessagePage;