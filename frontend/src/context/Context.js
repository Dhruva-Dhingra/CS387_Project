import React, { useState, createContext } from "react";

export const Context = createContext();

export const ContextProvider = (props) => {
    const [search, setSearchBox] = useState("")
    const [friendRequest, setFriendRequest] = useState("")
    const [text_message, setTextMessage] = useState("")
    
    return (
        <Context.Provider
            value={{
                search, setSearchBox,
                friendRequest, setFriendRequest,
                text_message, setTextMessage
            }}
        >
            {props.children}
        </Context.Provider>
    );
};