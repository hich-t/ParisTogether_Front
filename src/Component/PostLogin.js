import { useNavigate } from "react-router-dom";
import useLogged from "../logic/useLogged"

//  page post-login qui offre à l'utilisateur le choix 
//  d'aller sur la page d'accueil ou sur son profil directement.

const PostLogin = () => {
    const navigate = useNavigate()
    const [user] = useLogged();

    return (
        <div className='postloginpage'>
            <div className='postloginleftside'>
            <h1 className='postlogintitle'> Hey, {user.pseudo} &#128526;<br />
            Prêt à rencontrer du monde ? 
             </h1>
            <div className='postloginchoiceframe'>
            <h1 className="postlogintitle2">Que souhaites-tu faire ? </h1>
            <button onClick={() => navigate("/")}
          className="registerbuttons" >
          Vers la page d'accueil
          </button>
          <button onClick={() => navigate("/profile")}
          className="registerbuttons" >
          Vers mon Profil
          </button>
            </div>
            </div>
        <div className='postloginrightside'>
        </div>
        </div>
    )
}

export default PostLogin