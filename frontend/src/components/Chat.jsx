import React, { useState, useContext } from 'react';
import TimelineFinder from '../apis/TimelineFinder';
import { Context } from '../context/Context';

const Chat = () => {
    const head = {
        color: '#7c795d', 'fontFamily': 'Trocchi', 
        'fontSize': '60px', 'fontWeight': 'normal', 'lineHeight': '48px', 
        'textAlign': 'center'
      }
      const head2 = {
        color: '#7c795d', 'fontFamily': 'Trocchi', 
        'fontSize': '40px', 'fontWeight': 'normal', 'lineHeight': '48px', 
        'textAlign': 'center'
      }

    // const {chat} = useContext(Context)
    const [chat, setChat] = useState("")
    return (<div>  {chat && chat.map(msg=> {
        return (
     <div>
         { chat.rec ? (<div id = "sent"  style="background-color:green" >chat.content</div>):(<div id = "received">chat.content</div>)
         }
     </div>
            
        )
        
    })}</div>)
}

export default Chat;