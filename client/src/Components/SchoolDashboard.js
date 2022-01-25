import LoginError from './LoginError'
import Logout from './Logout'
import userContext from './userContext'
import {useContext} from 'react'

function School({user}) {
  const {userData,setUserData} = useContext(userContext);
  if(userData.user && userData.user.type === 'school'){
    return (
      <div>
        <p>School Dashboard</p>
        <Logout />
      </div>
  );
  }
  return (
      <LoginError />
  );
}
  
export default School;