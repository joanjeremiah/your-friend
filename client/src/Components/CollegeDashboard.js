import LoginError from './LoginError'
import Logout from './Logout'
import userContext from './userContext'
import {useContext} from 'react'

function College({user}) {
  const {userData,setUserData} = useContext(userContext);
  if(userData.user && userData.user.type === 'college'){
    return (
      <div>
          <p>College Dashboard</p>
          <Logout />
      </div>
  );
  }
  
  return (
      <LoginError />
  );
  }
  
export default College;