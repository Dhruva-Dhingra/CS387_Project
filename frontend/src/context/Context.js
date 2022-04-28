import React, { useState, createContext } from "react";

export const Context = createContext();

export const ContextProvider = (props) => {
    const [search, setSearchBox] = useState("");
    const [friendRequest, setFriendRequest] = useState("");
    const [text_message, setTextMessage] = useState("");
    const [first, setfirst] = useState("");
    const [last, setlast] = useState("");
    const [isDisabled, setisDisabled] = useState(true);
    const [isNextDisabled, setisNextDisabled] = useState(false);
    const [email, setemail] = useState("");
    const [pswd, setpswd] = useState("");
    const [residence, setresidence] = useState("");
    const [bday, setbday] = useState("");
    const [dp, setdp] = useState("");
    const [hidden, setprivate] = useState("");
    const [autoadd, setautoadd] = useState("");
    const [friends, setFriends] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [postscount, spostscount] = useState(0);
    const [L1, SL1] = useState([]);
    const [L2, SL2] = useState([]);
    const [D1, SD1] = useState([]);
    const [D2, SD2] = useState([]);
    const [msgs, setMsg] =  useState([]);
    const [L3, SL3] = useState([]);
    const [L4, SL4] = useState([]);
    const [D3, SD3] = useState([]);
    const [D4, SD4] = useState([]);
    const [L5, SL5] = useState([]);
    const [D5, SD5] = useState([]);
    const [posts, setPosts] = useState([]);
    
    return (
        <Context.Provider
            value={{
                search, setSearchBox,
                msgs, setMsg,
                friendRequest, setFriendRequest,
                text_message, setTextMessage,
                friends, setFriends,
                isNextDisabled, setisNextDisabled,
                L1, SL1,
                L2, SL2,
                D1, SD1,
                D2, SD2,
                L3, SL3,
                L4, SL4,
                D3, SD3,
                D4, SD4,
                L5, SL5,
                D5, SD5,
                itemOffset, setItemOffset,
                pageCount, setPageCount,
                postscount, spostscount,
                isDisabled, setisDisabled,
                posts, setPosts
            }}
        >
            {props.children}
        </Context.Provider>
    );
};
