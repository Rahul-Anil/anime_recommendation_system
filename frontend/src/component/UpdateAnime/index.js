import React, { useState, useEffect } from 'react';
import EditTable from "./EditTable";


const Index = (props) => {
  const [animeListDefault, setAnimeListDefault] = useState();
  const [animeList, setAnimeList] = useState();

  const fetchData = async () => {
    return await fetch('http://localhost:8080/show?page=1&page_size=1000')
      .then(response => response.json())
      .then(data => {
        setAnimeList(data['results'])
        setAnimeListDefault(data['results'])
      });
  }

  const updateInput = async (input) => {
    const filtered = animeListDefault.filter(anime => {
      return anime.name.toLowerCase().includes(input.toLowerCase())
    })
    setAnimeList(filtered);
  }

  useEffect(() => { fetchData() }, []);

  const BarStyling = { width: "20rem", background: "#F2F1F9", border: "none", padding: "0.5rem" };

  return (
    <form style={{ margin: "60px", padding: "50px", backgroundColor: "white", overflow: "auto", height: "500px", width: "1000px" }}>
      <h1>Anime List</h1>
      <input
        style={BarStyling}
        placeholder={"search anime"}
        onChange={(e) => updateInput(e.target.value) }
      />
      <EditTable animeList={animeList} />
    </form>
  );
}

export default Index