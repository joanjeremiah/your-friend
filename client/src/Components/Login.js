import { useContext,useState} from "react";
import { useForm } from "react-hook-form";
import "../home.css";
import Yoga from "../yoga.svg";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from "./userContext";

export default function Home() {
  let navigate = useNavigate();
  const { setUserData } = useContext(UserContext);
  const [msg,setMsg] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "all",
  });

  const onSubmit = (data, e) => {
    axios.post("/api/users/login",data)
      .then(res=>{
          setMsg(res.data.message)
          if(res.data.message === 'login sucess'){
              setUserData({
                token: res.data.token,
                user: res.data.user
              });
              localStorage.setItem("auth-token", res.data.token);
              navigate(`/${res.data.user.type}`)
          }   
      })
    e.target.reset();
  };
  console.log(errors);

  return (
    <>
      <h1>Login</h1>
      <div className="maingrid">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid">
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
              {errors.Email && <p>{"In valid email id include @"}</p>}
            </div>
            <label htmlFor="password">Password</label>
            <div>
              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: true, maxLength: 11 })}
              />
              {errors.firstName && <p>{"Not in proper format"}</p>}
            </div>
          </div>
          {msg && <p className="success-msg">{msg}</p>}
          <button disabled={!isDirty || !isValid}>Submit</button>
        </form>
        <img src={Yoga} alt="yoga" style={{ position: "relative" }}></img>
      </div>
    </>
  );
}
