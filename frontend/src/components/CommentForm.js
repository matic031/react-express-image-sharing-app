import { useState } from 'react';

function CommentForm({ photoId, onCommentAdded }) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('Komentar ne more biti prazen.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3001/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    content: content,
                    photoId: photoId
                })
            });

            if (!response.ok) {
                throw new Error('Napaka pri dodajanju komentarja');
            }

            setContent('');
            setIsSubmitting(false);

            // Notify parent component that a new comment was added
            if (onCommentAdded) {
                onCommentAdded();
            }
        } catch (err) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="comment-form mb-4">
            <h4>Dodaj komentar</h4>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Napiši komentar..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="3"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Pošiljanje...' : 'Objavi komentar'}
                </button>
            </form>
        </div>
    );
}

export default CommentForm;