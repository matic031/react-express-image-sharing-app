import { useState, useEffect } from 'react';
import Photo from './Photo';

function Photos() {
    const [photos, setPhotos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getPhotos = async () => {
            setIsLoading(true);
            try {
                const res = await fetch("http://localhost:3001/photos");

                if (!res.ok) {
                    throw new Error('Failed to fetch photos');
                }

                const data = await res.json();
                setPhotos(data);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        getPhotos();
    }, []);

    if (isLoading) return <div className="container mt-4"><p>Loading photos...</p></div>;
    if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Najnovejše fotografije</h2>

            {photos.length === 0 ? (
                <p className="text-center">Ni objavljenih slik. Bodite prvi, ki objavi sliko!</p>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {photos.map(photo => (
                        <div className="col" key={photo._id}>
                            <Photo photo={photo} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Photos;