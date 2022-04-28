import React, { useContext, useEffect } from "react";
import {Line,Doughnut} from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import { useParams } from "react-router-dom";
import { Context } from '../context/Context';
import AdminFinder from '../apis/AdminFinder';
import { useNavigate } from "react-router-dom";

const WebAdminPage = () => {
    
  
    const {L1, SL1, D1, SD1, L2, SL2, D2, SD2, L3, SL3, D3, SD3, L4, SL4, D4, SD4, L5, SL5, D5, SD5} = useContext(Context);
    
    useEffect( ()=> {
         const fetchData = async () => {
             try {
                 const response = await  AdminFinder.get("/");
                 console.log(response)
                 const arr1 = response.data.data.r1.map(x => x.num_friends);
                 const arr2 = response.data.data.r1.map(x => x.frequency);
                 const arr3 = response.data.data.r2.map(x => x.num_friends);
                 const arr4 = response.data.data.r2.map(x => x.avg_likes);
                 const arr5 = response.data.data.r3.map(x => x.hour);
                 const arr6 = response.data.data.r3.map(x => x.hourly_frequency);
                 const arr7 = response.data.data.r4.map(x => x.weekday);
                 const arr8 = response.data.data.r4.map(x => x.weekday_frequency);
                 const arr9 = response.data.data.r5.map(x => x.day);
                 const arr10 = response.data.data.r5.map(x => x.day_frequency);
                 SL1(arr1);
                 SD1(arr2);
                 SL2(arr3);
                 SD2(arr4);
                 SL3(arr5);
                 SD3(arr6);
                 SL4(arr7);
                 SD4(arr8);
                 SL5(arr9);
                 SD5(arr10);
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
                   label: 'Frequency vs Number of Friends',
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
        display:false,
        text:'Frequency vs Number of Friends',
        fontSize:50
      },}}}/>

<Line
      data = {{
                 labels: L2,
                 type: 'line',
                 datasets : [
                 {
                  label : 'Number of Likes vs Number of Friends',
                  type: 'line',
                  fill: false,
                  lineTension: 0.5,
                  borderColor:'rgb(54, 162, 235)',
                  backgroundColor: 'rgb(54, 162, 235)',
                  borderWidth: 2,
                  pointRadius: 0,
                data: D2
                    }],}}
      options = {{plugins:{title:{
        display:false,
        text:'Number of Friends Vs Frequency',
        fontSize:50
      },
      legend:{
        display:true,
        position:'top'
      },}}}/>

<Line
      data = {{
                 labels: L3,
                 type: 'line',
                 datasets : [
                 {
                  label : 'Hourly Frequency of Posts',
                  type: 'line',
                  fill: false,
                  lineTension: 0.5,
                  borderColor:'rgb(54, 162, 235)',
                  backgroundColor: 'rgb(54, 162, 235)',
                  borderWidth: 2,
                  pointRadius: 0,
                data: D3
                    }],}}
      options = {{plugins:{title:{
        display:false,
        text:'Number of Friends Vs Frequency',
        fontSize:50
      },
      legend:{
        display:true,
        position:'top'
      },}}}/>

<Line
      data = {{
                 labels: L4,
                 type: 'line',
                 datasets : [
                 {
                  label : 'Weekday Frequency of Posts',
                  type: 'line',
                  fill: false,
                  lineTension: 0.5,
                  borderColor:'rgb(54, 162, 235)',
                  backgroundColor: 'rgb(54, 162, 235)',
                  borderWidth: 2,
                  pointRadius: 0,
                data: D4
                    }],}}
      options = {{plugins:{title:{
        display:false,
        text:'Number of Friends Vs Frequency',
        fontSize:50
      },
      legend:{
        display:true,
        position:'top'
      },}}}/>

<Line
      data = {{
                 labels: L5,
                 type: 'line',
                 datasets : [
                 {
                   label : 'Daily Frequency of Posts',
                  type: 'line',
                  fill: false,
                  lineTension: 0.5,
                  borderColor:'rgb(54, 162, 235)',
                  backgroundColor: 'rgb(54, 162, 235)',
                  borderWidth: 2,
                  pointRadius: 0,
                data: D5
                    }],}}
      options = {{plugins:{title:{
        display:false,
        text:'Daily Frequency of Posts',
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