import { useContext, useState } from 'react'
import { Navigate } from 'react-router';
import { UserContext } from '../userContext';

function AddPhoto(props) {
    const userContext = useContext(UserContext);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [file, setFile] = useState('');
    const [uploaded, setUploaded] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();

        if (!name) {
            alert("Vnesite ime!");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('message', message);
        formData.append('image', file);

        const res = await fetch('http://localhost:3001/photos', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        const data = await res.json();

        setUploaded(true);
    }

    return (
        <div className="container mt-4">
            <h2>Objavi novo sliko</h2>
            <form className="form-group" onSubmit={onSubmit}>
                {!userContext.user ? <Navigate replace to="/login" /> : ""}
                {uploaded ? <Navigate replace to="/" /> : ""}
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Naslov slike</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Ime slike"
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="message" className="form-label">Sporočilo/Opis</label>
                    <textarea
                        className="form-control"
                        id="message"
                        placeholder="Dodaj sporočilo k sliki"
                        value={message}
                        onChange={(e) => { setMessage(e.target.value) }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="file" className="form-label">Izberi sliko</label>
                    <input
                        type="file"
                        className="form-control"
                        id="file"
                        onChange={(e) => { setFile(e.target.files[0]) }}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Naloži</button>
            </form>
        </div>
    )
}

export default AddPhoto;