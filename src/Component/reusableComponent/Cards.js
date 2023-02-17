import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/Cards.css";
import axios from "axios";
import { AddEvent, colorTagMatcher } from "../../logic/function";
import Heart from "../../Asset/heart.png";
import Geo from "../../Asset/icons8-géorepérage-100.png";
import Calendar from "../../Asset/calendar.png";
import Handicap from "../../Asset/icons8-disability-64.png";
import Empty from "../../Asset/emptyHeart.png";
import useLogged from "../../logic/useLogged";

const Cards = (props) => {
  const navigate = useNavigate();
  const [user] = useLogged();
  const token = localStorage.getItem("auth-token");
  const [isVisible, setIsVisible] = useState(false);

  // Fonction d'ajout en favori de l'événement si l'utilisateur est logué par la méthode put
  const addFavorite = async (idEvent) => {
    if (user) {
      AddEvent(idEvent);
      await axios
        .put(
          `https://paris-together-back-git-main-hich-t.vercel.app/request/user`,
          { favoriteEvent: idEvent },
          { headers: { authorization: token } }
        )
        .then((res) => console.log(res.data))

        .catch((err) => {
          console.log(err);
        });
    } else {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    }
  };

  const removeFavorite = async (idEvent) => {
    if (user) {
      axios
        .delete(`https://paris-together-back-git-main-hich-t.vercel.app/request/user`, {
          data: { favoriteEvent: idEvent },
          headers: { authorization: token },
        })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    } else {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    }
  };

  // fonction permettant de separer les multi-tags collés par le charactere ";"
  const split = (text) => {
    let result = text.split(";");
    return result;
  };

  return (
    <>
      <div key={props.event.fields.id} className="container">
        <div className="card">
          <div className="card-header">
            {isVisible && (
              <div style={{ position: "absolute" }}>
                <div className="map-popup">
                  <p>L'ajout aux favoris est resevé aux abonnés</p>
                </div>
              </div>
            )}

            <div className="cardImgAtribute">
              <img
                className="card-img"
                src={`${props.event.fields.cover_url}`}
                alt="rover"
              />

              <div className="icoGlob">
                <img
                  className="ico-coeur"
                  src={
                    user && user.favoriteEvent.includes(props.event.fields.id)
                      ? Heart
                      : Empty
                  }
                  alt="user"
                  onClick={() =>
                    user && user.favoriteEvent.includes(props.event.fields.id)
                      ? removeFavorite(props.event.fields.id)
                      : addFavorite(props.event.fields.id)
                  }
                />
                <div className="mob">
                  {props.event && (
                    <>
                      {props.event.fields.pmr === 1 && (
                        <>
                          <img className="pmr" src={Handicap} alt="" />
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className="card-body "
            onClick={() => navigate(`/eventdetails/${props.event.fields.id}`)}
          >
            <div className="tagContainer">
              {props.event.fields.tags ? (
                <div className="taged">
                  {split(props.event.fields.tags).map((e, i) => {
                    return (
                      <span
                        style={{ backgroundColor: colorTagMatcher(e) }}
                        className="tag"
                        key={i}
                      >
                        {e}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="taged">
                  <span
                    style={{ backgroundColor: colorTagMatcher("Divers") }}
                    className="tag"
                  >
                    Divers
                  </span>{" "}
                </div>
              )}
            </div>
            <div className="bodyContainer">
              <h5 className="titleCard">{props.event.fields.title}</h5>

              <div className="textCard"> {props.event.fields.lead_text}</div>
            </div>
            <div className="line"></div>
            <div className="user">
              <div className="user-info">
                {props.event.fields.address_street &&
                props.event.fields.address_zipcode &&
                props.event.fields.address_city ? (
                  <div className="location">
                    <img src={Geo} alt="" />
                    <div className="adress">{`${props.event.fields.address_street}  ${props.event.fields.address_zipcode}  ${props.event.fields.address_city}`}</div>
                  </div>
                ) : (
                  <div className="location">
                    <img src={Geo} alt="" />
                    <div className="adress">Aucune adresse communiquée</div>
                  </div>
                )}

                {props.event.fields.date_start ? (
                  <div className="timeDate">
                    <img className="calendar" src={Calendar} alt="" />
                    <div className="date">
                      Débute le :{" "}
                      {new Date(props.event.fields.date_start)
                        .toLocaleString()
                        .slice(-20, -10)}
                    </div>
                  </div>
                ) : (
                  <div className="timeDate">
                    <img className="calendar" src={Calendar} alt="" />
                    <div className="date">Aucune date communiquée</div>
                  </div>
                )}

                <div className="handicap">
                  {/*                   <div className="blind">
                    {props.event && (
                      <>
                        {props.event.fields.blind === 1 && (
                          <>
                            <img className="pmr" src={Blind} alt="" />
                          </>
                        )}
                      </>
                    )}
                  </div> */}
                </div>
                {/* {props.event.fields.price_type !== "gratuit" && (
                  <img className="ico" src={Money} alt="user" />
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cards;
