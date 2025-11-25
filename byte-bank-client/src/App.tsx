import { Route, Routes, Navigate, HashRouter } from "react-router-dom";
import { ToastContainer } from "react-toast";
import FileUpload from "./pages/FileUpload";
import Login from "./pages/login";
import { getUserSessionStatus } from "./services/cookies.service";

function PrivateRoute({ children }: { children: JSX.Element }) {
    const isAuthenticated = getUserSessionStatus() // Example session check
    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/file-upload"
                    element={
                        <PrivateRoute>
                            <FileUpload />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
            <ToastContainer position="bottom-left" delay={2500} />
        </HashRouter>
    );
}
