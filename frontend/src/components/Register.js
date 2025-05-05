import { useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    async function Register(e) {
        e.preventDefault();
        setError('');

        if (!email || !username || !password) {
            setError('Vsa polja so obvezna!');
            return;
        }

        try {
            const res = await fetch("http://localhost:3001/users", {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    username: username,
                    password: password
                })
            });

            const data = await res.json();

            if (data._id !== undefined) {
                setSuccess(true);
                setUsername('');
                setPassword('');
                setEmail('');
            } else {
                setError('Registracija ni uspela. Poskusite znova.');
            }
        } catch (err) {
            setError('Prišlo je do napake pri komunikaciji s strežnikom.');
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="mb-0">Registracija</h3>
                        </div>
                        <div className="card-body">
                            {success && (
                                <div className="alert alert-success" role="alert">
                                    Registracija uspešna! Zdaj se lahko <Link to="/login">prijavite</Link>.
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={Register}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">E-pošta</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="vnesite e-pošto"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Uporabniško ime</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder="vnesite uporabniško ime"
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
                                        placeholder="vnesite geslo"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">Registracija</button>
                                </div>
                            </form>
                        </div>
                        <div className="card-footer text-center">
                            <p className="mb-0">
                                Že imate račun? <Link to="/login">Prijava</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;