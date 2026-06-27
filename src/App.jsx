import { BrowserRouter, Routes, Route, Link, useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { albums } from "./data/albums";
import "./App.css";
import "./index.css";

   function Home() {
  return (
    <div className="hero-card">
      <h1>Dream Collector</h1>

      <p>
        Track your NCT DREAM album collection.
      </p>

      <h3>Features</h3>

      <ul>
        <li>Browse NCT DREAM albums</li>
        <li>Add albums to collection</li>
        <li>Remove albums from collection</li>
        <li>Track collection progress</li>
        <li>Search albums</li>
      </ul>
    </div>
  );
  }

function Albums({ addToCollection }) {
  const [search, setSearch] = useState("");

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>NCT DREAM Albums</h1>

      <input
        type="text"
        placeholder="Search album..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="album-grid">
        {filteredAlbums.map((album) => (
          <div
            key={album.id}
            className="album-card"
          >
            <Link to={`/albums/${album.id}`}>
              <h3>{album.title}</h3>
            </Link>

            <p>{album.year}</p>

            <button
              onClick={() => addToCollection(album)}
            >
              Add to Collection
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Collection({
  collection,
  removeFromCollection,
}) {

  const percentage = (
  (collection.length / albums.length) * 100
).toFixed(1);

  return (

    <div className="container">
      <h1>My Collection ({collection.length})</h1>
      <p>
  Collection Progress:
  {collection.length} / {albums.length}
</p>
      <p>{percentage}% Completed</p>
      <div
  style={{
    width: "100%",
    backgroundColor: "#ddd",
    borderRadius: "10px",
    height: "20px",
  }}
>
  <div 
    style={{
      width: `${percentage}%`,
      backgroundColor: "#00c73c",
      height: "20px",
      borderRadius: "10px",
    }}
  ></div>
</div>

      {collection.length === 0 ? (

        <p>No albums collected yet.</p>
      ) : (
       collection.map((album) => (
  <div
  key={album.id}
  className="album-card"
>
    <h3>{album.title}</h3>
    <p>{album.year}</p>

    <button
      onClick={() => removeFromCollection(album.id)}
    >
      Remove
    </button>

    <hr />
  </div>
))
      )}
    </div>
  );
}

function AlbumDetail({ addToCollection }) {
  const { id } = useParams();

  const album = albums.find(
    (album) => album.id === Number(id)
  );

  if (!album) {
    return <h2>Album not found</h2>;
  }

  return (
    <div className="container">
      <h1>Album Detail</h1>

      <h2>{album.title}</h2>

      <p>Released: {album.year}</p>

      <button onClick={() => addToCollection(album)}>
        Add to Collection
      </button>
    </div>
  );
}

function Profile() {
  return (
    <div className="container">
      <h1>Profile</h1>

      <p>Name: Irna</p>
      <p>Favorite Group: NCT DREAM</p>
      <p>Collection App Owner</p>
    </div>
  );
}

function Wishlist() {
  return (
    <div className="container">
      <h1>Wishlist</h1>
      <p>Albums I want to collect in the future.</p>
    </div>
  );
}

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    const user = {
      username,
      password,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );


    alert("Register successful!");
  };

  return (
    <div className="auth-card">
      <h1>Register</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br /><br />

      <button onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const savedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (
      savedUser &&
      savedUser.username === username &&
      savedUser.password === password
    ) {
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "/";
    } else {
      alert("IWrong username or password");
    }
  };

  return (
    <div className="auth-card">
  <h1>Login</h1>

  <input
    type="text"
    placeholder="Username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
  />

  <br /><br />

  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <br /><br />

  <button onClick={handleLogin}>
    Login
  </button>
</div>
  );
}

function ProtectedRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn");

  return isLoggedIn
    ? children
    : <Navigate to="/login" />;
}

function App() {
  const [collection, setCollection] = useState(() => {
    const savedCollection = localStorage.getItem("collection");

    return savedCollection
      ? JSON.parse(savedCollection)
      : [];
  });

  const addToCollection = (album) => {
    const alreadyExists = collection.find(
      (item) => item.id === album.id
    );

    if (!alreadyExists) {
      setCollection([...collection, album]);
    }
  };

  const removeFromCollection = (id) => {
    setCollection(
      collection.filter((album) => album.id !== id)
    );
  };

  const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "/login";
};

  useEffect(() => {
    localStorage.setItem(
      "collection",
      JSON.stringify(collection)
    );
  }, [collection]);

  return (
    <BrowserRouter>

      <nav className="navbar">
  <div className="nav-left">
    <strong>Dream Collector</strong>
    <Link to="/">Home</Link>
    <Link to="/albums">Albums</Link>
    <Link to="/collection">Collection</Link>
    <Link to="/wishlist">Wishlist</Link>
    <Link to="/profile">Profile</Link>
  </div>

  <div className="nav-right">
  {localStorage.getItem("isLoggedIn") ? (
    <button onClick={handleLogout}>Logout</button>
  ) : (
    <>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </>
  )}
</div>
</nav>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/albums"
          element={
            <ProtectedRoute>
              <Albums addToCollection={addToCollection} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/albums/:id"
          element={
            <AlbumDetail addToCollection={addToCollection} />
          }
        />

        <Route
          path="/collection"
          element={
            <Collection
              collection={collection}
              removeFromCollection={removeFromCollection}
            />
          }
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
      </Routes>

      <footer
        style={{
          textAlign: "center",
          marginTop: "30px",
          padding: "15px",
        }}
      >
        Dream Collector © 2026
      </footer>

    </BrowserRouter>
  );
  }

export default App;