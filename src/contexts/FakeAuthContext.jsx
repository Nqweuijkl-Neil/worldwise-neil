import { createContext, useReducer } from "react";

const AuthContext = createContext();

const initializeState = {
    user: null,
    isAuthenticated: false,
};

function reducer(state, action) {
    switch (action.type) {
        case "login":
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
            };
        case "logout":
            return initializeState;

        default:
            throw new Error("Something went wrong with the authentication.");
    }
}

const FAKE_USER = {
    name: "John Doe",
    email: "johndoe@example.com",
    password: "johndoe",
    avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }) {
    const [{ user, isAuthenticated }, dispatch] = useReducer(
        reducer,
        initializeState,
    );

    function login(email, password) {
        if (email === FAKE_USER.email && password === FAKE_USER.password)
            dispatch({ type: "login", payload: FAKE_USER });
    }
    function logout() {
        dispatch({ type: "logout" });
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider, AuthContext };
