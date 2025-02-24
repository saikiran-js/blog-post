const initialState = {
  posts: JSON.parse(localStorage.getItem("posts")) || [], 
  filteredPosts: [],
  searchQuery: "",
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_POSTS":
      return {
        ...state,
        posts: action.payload,
        filteredPosts: action.payload,
      };
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
        filteredPosts: state.posts.filter((post) =>
          post.title.toLowerCase().includes(action.payload.toLowerCase())
        ),
      };
    case "UPDATE_POST":
      const updatedPosts = state.posts.map((post) =>
        post.id === action.payload.id ? action.payload : post
      );
      return {
        ...state,
        posts: updatedPosts,
        filteredPosts: updatedPosts,
      };
    default:
      return state;
  }
};
