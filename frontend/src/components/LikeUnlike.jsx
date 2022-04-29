import React, { useState, useContext, useEffect } from 'react';
import LikeUnlikeFinder from '../apis/LikeUnlikeFinder';
import { Context } from '../context/Context';

const LikeUnlike = (inp) => {
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

    const [reactionCount, setReactionCount] = useState(0);
    
    useEffect( ()=> {
         const fetchData = async () => {
             try {
                const response = await LikeUnlikeFinder.post("/get_single_reaction_count", {
                  post_id : inp.post_id,
                });
                setReactionCount(response.data[0].reaction_count);
                setTimeout(() => {fetchData()}, 1000);
             } catch (err) {console.log(err.stack);
            console.log(err.stack)}
         }
         fetchData();
    },[]) 
    
    const handleLike = async (e) => {
        e.preventDefault()
        try {
         await LikeUnlikeFinder.post("/react", {
            'post_id' : inp.post_id,
            'reaction' : 0,
        }).then(response => {
            if(response.data.status === "success"){
            console.log("Post " + inp.post_id + " Liked!");
            } else {
            console.log("Post " + inp.post_id + " could not be Liked");
            }
        });
        } catch (err) {console.log(err.stack)}
    }

    const handleUnLike = async (e) => {
        e.preventDefault()
        try {
      await LikeUnlikeFinder.post("/unreact", {
            'post_id' : inp.post_id,
            'reaction' : 0,
        }).then(response => {
            if(response.data.status === "success"){
            console.log("Post " + inp.post_id + " unliked!");
            } else {
            console.log("Post " + inp.post_id + " could not be unliked");
            }
        });
    } catch (err) {console.log(err.stack)}
    }

return <div className='mb-4'>
<form action="">
        <div>
          <center>{reactionCount}</center>          
        </div>
        <div className="form-row">
          <center><button onClick={handleLike} type = "submit" className="btn btn-warning btn">Like</button></center>          
        </div>
        <div className="form-row">
          <center><button onClick={handleUnLike} type = "submit" className="btn btn-warning btn">Unlike</button></center>          
        </div>
    </form>
</div>;
}

export default LikeUnlike;