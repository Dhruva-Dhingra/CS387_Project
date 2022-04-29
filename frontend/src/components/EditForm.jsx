import React, { useState, useContext , useEffect } from 'react';
import EditFinder from '../apis/EditFinder';
import { Context } from '../context/Context';
// import { useEffect } from 'react/cjs/react.production.min';
const EditForm = () => {
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

      const {editForm} = useContext(Context)

      const [first, setfirst] = useState("")
      const [last, setlast] = useState("")
      const [rolln, setrolln] = useState("")
      const [branch, setbranch] = useState("")
      const [degree, setdegree] = useState("")
      const [batch, setbatch] = useState("")
      const [email, setemail] = useState("")
      const [pswd, setpswd] = useState("")
      const [residence, setresidence] = useState("")
      const [bday, setbday] = useState("")
      const [dp, setdp] = useState("")
      const [hidden, setprivate] = useState("")
      const [autoadd, setautoadd] = useState("")

      useEffect( ()=> {
         const fetchData = async () => {
             const response = await EditFinder.get("/");
             console.log(response.data);
             setfirst(response.data.first);
             setlast(response.data.last);
             setrolln(response.data.rolln);
             setbranch(response.data.branch);
             setdegree(response.data.degree);
             setbatch(response.data.batch);
             setemail(response.data.email);
             setpswd(response.data.pswd);
             setresidence(response.data.residence);
             setbday(response.data.bday);
             setdp(response.data.dp);
             setprivate(response.data.private);
             setautoadd(response.data.autoadd);
         }
         fetchData();
      })
      const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(first);
        var profile_pic;
        try {
            var dp_file_element = document.getElementById("file-selector");
            var reader = new FileReader();
            reader.onloadend = function(){
                // console.log("Reader = ", reader);
                // console.log("Reader.result = ", reader.result);
                profile_pic = reader.result;
                // var imgElement = document.getElementById("checking_image_file");
                // imgElement.src = reader.result;
            }
            await reader.readAsDataURL(dp_file_element.files[0]);
            console.log(first);
        await EditFinder.post("/", {
              first: first,
              last: last,
              rolln: rolln,
              branch: branch,
              degree: degree,
              batch: batch,
              email: email,
              pswd: pswd,
              residence: residence,
              bday: bday,
              dp: profile_pic,
             private: hidden,
              autoadd: autoadd
          }).then(response => {
            if(response.data.status === "success"){
                console.log(response);
            console.log("Profile Edit Successful");
            } else {
            console.log("Profile Edit Unsuccessful");
            }
        });
      
        } catch (err) {
            console.log(err.stack);
  
        }
      }

      return <div className='mb-4'>
      <h1 style = {head2}>Edit your profile Here! </h1>
      <form action="">
          <div className="form-row">
            <div className="col">
                <input value = {first} onChange={(e) => setfirst(e.target.value)} type="text" className='form-control' placeholder='First Name'/>
            </div>
            <div className="col">
                <input value = {last} onChange={(e) => setlast(e.target.value)} type="text" className='form-control' placeholder='Last Name'/>
            </div>
            <div className="col">
                <input value = {rolln} onChange={(e) => setrolln(e.target.value)} type="text" className='form-control' placeholder='Roll Number'/>
            </div>
            <div className="col">
                <input value = {branch} onChange={(e) => setbranch(e.target.value)} type="text" className='form-control' placeholder='Branch'/>
            </div>
            <div className="col">
                <input value = {degree} onChange={(e) => setdegree(e.target.value)} type="text" className='form-control' placeholder='Degree'/>
            </div>
            <div className="col">
                <input value = {batch} onChange={(e) => setbatch(e.target.value)} type="number" className='form-control' placeholder='Batch'/>
            </div>
            <div className="col">
                <input value = {email} onChange={(e) => setemail(e.target.value)} type="email" className='form-control' placeholder='Email-ID'/>
            </div>
            <div className="col">
                <input value = {pswd} onChange={(e) => setpswd(e.target.value)} type="password" className='form-control' placeholder='Password'/>
            </div>
            <div className="col">
                <input value = {residence} onChange={(e) => setresidence(e.target.value)} type="text" className='form-control' placeholder='Residence'/>
            </div>
            <div className="col">
                <input value = {bday} onChange={(e) => setbday(e.target.value)} type="date" className='form-control' placeholder='Birthday'/>
            </div>
            <div className="col">
                <input type="file" className='form-control' placeholder='Profile Picture' id="file-selector" accept=".jpg, .jpeg, .png"/>
            </div>
            <div className="col">
                <input value = {hidden} onChange={(e) => setprivate(e.target.value)} type="number" className='form-control' placeholder='Hide Account'/>
            </div>
            <div className="col">
                <input value = {autoadd} onChange={(e) => setautoadd(e.target.value)} type="number" className='form-control' placeholder='Auto Add to Groups'/>
            </div>
            <br></br>
            <center><button onClick={handleSubmit} type = "submit" className="btn btn-warning btn-lg">Update Profile!</button></center>
            
          </div>
      </form>
  </div>;
}

export default EditForm;
