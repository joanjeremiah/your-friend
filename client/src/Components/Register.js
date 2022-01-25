import {useState} from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import "../home.css";
import Yoga from "../yoga.svg";
import axios from "axios";

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "all",
  });

  let navigate = useNavigate();
  const [errorMsg,setErrorMsg] = useState();
  const [successMsg,setSuccessMsg] = useState();

  const onSubmit = (data) => {
    const {Email,Organization,firstName,lastName} = data
    if (firstName && lastName && Email && Organization){
      axios.post("/api/users/register",data )
      .then(res=>{
        if(res.data.isRegistered){
          setErrorMsg()
          setSuccessMsg(res.data.message + 'You will receive your password via email.')
          setTimeout(function(){
            navigate('/login');
          }, 1500);          
        }
        else{
          setErrorMsg(res.data.message)
        }
      })
    }
  };
  console.log(errors);

  return (
    <>
      <h1>Register</h1>
      <div className="maingrid">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid">
            <label htmlFor="firstName">First name</label>
            <div>
              <input
                type="text"
                placeholder="First name"
                {...register("firstName", { required: true, maxLength: 50 })}
              />
              {errors.firstName && (
                <p className="error-msg">
                  {"The Name Field is Required and must be > 49 characters"}
                </p>
              )}
            </div>
            <label htmlFor="lastName">Last name</label>
            <div>
              <input
                type="text"
                placeholder="Last name"
                {...register("lastName", { required: true, maxLength: 50 })}
              />
              {errors.lastName && (
                <p className="error-msg">
                  {"The Name Field is Required and must be > 49 characters"}
                </p>
              )}
            </div>
            <label htmlFor="Email">Email</label>
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("Email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
              />
              {errors.Email && <p className="error-msg">{"In valid email id include @"}</p>}
            </div>
            <label htmlFor="Organisation">Organization</label>
            <div>
              <select {...register("Organization", { required: true })}>
                <option value="School">School</option>
                <option value="College">College</option>
                <option value="Individual">Individual</option>
              </select>
            </div>
          </div>
          {errorMsg && <p className="error-msg">{errorMsg}</p>}
          {successMsg && <p className="success-msg">{successMsg}</p>}
          <button disabled={!isDirty || !isValid}>Submit</button>
        </form>
        <img src={Yoga} alt="yoga" style={{ position: "relative" }}></img>
      </div>
    </>
  );
}
