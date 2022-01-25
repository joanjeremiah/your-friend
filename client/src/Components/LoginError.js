import Logo from '../401 Error Unauthorized-amico.svg'
import { Link } from 'react-router-dom';
function LoginError() {
    return (
      <div className="message-page">
        <img style={{width: '45vw',height: '50vh'}} src={Logo} alt="logo"/>
        <p>You are not authorized to access this page.If you are not logged in <Link to="/login">Log in here</Link>  </p>
      </div>
    );
  }
  
export default LoginError;