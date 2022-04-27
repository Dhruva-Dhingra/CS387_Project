import React, { useContext, useEffect } from "react";
import {Line,Doughnut} from 'react-chartjs-2';
import { useParams } from "react-router-dom";
import { Context } from '../context/Context';
import AdminFinder from '../apis/AdminFinder';
import { useNavigate } from "react-router-dom";

const WebAdminPage = () => {
    
    const {L1, SL1, D1, SD1, L2, SL2, D2, SD2} = useContext(Context);
    let history = useNavigate();
    useEffect( ()=> {
         const fetchData = async () => {
             try {
                 const response = await  AdminFinder.get("/");
                 SL1(response.data.data.num_friends);
                 SD1(response.data.data.frequency);
                 SL2(response.data.data.num_friends);
                 SD2(response.data.data.num_likes);
             } catch (err) {}
         }
         fetchData();
    },[]) 
    
    const handleAdminSelect = (id) => {
        history.push(`/homepage/${id}`);
      };
    
    return (
<div>Welcome to InstiGram

{/* NUMBER OF FRIENDS VS FREQUENCY */}
<Line
      data = {{
                 labels: L1.map((B) => B.num_friends),
                 type: 'line',
                 datasets : [
                 {
                  type: 'line',
                  fill: false,
                  lineTension: 0.5,
                  borderColor:'rgb(54, 162, 235)',
                  backgroundColor: 'rgb(54, 162, 235)',
                  borderWidth: 2,
                  pointRadius: 0,
                data: D1.map ((A) => A.frequency)
                    }],}}
      options = {{plugins:{title:{
        display:true,
        text:'Number of Friends Vs Frequency',
        fontSize:50
      },
      legend:{
        display:true,
        position:'top'
      },}}}/>

{/* NUMBER OF FRIENDS VS AVG NUMBER OF LIKES */}
<Line
      data = {{
                 labels: L2.map((B) => B.num_friends),
                 type: 'line',
                 datasets : [
                 {
                  type: 'line',
                  fill: false,
                  lineTension: 0.5,
                  borderColor:'rgb(54, 162, 235)',
                  backgroundColor: 'rgb(54, 162, 235)',
                  borderWidth: 2,
                  pointRadius: 0,
                data: D2.map ((A) => A.num_likes)
                    }],}}
      options = {{plugins:{title:{
        display:true,
        text:'Number of Friends Vs Number of Likes',
        fontSize:50
      },
      legend:{
        display:true,
        position:'top'
      },}}}/>


</div>
    
    
    
    
    );
};

export default WebAdminPage;