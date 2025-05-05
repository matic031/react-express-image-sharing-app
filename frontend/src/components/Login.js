import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate, Link } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext);

    async function Login(e) {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:3001/users/login", {
                method: "POST",
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await res.json();

            if (data._id !== undefined) {
                userContext.setUserContext(data);
            } else {
                setUsername("");
                setPassword("");
                setError("Napačno uporabniško ime ali geslo");
            }
        } catch (err) {
            setError("Prišlo je do napake pri komunikaciji s strežnikom.");
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="mb-0">Prijava</h3>
                        </div>
                        <div className="card-body">
                            {userContext.user ? <Navigate replace to="/" /> : ""}

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={Login}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Uporabniško ime</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder="Vnesite uporabniško ime"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Geslo</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Vnesite geslo"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">Prijava</button>
                                </div>
                            </form>
                        </div>
                        <div className="card-footer text-center">
                            <p className="mb-0">
                                Nimate računa? <Link to="/register">Registracija</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;