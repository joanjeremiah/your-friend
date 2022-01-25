import { useContext } from 'react';
import UserContext from "./userContext";
import { useNavigate } from 'react-router-dom';
const Logout = () =>{
    const { userData, setUserData } = useContext(UserContext);
    const removeUser = () => {
        setUserData({
            token: undefined,
            user: undefined
        })
        localStorage.setItem("auth-token","");
        navigate('/')
    }
    let navigate = useNavigate();
    return(
        <button onClick={removeUser}>
            Logout
        </button>
    );

}

export default Logout;