import "/src/styles/navbar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faHouse,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

function Navbar({ posts, onSearch }) {
  const [searchValue, setSearchValue] = useState("");
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    const filtered = posts.filter((post) =>
      post.Title.toLowerCase().includes(value.toLowerCase())
    );
    onSearch(filtered);
  };

  return (
    <div className="navbar-container">
      <h1 className="logo">idealogy</h1>
      <div className="search">
        <input onChange={handleSearch} value={searchValue} />
        Search
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </div>
      <div className="link-container">
        <Link className="home" to={"/"}>
          <FontAwesomeIcon icon={faHouse} />
        </Link>
        <Link className="create-post" to={"/CreatePost"}>
          <FontAwesomeIcon icon={faPlus} />
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
