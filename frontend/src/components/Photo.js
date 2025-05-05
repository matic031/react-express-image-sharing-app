import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

function Photo(props) {
    const photo = props.photo;
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, 'dd. MM. yyyy HH:mm');
    };

    return (
        <div className="card mb-4">
            <Link to={`/photo/${photo._id}`}>
                <img
                    className="card-img-top"
                    src={`http://localhost:3001${photo.path}`}
                    alt={photo.name}
                />
            </Link>
            <div className="card-body">
                <h5 className="card-title">{photo.name}</h5>
                {photo.message && <p className="card-text">{photo.message}</p>}
                <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group">
                        <span className="me-3">
                            <i className="fas fa-thumbs-up"></i> {photo.likes || 0}
                        </span>
                        <span className="me-3">
                            <i className="fas fa-thumbs-down"></i> {photo.dislikes || 0}
                        </span>
                        <span>
                            <i className="fas fa-eye"></i> {photo.views || 0}
                        </span>
                    </div>
                    <small className="text-muted">
                        Avtor: {photo.postedBy?.username || "Neznan"}
                    </small>
                </div>
                <div className="mt-2">
                    <small className="text-muted">
                        Objavljeno: {formatDate(photo.createdAt)}
                    </small>
                </div>
            </div>
        </div>
    );
}

export default Photo;