import { useContext } from 'react';
import { UserContext } from '../userContext';
import { format } from 'date-fns';

function Comment({ comment }) {
    const userContext = useContext(UserContext);
    const isOwner = userContext.user && userContext.user._id === comment.postedBy._id;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, 'dd. MM. yyyy HH:mm');
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <p className="card-text">{comment.content}</p>
                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                        <small className="text-muted me-2">
                            <strong>{comment.postedBy.username}</strong>
                        </small>
                        <small className="text-muted">
                            {formatDate(comment.createdAt)}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comment;