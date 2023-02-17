import { useEffect, useState } from "react";
import MapComponent from "../Component/reusableComponent/MapComponent";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import "../Styles/homepage.css";
import useLogged from "../logic/useLogged";
import Cards from "../Component/reusableComponent/Cards";
import Button from "react-bootstrap/Button";
import CurrentMovies from "../Component/reusableComponent/CurrentMovies";
import Footer from "../Component/reusableComponent/Footer";

const HomePage = () => {


  const [event, setEvent] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchByCategorie, setSearchByCategorie] = useState(false);
  const [user] = useLogged();
  const [tagActive, setTagActive] = useState("");
  const [numberOfResult, setNumberOfResult] = useState(8);
  const [allData, setAllData] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const loadMore = () => {
    let count = numberOfResult + 4;
    setNumberOfResult(count);
  };

  const fetchTags = async () => {
    setTagActive("Nouveautés");
    try {
      const callData = await axios.get(
        `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&facet=tags`
      );
      setTags(callData.data.facet_groups);
    } catch (err) {
      console.log(err);
    }
    try {
      const callData = await axios.get(
        "https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=&sort=updated_at"
      );
      setEvent(callData.data.records);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllData = async () => {
    try {
      const callData = await axios.get(
        `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=&rows=3000`
      );
      setAllData(callData.data.records);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchEventByTags = async (e) => {
    setNumberOfResult(8);
    setTagActive(`${e}`);
    try {
      const callData = await axios.get(
        `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=&rows=300&refine.tags=${e}`
      );
      setEvent(callData.data.records);
      setSearchByCategorie(!searchByCategorie);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTags();
    fetchAllData();
  }, []);

  const handleChange = async (e) => {

    e.target.value.length > 0
      ? setTagActive("Résultats de votre recherche")
      : fetchTags();


    try {
      const callData = await axios.get(
        `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=${e.target.value}&rows=300`
      );
      setEvent(callData.data.records);
      setSearchByCategorie(!searchByCategorie);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="homePage">
      <div className="topPannel">
        <div>

        </div>

        <Modal
          className="mod"
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton className="homepagemapbutton"></Modal.Header>

          <Modal.Body>
            {" "}
            <MapComponent
              className="modd"
              event={allData}
              nameClass={"markercluster-map"}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="arroundMe">
          <div className="frame">
            <h3 className="landingTittle">
              Rejoignez des centaines d'événements autour de vous ...
            </h3>
          </div>
          <div className="blockSearch">
            <div className="search-container">
              <input
                type="text"
                onChange={(e) => handleChange(e)}
                name="search"
                placeholder="Recherche par mot clé..."
                className="search-input"
              />
              <div className="divider">|</div>
              <div onClick={() => handleShow()} className="search-btn">
                <i
                  style={{ color: "#5cbdbb" }}
                  className="fa-sharp fa-solid fa-location-crosshairs"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="botPannel">
        <div className="test">
          <div className="filtre">Filtrez par catégories </div>
          <div className="categorieRow">
            <button
              className="footerbacktotopbutton"
              onClick={() => fetchTags()}
            >
              Nouveautés
            </button>
            {tags.map((e) =>
              e.facets.map((e, i) => (
                <button
                 
                  className="footerbacktotopbutton"
                  key={i}
                  onClick={() => fetchEventByTags(e.name)}
                >
                  {e.name}
                </button>
              ))
            )}
          </div>

          <div className="landingRender">
            <div className="filtre">
              {tagActive !== "Nouveautés" ? tagActive : "Nouveautés"}
            </div>
            <div className="nouveauteAccueil">
              {event.length > 0 &&
                event
                  .slice(0, numberOfResult)
                  .map((e, i) => (
                    <div key={i}>{e && <Cards user={user} event={e} />}</div>
                  ))}
            </div>
          </div>
          {tagActive !== "Nouveautés" && (
            <div className="charger">
              {" "}
              <button onClick={() => loadMore()} className="footerbacktotopbutton">
                Charger plus{" "}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="titrefilms">
        Plutôt envie d'un ciné ? Voici les films actuellement à l'affiche{" "}
      </div>

      <CurrentMovies />
      <Footer />
    </div>
  );
};
export default HomePage;
