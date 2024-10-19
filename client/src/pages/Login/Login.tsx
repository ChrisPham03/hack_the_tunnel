import { useState } from "react";
import { useAccountContext } from "../../context";
import { Base as Layout } from "@/layouts";
import "./Login.style.scss";

function Login() {
  const [message, setMessage] = useState(null);
  const { login } = useAccountContext();

  const attemptLogin = async () => {
    try {
      const message = await login("admin@email.com", "password");
      setMessage(message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="Login">
        <div className="Login__panel">
          <div className="Login__panel__content">
            <img src="Images/04Carleton.jpg" alt="Background" className="Login__background" />
          </div>
          <div className="Login__box">
            <div className="Login__box__content">
              <div className="Login__welcome Login__welcome--highlight">
                Welcome to the Carleton 360
              </div>
              <div className="Login__instructions">
                Enter your{" "}
                <a href="https://myone.carleton.ca" target="_blank" rel="noopener noreferrer">
                  MyCarletonOne
                </a>{" "}
                username and password.
              </div>
              {message && <p className="Login__message">{message}</p>}
              <div className="Login__input">
                <input type="text" placeholder="MyCarletonOne username" />
                <input type="password" placeholder="Password" />
              </div>
              <div className="Login__checkbox">
                <input type="checkbox" />
                <label>Keep me signed in</label>
              </div>
              <button className="Login__button" onClick={attemptLogin}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
