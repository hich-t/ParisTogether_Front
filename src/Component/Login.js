import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [emailExist, setEmailExist] = useState(false);
  const [differentPassword, setDifferentPassword] = useState(false);
  const [login, setlogin] = useState("");
  const navigate = useNavigate();

  // ici, fonction pour ajouter à l'array login les valeurs entrées dans le formulaire
  // à l'aide d'un spread operator

  const loginUser = (e) => {
    e.preventDefault();
    setlogin((login) => ({
      ...login,
      [e.target.name]: e.target.value,
    }));
  };

  // fonction qui send nos informations de connexion
  // et les véférie par rapport à  notre base de données
  // avec des erreurs renvoyées si nécéssaires

  const sendlogin = async (e) => {
    e.preventDefault();
    setEmailExist(false);
    setDifferentPassword(false);
    await axios
      .post("https://paris-together-back-git-main-hich-t.vercel.app/request/login", login)
      .then((res) => {
        localStorage.setItem("auth-token", res.data);
        navigate("/postlogin");
      })
      .catch((err) => {
        if (err && err.response.data === "Email not found") {
          setEmailExist(true);
        }
        if (err && err.response.data === "Password is not valid") {
          setDifferentPassword(true);
        }
      });
  };

  return (
    <div className="loginpage">
      <div className="loginleftside">
        <h1 className="titlelogin">
          &#129395;
          <br />
          Welcome Back !<br />
          Ça faisait longtemps !<br />
          Bienvenido de nuevo !<br />
          久し振り !<br />
          مرحبا بعودتك <br />
        </h1>

        <div className="loginformframe">
          <form className="loginform" onSubmit={sendlogin}>
            <label>Email</label>
            <input
              className="inputforms"
              type="text"
              name="email"
              onChange={(e) => loginUser(e)}
            />
            <br />
            <label>Mot de passe</label>
            <input
              className="inputforms"
              type="password"
              placeholder="Mot de passe"
              name="password"
              onChange={(e) => loginUser(e)}
            />
            <br />

            <button
              className={`loginbuttons ${
                emailExist || differentPassword ? "shake-button" : ""
              }`}
              type="submit"
            >
              Connexion
            </button>
          </form>

          {emailExist && <p className="errormsglogin">Email non trouvé</p>}
          {differentPassword && (
            <p className="errormsglogin">Mauvais Mot de passe !</p>
          )}
        </div>
      </div>

      <div className="loginrightside"></div>
    </div>
  );
};

export default Login;
