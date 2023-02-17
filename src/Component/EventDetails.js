import { useParams } from "react-router-dom";
import { colorTagMatcher } from "../logic/function";
import axios from "axios";
import { useEffect, useState } from "react";
import MapComponent from "../Component/reusableComponent/MapComponent";
import CalendarComponent from "../Component/reusableComponent/Calendar";
import CommentList from "../Component/reusableComponent/Forum";
import Money from "../Asset/money.png";
import Handicap from "../Asset/icons8-disability-64.png";
import Blind from "../Asset/icons8-malvoyant-60.png";
import Geo from "../Asset/icons8-géorepérage-100.png";
import Facebook from "../Asset/icons8-facebook-100.png";
import Twitter from "../Asset/icons8-twitter-100.png";
import Tel from "../Asset/icons8-téléphone-100.png";
import Mail from "../Asset/icons8-nouveau-message-100.png";
import Site from "../Asset/icons8-www-100.png";

import "../Styles/EventDetails.css";

const EventDetails = () => {
  const [event, setEvent] = useState([]);
  const [displayMail, setDisplayMail] = useState(false);
  const [displayTel, setDisplayTel] = useState(false);
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const callData = await axios.get(
        `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=&facet=id&refine.id=${id}`
      );
      setEvent(callData.data.records);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const split = (text) => {
    let result = text.split(";");
    return result;
  };

  return (
    <>
      {event &&
        event.map((e, i) => (
          <div className="globalContainer" key={i}>
            <div>
              <div className="detailledInfoContainer">
                <img
                  className="imgCover"
                  src={`${e.fields.cover_url}`}
                  alt="eventCover"
                />

                <div className="tittleDetailsCard">{e.fields.title}</div>
                <div className="taged">
                  {e.fields.tags &&
                    split(e.fields.tags).map((e, i) => {
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
                <div
                  className="testconverthtml fullDescription"
                  dangerouslySetInnerHTML={{ __html: e.fields.description }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                />
                <div style={{ width: "150%", marginTop: "20px" }}>
                  <CommentList />
                </div>
              </div>
            </div>
            <div>
              <div className="profilecontentframeDetails">
                <div className="locationDetailsContainer">
                  <MapComponent
                    center={e.fields.lat_lon}
                    nameClass={"markercluster-mapProfilandDetails"}
                  />
                  {/* <h4>Adresse :</h4> */}
                  <div
                    className="adressDetails"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <img src={Geo} alt="geo" width={"50px"} />
                    <div>
                      <p>{`${e.fields.address_street}`}</p>
                      <p>{`${e.fields.address_zipcode} ${e.fields.address_city}`}</p>
                    </div>
                  </div>
                </div>
                <div className="infoDetailsContainer">
                  <h2>Informations</h2>
                  <div className="line"></div>
                  <div 

                  >
                    <h4>Date :</h4>
                    <p>
                      {new Date(e.fields.date_start)
                        .toLocaleString()
                        .slice(-20, -10) ===
                      new Date(e.fields.date_end)
                        .toLocaleString()
                        .slice(-20, -10)
                        ? new Date(e.fields.date_start)
                            .toLocaleString()
                            .slice(-20, -10)
                        : `${new Date(e.fields.date_start)
                            .toLocaleString()
                            .slice(-20, -9)} au ${new Date(e.fields.date_end)
                            .toLocaleString()
                            .slice(-20, -9)}`}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <h4>Accessibilité :</h4>
                    {event &&
                      event.map(
                        (e, i) =>
                          e.fields.price_type && (
                            <div style={{ display: "flex" }} key={i}>
                              <img
                                className="ico"
                                src={Money}
                                alt="user"
                                width={"50px"}
                              />
                              <p>{e.fields.price_type}</p>
                            </div>
                          )
                      )}
                    <div>
                      {event &&
                        event.map(
                          (e, i) =>
                            e.fields.blind === 1 && (
                              <img src={Blind} alt="" width={"40px"} key={i} />
                            )
                        )}
                      {event &&
                        event.map(
                          (e, i) =>
                            e.fields.pmr === 1 && (
                              <img
                                src={Handicap}
                                alt=""
                                width={"40px"}
                                key={i}
                              />
                            )
                        )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <h4>Contacts :</h4>
                    {event &&
                      event.map(
                        (e, i) =>
                          e.fields.contact_phone && (
                            <img
                              src={Tel}
                              alt="tel"
                              width={"40px"}
                              onClick={() => setDisplayTel(!displayTel)}
                              key={i}
                            />
                          )
                      )}
                    {event &&
                      event.map(
                        (e, i) =>
                          e.fields.contact_mail && (
                            <img
                              src={Mail}
                              alt="mail"
                              width={"40px"}
                              onClick={() => setDisplayMail(!displayMail)}
                              key={i}
                            />
                          )
                      )}
                    {event &&
                      event.map(
                        (e, i) =>
                          e.fields.contact_url && (
                            <img
                              src={Site}
                              alt="site"
                              width={"30px"}
                              onClick={() =>
                                window.open(e.fields.contact_url, "_blank")
                              }
                              key={i}
                            />
                          )
                      )}
                  </div>
                  {event &&
                    event.map(
                      (e, i) =>
                        e.fields.contact_mail &&
                        displayMail && <p key={i}>{e.fields.contact_mail}</p>
                    )}
                  {event &&
                    event.map(
                      (e, i) =>
                        e.fields.contact_phone &&
                        displayTel && <p key={i}>{e.fields.contact_phone}</p>
                    )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <h4>Réseaux Sociaux :</h4>
                    {event &&
                      event.map(
                        (e, i) =>
                          e.fields.contact_facebook && (
                            <img
                              src={Facebook}
                              alt=""
                              width={"40px"}
                              onClick={() =>
                                window.open(e.fields.contact_facebook, "_blank")
                              }
                              key={i}
                            />
                          )
                      )}
                    {event &&
                      event.map(
                        (e, i) =>
                          e.fields.contact_twitter && (
                            <img
                              src={Twitter}
                              alt=""
                              width={"25px"}
                              onClick={() =>
                                window.open(e.fields.contact_twitter, "_blank")
                              }
                              key={i}
                            />
                          )
                      )}
                  </div>
                </div>
                <div className="profileCalendarDetails">
                  <CalendarComponent id={id} />
                </div>
              </div>
            </div>
          </div>
        ))}
      <div></div>
    </>
  );
};

export default EventDetails;
