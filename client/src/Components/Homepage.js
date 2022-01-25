import userContext from './userContext'
import {useContext} from 'react'
import { Link } from 'react-router-dom';
import Logout from './Logout'

const Homepage = () => {
  const {userData,setUserData} = useContext(userContext);
  
  return (
    <>
        <h1>Welcome to Homepage</h1>
        {!userData.user && <div>
            <Link to="/register" >Register</Link><br />
            <Link to="/login" >Login</Link>
        </div>
        }
        {userData.user && <Logout />}
    </>
  )
}
export default Homepage