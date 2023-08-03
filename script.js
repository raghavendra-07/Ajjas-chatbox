let comments = []; // This will be populated with the comment data retrieved from the back-end API.

function renderComments() {
  const commentsContainer = document.getElementById('comments');
  commentsContainer.innerHTML = '';

  const sortSelect = document.getElementById('sortSelect');
  const selectedSort = sortSelect.value;

  // Optionally, you can also implement filtering based on a selected user.
  const filterInput = document.getElementById('filterInput');
  const selectedUser = filterInput.value.trim().toLowerCase();

  // Apply sorting and filtering (if selected).
  let sortedComments = comments.slice();
  if (selectedSort === 'newest') {
    sortedComments.sort((a, b) => b.timestamp - a.timestamp);
  } else if (selectedSort === 'oldest') {
    sortedComments.sort((a, b) => a.timestamp - b.timestamp);
  } else if (selectedSort === 'most_score') {
    sortedComments.sort((a, b) => b.score - a.score);
  } else if (selectedSort === 'least_score') {
    sortedComments.sort((a, b) => a.score - b.score);
  }

  // Render comments and replies.
  sortedComments.forEach(comment => {
    if (!selectedUser || comment.user.toLowerCase() === selectedUser) {
      const commentDiv = document.createElement('div');
      commentDiv.classList.add('comment');
      commentDiv.innerHTML = `<p>${comment.text}</p>
                              <p>Score: ${comment.score}</p>
                              <button onclick="upvote(${comment.id})">Upvote</button>
                              <button onclick="downvote(${comment.id})">Downvote</button>`;

      comment.replies.forEach(reply => {
        if (!selectedUser || reply.user.toLowerCase() === selectedUser) {
          const replyDiv = document.createElement('div');
          replyDiv.classList.add('reply');
          replyDiv.innerHTML = `<p>${reply.text}</p>
                                <p>Score: ${reply.score}</p>
                                <button onclick="upvote(${comment.id}, ${reply.id})">Upvote</button>
                                <button onclick="downvote(${comment.id}, ${reply.id})">Downvote</button>`;

          commentDiv.appendChild(replyDiv);
        }
      });

      commentsContainer.appendChild(commentDiv);
    }
  });
}

// Helper function to find a comment by its id.
function findComment(commentId) {
  return comments.find(comment => comment.id === commentId);
}

// Helper function to find a reply in a comment by its id.
function findReply(comment, replyId) {
  return comment.replies.find(reply => reply.id === replyId);
}

function upvote(commentId, replyId = null) {
  const target = replyId ? findReply(findComment(commentId), replyId) : findComment(commentId);
  if (target) {
    target.score += 1;
    renderComments();
  }
}

function downvote(commentId, replyId = null) {
  const target = replyId ? findReply(findComment(commentId), replyId) : findComment(commentId);
  if (target) {
    target.score -= 1;
    renderComments();
  }
}

document.getElementById('commentForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const commentInput = document.getElementById('commentInput');
  const newCommentText = commentInput.value.trim();

  if (newCommentText) {
    const newComment = {
      id: comments.length + 1,
      text: newCommentText,
      score: 0,
      user: 'JohnDoe', // Assuming this is the currently logged-in user.
      timestamp: new Date(),
      replies: []
    };

    comments.push(newComment);
    commentInput.value = '';
    renderComments();
  }
});

// Sample data (replace this with API calls to fetch actual comments from the back-end).
comments = [
  {
    id: 1,
    text: 'This is the first comment.',
    score: 5,
    user: 'RohitSharma',
    timestamp: new Date('2023-08-03T12:00:00'),
    replies: [
      {
        id: 1,
        text: 'Reply to the first comment.',
        score: 3,
        user: 'Viratkolhi',
        timestamp: new Date('2023-08-03T12:10:00'),
        replies: []
      },
      {
        id: 2,
        text: 'Another reply to the first comment.',
        score: 2,
        user: 'RohitSharma',
        timestamp: new Date('2023-08-03T12:15:00'),
        replies: []
      }
    ]
  },
  // Add more comments and replies as needed...
];

renderComments(); // Render initial comments on page load.
