import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { albums } from "./data/albums";

    function Home() {
  return (
    <div className="container">
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

      {filteredAlbums.map((album) => (

       <div
  key={album.id}
  style={{
    backgroundColor: "white",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  }}
>

         <Link to={`/albums/${album.id}`}>
  <h3>{album.title}</h3>
</Link>
          <p>{album.year}</p>

          <button onClick={() => addToCollection(album)}>
  Add to Collection
</button>
          <hr />
        </div>
      ))}
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

      {collection.length === 0 ? (

        <p>No albums collected yet.</p>
      ) : (
       collection.map((album) => (
  <div
    key={album.id}
    style={{
      backgroundColor: "white",
      padding: "15px",
      margin: "10px 0",
      borderRadius: "10px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    }}
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

  useEffect(() => {
    localStorage.setItem(
      "collection",
      JSON.stringify(collection)
    );
  }, [collection]);

  return (
    <BrowserRouter>
      <nav>
        <strong> Dream Collector</strong> |{" "}
        <Link to="/">Home</Link> |{" "}
        <Link to="/albums">Albums</Link> |{" "}
        <Link to="/collection">My Collection</Link> |{" "}
        <Link to="/wishlist">Wishlist</Link> |{" "}
        <Link to="/profile">Profile</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/albums"
          element={
            <Albums addToCollection={addToCollection} />
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