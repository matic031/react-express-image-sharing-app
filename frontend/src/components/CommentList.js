import { useState, useEffect } from 'react';
import Comment from './Comment';

function CommentList({ photoId, refreshTrigger }) {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:3001/comments/photo/${photoId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }

                const data = await response.json();
                setComments(data);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [photoId, refreshTrigger]);

    if (isLoading) return <p>Loading comments...</p>;
    if (error) return <p className="text-danger">Error loading comments: {error}</p>;

    return (
        <div className="comment-list">
            {comments.length === 0 ? (
                <p className="text-muted">No comments yet. Be the first to add a comment!</p>
            ) : (
                comments.map(comment => (
                    <Comment key={comment._id} comment={comment} />
                ))
            )}
        </div>
    );
}

export default CommentList;