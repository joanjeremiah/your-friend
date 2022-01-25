import LoginError from './LoginError'
import Logout from './Logout'
import userContext from './userContext'
import {useContext} from 'react'

function Admin({user}) {
  const {userData,setUserData} = useContext(userContext);
  // console.log(userData)
  if(userData.user && userData.user.type === 'admin'){
    return (
      <div>
        <p>Admin Dashboard</p>
        <Logout />
      </div>
  );
  }   
  return (
      <LoginError />
  );
  
}

export default Admin;