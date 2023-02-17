import axios from "axios";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import useLogged from "../../logic/useLogged";

const CalendarComponent = (props) => {
  const [user] = useLogged();
  const [date, setDate] = useState(new Date());
  const [userByDate, setUserByDate] = useState("");
  const token = localStorage.getItem("auth-token");
  const [events, setEvents] = useState([]);

  // Au click sur une date du calendar, filtre l'event pour cette date et le stock dans UserByDate
  const DisplayUser = async (value) => {
    const userOnDate = events.filter(
      (event) => event.date.toString() === value.toString().slice(0, 15)
    );
    setUserByDate(userOnDate);
  };

  // Renvoi le nbre de participants pour l'event
  const EventTile = ({ events }) =>
    events.map((event, i) => (
      <p key={i} style={{ color: "red" }}>
        {event.pseudo.length} per
      </p>
    ));

  //fetch tous les dates où il existe des participants en base pour cette idEvent
  const fetchByEventId = () => {
    axios
      .get(`https://paris-together-back-git-main-hich-t.vercel.app/request/dateForEvent/all/${props.id}`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.log(err));
  };

  //ajoute un utilisateur à l'array des pseudos pour la dateSelect
  const addUserEvent = (dateSelect) => {
    axios
      .put(
        `https://paris-together-back-git-main-hich-t.vercel.app/request/dateForEvent/${props.id}`,
        { date: dateSelect.toString().slice(0, 15), pseudo: user.pseudo },
        { headers: { authorization: token } }
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchByEventId();
  }, [events]);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div className="calendar-container">
          <Calendar
            onChange={setDate}
            onClickDay={(value) => DisplayUser(value)}
            value={date}
            selectRange={false}
            minDetail="year"
            tileContent={({ date }) => {
              // renvoi les events pour chaque date affiché
              const eventsOnDate = events.filter(
                (event) =>
                  event.date.toString() === date.toString().slice(0, 15)
              );
              //si il y a un event, il affiche le component EventTile sur la date si non rien
              return eventsOnDate.length > 0 ? (
                <EventTile date={date} events={eventsOnDate} />
              ) : null;
            }}
          />
        </div>
      </div>
      {date && (
        <div className="jeParticipe">
          <button
            className="registerbuttons"
            onClick={() => addUserEvent(date)}
          >
            Je participe aussi
          </button>
        </div>
      )}
      {userByDate.length > 0 && (
        <div className="text-center">
          <h5>Participants :</h5>
          <ul>
            {userByDate.map((el) =>
              el.pseudo.map((e, i) => <li key={i}>{e}</li>)
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
