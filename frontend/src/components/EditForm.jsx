import React, { useState, useContext } from 'react';
import HomepageFinder from '../apis/EditFinder';
import { Context } from '../context/Context';

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

      const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          const response = await HomepageFinder.post("/", {
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
              dp: dp,
             private: hidden,
              autoadd: autoadd
          })
          editForm(response.data.data.venue);
          console.log(response);
        } catch (err) {
  
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
                <input value = {rolln} onChange={(e) => setrolln(e.target.value)} type="text" className='form-control' placeholder='Last Name'/>
            </div>
            <div className="col">
                <input value = {branch} onChange={(e) => setbranch(e.target.value)} type="text" className='form-control' placeholder='Last Name'/>
            </div>
            <div className="col">
                <input value = {degree} onChange={(e) => setdegree(e.target.value)} type="text" className='form-control' placeholder='Last Name'/>
            </div>
            <div className="col">
                <input value = {batch} onChange={(e) => setbatch(e.target.value)} type="number" className='form-control' placeholder='Last Name'/>
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
                <input value = {dp} onChange={(e) => setdp(e.target.value)} type="file" className='form-control' placeholder='Profile Picture'/>
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
