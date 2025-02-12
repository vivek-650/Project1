import { useNavigate } from "react-router-dom";

const MainPage = () => {
    const navigate = useNavigate();

    const handleRoleSelection = (role) => {
        if (role === "admin") {
            navigate("/admin-login");
        } else if (role === "user") {
            navigate("/user-login");
        }
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0'
    };

    const buttonStyle = {
        margin: '10px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer'
    };

    return (
        <div style={containerStyle}>
            <h1>Select Your Role</h1>
            <div>
            <button style={buttonStyle} onClick={() => handleRoleSelection("admin")}>Admin</button>
            <button style={buttonStyle} onClick={() => handleRoleSelection("user")}>User</button>
            </div>
            
        </div>
    );
};

export default MainPage;
