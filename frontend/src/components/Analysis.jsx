import React, { useState, useContext } from 'react';
import WebsiteAdminFinder from '../apis/WebsiteAdminFinder';
import { Context } from '../context/Context';

const Analysis = () => {
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

    const {analysis} = useContext(Context)


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          const response = await WebsiteAdminFinder.post("/admin", {
              text_message: text_message,
          })
          analysis(response.data.data.result);
          console.log(response);
        } catch (err) {
  
        }
    }

    return <div className='mb-4'>
    <h1 style = {head2}>Do Analysis! </h1>
    <form action="">
        <div className="form-row">
          <center><button onClick={handleSubmit} type = "submit" className="btn btn-warning btn-lg">Analysis</button></center>          
        </div>
    </form>
</div>;
}

export default Analysis;