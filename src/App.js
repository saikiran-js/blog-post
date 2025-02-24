import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux"; 
import store from "./redux/store"; 
import HomePage from "./components/HomePage"; 
import PostFeed from "./components/PostFeed"; 

const App = () => {
  return (
    <Provider store={store}> 
      <Router>
        <Routes>
          {/* Home Page Route */}
          <Route path="/" element={<HomePage />} />

          {/* Post Feed Route */}
          <Route path="/posts" element={<PostFeed />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
