import { createContext, useEffect, useReducer } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { useCallback } from "react";

// const BASE_URL = "http://localhost:8000";
const STORAGE_KEY = "pintrail-cities";

const CitiesContext = createContext();

const initializeState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: "",
};

function reducer(state, action) {
    switch (action.type) {
        case "loading":
            return {
                ...state,
                isLoading: true,
            };
        case "city/loaded":
            return {
                ...state,
                isLoading: false,
                currentCity: action.payload,
            };
        case "city/created":
            return {
                ...state,
                isLoading: false,
                cities: [...state.cities, action.payload],
                currentCity: action.payload,
            };
        case "city/deleted":
            return {
                ...state,
                isLoading: false,
                cities: state.cities.filter(
                    (city) => city.id !== action.payload,
                ),
                currentCity: {},
            };
        case "rejected":
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        default:
            throw new Error("Unknown action type");
    }
}

function CitiesProvider({ children }) {
    // const [cities, setCities] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [currentCity, setCurrentCity] = useState({});
    const [storedCities, setStoredCities] = useLocalStorageState(
        [],
        STORAGE_KEY,
    );

    const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
        reducer,
        { ...initializeState, cities: storedCities },
    );

    useEffect(() => {
        setStoredCities(cities);
    }, [cities, setStoredCities]);

    const getCity = useCallback(
        async function getCity(id) {
            if (Number(id) === currentCity.id) return;
            dispatch({ type: "loading" });
            try {
                // const res = await fetch(`${BASE_URL}/cities/${id}`);
                // const data = await res.json();
                const city = cities.find(
                    (city) => city.id === id || city.id === Number(id),
                );

                if (!city) throw new Error("City not found");

                dispatch({ type: "city/loaded", payload: city });
            } catch {
                dispatch({
                    type: "rejected",
                    payload: "There was an error loading the city.",
                });
            }
        },
        [currentCity.id, cities],
    );

    async function createCity(newCity) {
        dispatch({ type: "loading" });
        try {
            // const res = await fetch(`${BASE_URL}/cities/`, {
            //     method: "POST",
            //     body: JSON.stringify(newCity),
            //     headers: { "Content-Type": "application/json" },
            // });
            // const data = await res.json();
            const city = {
                ...newCity,
                // added: generate a unique id for localStorage data
                id: crypto.randomUUID(),
            };
            dispatch({ type: "city/created", payload: city });
        } catch {
            dispatch({
                type: "rejected",
                payload: "There was an error creating a city.",
            });
        }
    }

    async function deleteCity(id) {
        dispatch({ type: "loading" });
        try {
            // await fetch(`${BASE_URL}/cities/${id}`, {
            //     method: "DELETE",
            // });
            dispatch({ type: "city/deleted", payload: id });
        } catch {
            dispatch({
                type: "rejected",
                payload: "There was an error deleting a city.",
            });
        }
    }

    return (
        <CitiesContext.Provider
            value={{
                cities,
                isLoading,
                currentCity,
                error,
                getCity,
                createCity,
                deleteCity,
            }}
        >
            {children}
        </CitiesContext.Provider>
    );
}

export { CitiesProvider, CitiesContext };
