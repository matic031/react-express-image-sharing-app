import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../userContext';
import { format } from 'date-fns';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

function PhotoDetail() {
    const { id } = useParams();
    const [photo, setPhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshComments, setRefreshComments] = useState(false);
    const userContext = useContext(UserContext);

    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                const response = await fetch(`http://localhost:3001/photos/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch photo');
                }
                const data = await response.json();
                setPhoto(data);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchPhoto();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, 'dd. MM. yyyy HH:mm');
    };

    const handleLike = async () => {
        if (!userContext.user) return;

        try {
            const response = await fetch(`http://localhost:3001/photos/${id}/like`, {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to like photo');
            }

            const updatedPhoto = await response.json();
            setPhoto(updatedPhoto);
        } catch (error) {
            console.error('Error liking photo:', error);
        }
    };

    const handleDislike = async () => {
        if (!userContext.user) return;

        try {
            const response = await fetch(`http://localhost:3001/photos/${id}/dislike`, {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to dislike photo');
            }

            const updatedPhoto = await response.json();
            setPhoto(updatedPhoto);
        } catch (error) {
            console.error('Error disliking photo:', error);
        }
    };

    const handleCommentAdded = () => {
        setRefreshComments(prev => !prev);
    };

    if (isLoading) return <div className="container mt-4"><p>Loading photo...</p></div>;
    if (error) return <div className="container mt-4"><p>Error: {error}</p></div>;
    if (!photo) return <div className="container mt-4"><p>Photo not found</p></div>;

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-8">
                    <img
                        className="img-fluid rounded"
                        src={`http://localhost:3001${photo.path}`}
                        alt={photo.name}
                    />
                </div>
                <div className="col-md-4">
                    <h2>{photo.name}</h2>
                    {photo.message && <p className="lead">{photo.message}</p>}

                    <div className="d-flex align-items-center mb-3">
                        <p className="me-3 mb-0">
                            <strong>Avtor:</strong> {photo.postedBy?.username || "Neznan"}
                        </p>
                        <p className="mb-0">
                            <small className="text-muted">
                                {formatDate(photo.createdAt)}
                            </small>
                        </p>
                    </div>

                    <div className="d-flex align-items-center mb-4">
                        <button
                            onClick={handleLike}
                            className={`btn ${userContext.user ? 'btn-outline-success' : 'btn-secondary'} me-2`}
                            disabled={!userContext.user}
                        >
                            <i className="fas fa-thumbs-up me-1"></i> {photo.likes || 0}
                        </button>
                        <button
                            onClick={handleDislike}
                            className={`btn ${userContext.user ? 'btn-outline-danger' : 'btn-secondary'} me-3`}
                            disabled={!userContext.user}
                        >
                            <i className="fas fa-thumbs-down me-1"></i> {photo.dislikes || 0}
                        </button>
                        <span className="ms-3">
                            <i className="fas fa-eye me-1"></i> {photo.views || 0} views
                        </span>
                    </div>

                    {userContext.user ? (
                        <CommentForm photoId={id} onCommentAdded={handleCommentAdded} />
                    ) : (
                        <div className="alert alert-info">
                            Za komentiranje slik se morate <a href="/login">prijaviti</a>.
                        </div>
                    )}
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <h3>Komentarji</h3>
                    <CommentList photoId={id} refreshTrigger={refreshComments} />
                </div>
            </div>
        </div>
    );
}

export default PhotoDetail;