

//ce component nous permet de proteger nos url en véridiant 
// la présence d'un token lors de l'accès au chemin spécifié


import { Navigate } from "react-router-dom";

export default function Protected({ children }) {
  const token = localStorage.getItem("auth-token");
  if (!token) {
    alert("Vous devez être connecté pour afficher page !");
    return <Navigate to="/" replace />;
  }

  return children;
}
