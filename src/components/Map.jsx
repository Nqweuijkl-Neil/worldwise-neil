import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from "react-leaflet";
import { useEffect } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";
import { useCities } from "../hooks/useCities";

function Map() {
    const { cities } = useCities();
    const {
        isLoading: isLoadingPosition,
        position: geolocationPosition,
        getPosition,
    } = useGeolocation();

    const [mapLat, mapLng] = useUrlPosition();

    const hasUrlPosition = mapLat != null && mapLng != null;

    const mapPosition = geolocationPosition
        ? [geolocationPosition.lat, geolocationPosition.lng]
        : hasUrlPosition
          ? [mapLat, mapLng]
          : [14.557250199976563, 121.06110914491279];

    return (
        <div className={styles.mapContainer}>
            {!geolocationPosition && (
                <Button type="position" onClick={getPosition}>
                    {isLoadingPosition ? "Loading..." : "Use your position"}
                </Button>
            )}
            <MapContainer
                center={mapPosition}
                zoom={6}
                minZoom={2}
                scrollWheelZoom={true}
                className={styles.map}
                maxBounds={[
                    [-90, -180],
                    [90, 180],
                ]}
                maxBoundsViscosity={1.0}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                    noWrap={true}
                />
                {cities.map((city) => (
                    <Marker
                        position={[city.position.lat, city.position.lng]}
                        key={city.id}
                    >
                        <Popup>
                            <span>{city.emoji}</span>{" "}
                            <span>{city.cityName}</span>
                        </Popup>
                    </Marker>
                ))}
                <ChangeCenter position={mapPosition} />
                <DetectClick />
            </MapContainer>
        </div>
    );
}

function ChangeCenter({ position }) {
    const map = useMap();

    useEffect(() => {
        map.panTo(position);
    }, [map, position]);

    return null;
}

function DetectClick() {
    const navigate = useNavigate();

    const map = useMapEvents({
        click: (e) => {
            const bounds = map.options.maxBounds;

            if (bounds && !bounds.contains(e.latlng)) return;
            navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
        },
    });

    return null;
}

export default Map;
