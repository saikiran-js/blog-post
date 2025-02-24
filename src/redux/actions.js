import axios from "axios";

export const setPosts = (posts) => {
  return {
    type: "SET_POSTS",
    payload: posts,
  };
};

export const setSearchQuery = (query) => {
  return {
    type: "SET_SEARCH_QUERY",
    payload: query,
  };
};

export const addPost = (newPost) => (dispatch, getState) => {
  const posts = getState().posts; 
  const updatedPosts = [...posts, newPost];
  
  dispatch(setPosts(updatedPosts));

  localStorage.setItem("posts", JSON.stringify(updatedPosts));
};

export const deletePost = (postId) => (dispatch, getState) => {
  const posts = getState().posts.filter((post) => post.id !== postId); 
  dispatch(setPosts(posts));
  localStorage.setItem("posts", JSON.stringify(posts));
};

export const updatePost = (updatedPost) => (dispatch) => {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const updatedPosts = posts.map((post) =>
    post.id === updatedPost.id ? updatedPost : post
  );
  localStorage.setItem("posts", JSON.stringify(updatedPosts));
  dispatch(setPosts(updatedPosts));
};



export const fetchPosts = () => async (dispatch) => {
try {
  const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
  localStorage.setItem("posts", JSON.stringify(response.data));
  dispatch(setPosts(response.data));
} catch (error) {
  console.error("Error fetching posts", error);
}
};