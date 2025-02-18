import { ToastContainer } from "react-toast";
import FileUpload from "./pages/FileUpload";
import Login from "./pages/login";

export default function App() {
    return (
        <>
            {/* <Login /> */}
            <FileUpload />
            {/* <FileTable /> */}
            <ToastContainer position="bottom-left" delay={2500} />
        </>
    );
}
