import './App.css';
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from "leaflet";

const HEADQUARTER = [48.137154, 11.576124]

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [shipmentId, setShipmentId] = useState(null);
  const [address, setAddress] = useState(null);
  const [status, setStatus] = useState(null);
  const [rider, setRider] = useState(null);

  const map = useMap();

  useEffect(() => {
    const interval = setInterval(() => {
      // query parameters
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
      const track = params.track;
      if (track === null) {
        return;
      }

      // Ajax call
      fetch(`http://127.0.0.1:5000/shipment/${track}`)
        .then(response => response.json())
        .then(data => {
          console.log(window.location)

          const lat = data.location.lat;
          const long = data.location.long;
          const latlong = [lat, long];
          setPosition(latlong);

          // Tooltip Description
          setShipmentId(data._id);
          setAddress(data.address);
          setStatus(data.status);
          setRider(data.rider);

          map.setView(latlong, map.getZoom()); // setView
        });
    }, 5 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [map]);

  if (status !== "IN_DELIVERY") {
    return null
    // return (
    //   <Marker position={HEADQUARTER}>
    //     <Popup>
    //       Package has not been shiped yet
    //     </Popup>
    //   </Marker>
    // );
  }

  const myIcon = new Icon({
    iconUrl: "./truck.svg",
    iconSize: [25, 25]
  });

  return (
    <Marker position={position} icon={myIcon}>
      <Popup>
        Delivery is on the way!<br /><br />
        Status: {status} <br />
        Target address: {address} <br />
        Your friendly rider: {rider}
      </Popup>
    </Marker>
  );
}

function App() {
  return (
    <MapContainer center={HEADQUARTER} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  )
}

export default App;
