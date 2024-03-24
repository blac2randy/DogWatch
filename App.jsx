import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [banList, setBanList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchData = async () => {
    try {
      let responseData;
      let isBanned = true;

      while (isBanned) {
        const response = await fetch('https://api.thedogapi.com/v1/images/search');
        responseData = await response.json();

        const firstItem = responseData[0];

        isBanned = banList.some(bannedAttribute => Object.keys(firstItem).includes(bannedAttribute));
      }

      setData(responseData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount only

  const addToBanList = (key) => {
    if (key !== 'url') {
      setBanList((prevBanList) => [...prevBanList, key]);
    }
  };

  const removeFromBanList = (attribute) => {
    const updatedBanList = banList.filter(item => item !== attribute);
    setBanList(updatedBanList);
  };

  const handleClick = () => {
    fetchData(); // Re-fetch data when "Discover" button is clicked
  };

  return (
    <div className="App">
      <div className="Header">
        <h1>Watch the dog!</h1>
        <h2>Discover dog breeds around the world</h2>
      </div>
      <div className="container">
        {data && (
          <>
            <img src={data[currentIndex].url} alt="From API call" />
            {/* Display breed name if available */}
            {data[currentIndex].breeds && (
              <div className="breed-container">
                <h3>Breed:</h3>
                <p>{data[currentIndex].breeds.map(breed => breed.name).join(', ')}</p>
              </div>
            )}
            {/* Display other attributes */}
            {Object.keys(data[currentIndex]).map((key) => (
              <div key={key} onClick={() => addToBanList(key)}>
                {key}: {data[currentIndex][key]}
              </div>
            ))}
          </>
        )}
      </div>
      <div className="ban-list">
        <h3>Ban List</h3>
        {banList.map((item, index) => (
          <div key={index} onClick={() => removeFromBanList(item)}>
            {item}
          </div>
        ))}
      </div>
      <button onClick={handleClick}>Discover</button>
    </div>
  );
}

export default App;
