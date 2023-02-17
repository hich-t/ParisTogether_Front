import { createContext, useState } from "react";

export const UserContext = createContext()

export const UserController = (props) => {
    const [userLogged,setUserLogged] = useState(false)

return(
    <UserContext.Provider value={[userLogged,setUserLogged]}>
        {props.children}
    </UserContext.Provider>
)

}