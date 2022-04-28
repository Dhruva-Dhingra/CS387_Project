import React, { useContext, useEffect } from "react";
import {Line,Doughnut} from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import { useParams } from "react-router-dom";
import { Context } from '../context/Context';
import AdminFinder from '../apis/AdminFinder';
import { useNavigate } from "react-router-dom";

const WebAdminPage = () => {
    
  
    const {L1, SL1, D1, SD1, L2, SL2, D2, SD2} = useContext(Context);
    
    useEffect( ()=> {
         const fetchData = async () => {
             try {
                 const response = await  AdminFinder.get("/");
                 console.log(response)
                 const arr1 = response.data.data.r1.map(x => x.num_friends);
                 const arr2 = response.data.data.r1.map(x => x.frequency);
                 SL1(arr1);
                 SD1(arr2);
             } catch (err) {console.log(err.stack);}
         }
          fetchData();
    },[]) 
    
    
    return (
<div>Welcome to InstiGram

{/* NUMBER OF FRIENDS VS FREQUENCY */}
<Line
      data = {{
                 labels: L1,
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
                data: D1
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
{/* <Line
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
      },}}}/> */}


</div>
    
    
    
    
    );
};

export default WebAdminPage;