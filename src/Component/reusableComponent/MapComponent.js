import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const MapComponent = (props) => {
  const [location, setLocation] = useState(null);
  const [town, setTown] = useState("");
  const [consentGeoLoc, setConsentGeoLoc] = useState(true);
  const mapRef = useRef();
  const navigate = useNavigate()

  //Icone dédié à la localisation de l'utilisateur
  const greenIcon = new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  //fonction qui récup les lat et lon en fonction d'une query (API de openstreetmap)
  const geocodeAddress = async (e) => {
    setConsentGeoLoc(false);
    e.preventDefault();
    try {
      const callData = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${town}&format=json&addressdetails=1&limit=1`
      );
      console.log(callData.data[0].lat);
      setLocation([callData.data[0].lat, callData.data[0].lon]);
    } catch (err) {
      console.log(err);
    }
  };

  //fonction qui localise la position via le browser
  const geoLocationCoord = () => {
    setConsentGeoLoc(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        console.error("Sorry the Geolocation");
      }
    );
  };

  //au chargement et à chaque changement du state
  useEffect(() => {
    if(props.center){
      setLocation(props.center)
      mapRef.current && mapRef.current.leafletElement.setView(location);
    } 
   else if (consentGeoLoc) {
      geoLocationCoord();
      mapRef.current && mapRef.current.leafletElement.setView(location);
    } else {
      mapRef.current && mapRef.current.leafletElement.setView(location);
    }
  }, [location]);

  return (
    <>
      <MapContainer
        key={location}
        className={props.nameClass}
        center={location}
        zoom={15}
        maxZoom={18}
      >
        {location && (
          <Marker position={location} icon={greenIcon}>
            <Popup>Votre localisation</Popup>
          </Marker>
        )}

        {props.event &&
          props.event.map(
            (e,i) =>
              e.fields.lat_lon && (
                <Marker position={e.fields.lat_lon} key={i}>
                  <Popup>
                  <Link to={`/eventdetails/${e.fields.id}`}>
                    <div style={{display : "flex" , flexDirection : "column",alignItems : "center", justifyContent :"center"}}>
                    <img src={e.fields.cover_url} alt="cover" width={"150px"} height={"150px"} />
                    <p >{e.fields.title}</p>
                    </div>
                   </Link>
                    </Popup>
                </Marker>
              )
          )}

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
      
      {!props.center &&
      <div className="searchMap">
        <form onSubmit={(e) => geocodeAddress(e)}>
          <input
            className="inputforms"
            type="text"
            placeholder="Ville / Code Postal"
            value={town}
            onChange={(e) => setTown(e.target.value)}
          />
           <i style={{color: '#5CBDBB' }} className="fa-sharp fa-solid fa-location-crosshairs" onClick={() => geoLocationCoord()}></i>
          <button className="mapsearchbtn" type="submit">
            Search
          </button>
        </form>
 
       
      </div>
      }
    </>
  );
};

export default MapComponent;
