import { Routes, Route } from "react-router-dom";
import Register from "./Component/Register";
import Login from "./Component/Login";
import Profile from "./Component/Profile";
import PostLogin from "./Component/PostLogin";
import HomePage from "./Component/HomePage";
import Register2 from "./Component/Register2";
import EventDetails from "./Component/EventDetails";
import Navbar from "./Component/reusableComponent/Navbar";
import Protected from "./Component/reusableComponent/Protected";
import { UserController } from "./Context/UserContext";

const Router = () => {
  // const location = useLocation();

  return (
    <>
      {/* {location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/registertwo" && location.pathname !== "/postlogin" ? <Navbar /> : null} */}
      <UserController>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/profile"
              element={
                <Protected>
                  <Profile />
                </Protected>
              }
            />
            <Route path="/eventdetails/:id" element={<EventDetails />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route
            path="/registertwo"
            element={
                <Register2 />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/postlogin"
            element={
                <PostLogin />
            }
          />
        </Routes>
      </UserController>
    </>
  );
};

export default Router;
