import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, addPost, updatePost, deletePost, setSearchQuery, setPosts } from "../redux/actions";
import { TextField, Button, IconButton, Box, Pagination, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PrintIcon from '@mui/icons-material/Print';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";

const PostFeed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posts = useSelector((state) => state.filteredPosts);
  const searchQuery = useSelector((state) => state.searchQuery);

  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [editingPost, setEditingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQueryInput, setSearchQueryInput] = useState(searchQuery);
  const [showSearch, setShowSearch] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1); 
  const postsPerPage = 30; 
  const [openEditModal, setOpenEditModal] = useState(false); 
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); 
  const [postToDelete, setPostToDelete] = useState(null); 
  const [selectedPost, setSelectedPost] = useState(null); 

  useEffect(() => {
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) {
      dispatch(setPosts(JSON.parse(storedPosts)));
    } else {
      dispatch(fetchPosts());
    }
  }, [dispatch]);

  const handleAddPost = () => {
    const newPostData = {
      ...newPost,
      id: Date.now(),
    };
    dispatch(addPost(newPostData));
    localStorage.setItem("posts", JSON.stringify([...posts, newPostData]));
    setNewPost({ title: "", body: "" });
    setShowForm(false);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setNewPost({ title: post.title, body: post.body });
    setOpenEditModal(true);
  };

  const handleSavePost = () => {
    const updatedPost = {
      ...editingPost,
      title: newPost.title,
      body: newPost.body,
    };
  
    dispatch(updatePost(updatedPost));

   
    const updatedPosts = posts.map((post) =>
      post.id === updatedPost.id ? updatedPost : post
    );
    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    setNewPost({ title: "", body: "" });
    setShowForm(false);
    setOpenEditModal(false); 
    handleClosePostModal();
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQueryInput(query);
    dispatch(setSearchQuery(query));
    setCurrentPage(1);
  };

  const handleDeletePost = () => {
    dispatch(deletePost(postToDelete.id));

    const updatedPosts = posts.filter((post) => post.id !== postToDelete.id);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    setOpenDeleteDialog(false); 
    handleClosePostModal();
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts
    .filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(indexOfFirstPost, indexOfLastPost);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(posts.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleOpenPostModal = (post) => {
    setSelectedPost(post);
  };

  const handleClosePostModal = () => {
    setSelectedPost(null);
  };

  const openDeleteConfirmation = (post) => {
    setPostToDelete(post);
    setOpenDeleteDialog(true);
  };

  return (
    <Box style={{ padding: "20px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" style={{ padding: '10px', backgroundColor: '#f0f0f0' }} >
        <Typography variant="h6" gutterBottom style={{ color: '#3f51b5', fontWeight: 'bold' }} >
                Welcome to the Blog
              </Typography>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => setShowSearch(!showSearch)} style={{ color: '#4caf50' }} >
            <SearchIcon />
          </IconButton>
          {showSearch && (
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchQueryInput}
              onChange={handleSearch}
              style={{ marginRight: "20px", width: "250px", backgroundColor: '#ffffff' }}
            />
          )}
          <IconButton onClick={() => setShowForm(!showForm)} style={{ color: '##ff22a7' }}>
            <AddCircleIcon />
          </IconButton>
          <IconButton onClick={handleGoHome} style={{ color: '#2196f3' }} >
          <HomeIcon />
        </IconButton>
        </Box>
      </Box>

      {showForm && (
        <Box marginY={2}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Body"
            variant="outlined"
            fullWidth
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            style={{ marginBottom: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={editingPost ? handleSavePost : handleAddPost}
          >
            {editingPost ? "Save Changes" : "Add Post"}
          </Button>
        </Box>
      )}

      {currentPosts.length === 0 ? (
        <Typography>No posts available.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="post table">
            <TableHead>
              <TableRow>
                <TableCell>Blog posts</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell 
                    component="th" 
                    scope="row" 
                    onClick={() => handleOpenPostModal(post)}
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    {post.title}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box display="flex" justifyContent="center" marginTop="20px">
        <Pagination
          count={Math.ceil(posts.length / postsPerPage)}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
        />
      </Box>

      <Dialog open={!!selectedPost} onClose={handleClosePostModal}>
        <DialogTitle>{selectedPost?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            {selectedPost?.body}
          </Typography>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => handleEditPost(selectedPost)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => openDeleteConfirmation(selectedPost)} color="error">
            <DeleteIcon />
          </IconButton>
          <Button onClick={handleClosePostModal} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Body"
            variant="outlined"
            fullWidth
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            style={{ marginBottom: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSavePost} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeletePost} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostFeed;
