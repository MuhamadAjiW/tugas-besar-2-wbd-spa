import "./App.css";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import BookList from "./pages/Booklist";
import Playlist from "./pages/Playlist";
import Subscriber from "./pages/Subscriber";
import PlaylistDetails from "./pages/PlaylistDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { RequireAuth, RequireNoAuth } from "./middlewares/AuthMiddleware";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<RequireNoAuth element={<Login />} />} />
          <Route
            path="/login"
            element={<RequireNoAuth element={<Login />} />}
          />
          <Route
            path="/register"
            element={<RequireNoAuth element={<Register />} />}
          />
          {/* Protected */}
          <Route path="/home" element={<RequireAuth element={<Home />} />} />
          <Route
            path="/books"
            element={<RequireAuth element={<BookList />} />}
          />
          <Route
            path="/playlists"
            element={<RequireAuth element={<Playlist />} />}
          />
          <Route
            path="/subscribers"
            element={<RequireAuth element={<Subscriber />} />}
          />
          <Route
            path="/playlistdetails/:id"
            element={<RequireAuth element={<PlaylistDetails />} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
