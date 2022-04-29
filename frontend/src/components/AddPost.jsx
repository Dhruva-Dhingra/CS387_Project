import React, { useState, useContext } from 'react';
import PostFinder from '../apis/PostFinder';
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
      console.log("Post Frontend");  
      e.preventDefault()
        try {
          const response = await PostFinder.post("/", {
              content: content,
              textcontent: textcontent
          })
          console.log("Post Frontend Done");
        } catch (err) {
  
        }
    }

    return <div className='mb-4'>
    <h1 style = {head2}>Add a Post</h1>
    <form action="">
        <div className="form-row">
        <div className="col">
                <input value = {textcontent} onChange={(e) => settextcontent(e.target.textcontent)} type="text" className='form-control' placeholder='Text'/>
            </div>
            <div className="col">
                <input value = {content} onChange={(e) => setcontent(e.target.content)} type="file" className='form-control' placeholder='Content'/>
            </div>
            <br></br>
          <center><button onClick={handleSubmit} type = "submit" className="btn btn-warning btn-lg">Post</button></center>          
        </div>
    </form>
</div>;
}



export default AddPost;
