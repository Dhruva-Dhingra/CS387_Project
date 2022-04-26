import React, { useState, createContext } from "react";

export const Context = createContext();

export const ContextProvider = (props) => {
    const [search, setSearchBox] = useState("")
    const [friendRequest, setFriendRequest] = useState("")
    const [text_message, setTextMessage] = useState("")
    const [first, setfirst] = useState("")
    const [last, setlast] = useState("")
    const [email, setemail] = useState("")
    const [pswd, setpswd] = useState("")
    const [residence, setresidence] = useState("")
    const [bday, setbday] = useState("")
    const [dp, setdp] = useState("")
    const [hidden, setprivate] = useState("")
    const [autoadd, setautoadd] = useState("")
    const [friends, setFriends] = useState("")
    
    return (
        <Context.Provider
            value={{
                search, setSearchBox,
                friendRequest, setFriendRequest,
                text_message, setTextMessage,
                friends, setFriends
            }}
        >
            {props.children}
        </Context.Provider>
    );
};