import React, { useState, useContext } from 'react';
import TimelineFinder from '../apis/TimelineFinder';
import { Context } from '../context/Context';

const AddPost = () => {

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

    const {addPost} = useContext(Context)
    const [content, setcontent] = useState("")
    const [textcontent, settextcontent] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          const response = await TimelineFinder.post("/:id", {
              content: content,
              textcontent: textcontent
          })
          addPost(response.data.data.venue);
          console.log(response);
        } catch (err) {
  
        }
    }

    return <div className='mb-4'>
    <h1 style = {head2}>Add a Post</h1>
    <form action="">
        <div className="form-row">
        <div className="col">
                <input value = {textcontent} onChange={(e) => settextcontent(e.target.value)} type="number" className='form-control' placeholder='Capacity'/>
            </div>
            <div className="col">
                <input value = {content} onChange={(e) => setcontent(e.target.value)} type="number" className='form-control' placeholder='Capacity'/>
            </div>
            <br></br>
          <center><button onClick={handleSubmit} type = "submit" className="btn btn-warning btn-lg">Post</button></center>          
        </div>
    </form>
</div>;
}



export default AddPost;
