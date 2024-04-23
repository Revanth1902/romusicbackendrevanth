import React, { useState, useEffect } from 'react';

const UserDashboard = () => {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch('https://popularbeatsbackend.onrender.com/api/songs');
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const data = await response.json();
      setSongs(data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleSongClick = (song) => {
    setSelectedSong(song);
  };

  const handleDownload = () => {
    if (selectedSong) {
      window.open(selectedSong.url, '_blank');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img src="/imageinlogo.jpg" alt="Logo" style={styles.logo} />
        <h1 style={styles.heading}>Popular Beats</h1>
      </header>
      <main style={styles.main}>
        <div style={styles.songList}>
          <h2 style={styles.title}>Songs</h2>
          <ul style={styles.ul}>
            {songs.map(song => (
              <li key={song.id} onClick={() => handleSongClick(song)} style={styles.li}>
                {song.name}
              </li>
            ))}
          </ul>
        </div>
        {selectedSong && (
          <div style={styles.popup}>
            <div style={styles.popupContent}>
              <h3 style={styles.popupTitle}>{selectedSong.name}</h3>
              <p style={styles.popupDescription}>{selectedSong.description}</p>
              <button style={styles.button} onClick={handleDownload}>Download</button>
              <button style={styles.button} onClick={() => setSelectedSong(null)}>Close</button>
            </div>
          </div>
        )}
      </main>
      <footer style={styles.footer}>
        <p style={styles.footerText}>&copy; 2024 Popular Beats</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '20px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100px',
    marginRight: '10px',
  },
  heading: {
    margin: '0',
  },
  main: {
    padding: '20px',
  },
  songList: {
    marginBottom: '20px',
  },
  title: {
    marginBottom: '10px',
  },
  ul: {
    listStyle: 'none',
    padding: '0',
  },
  li: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginBottom: '5px',
    cursor: 'pointer',
  },
  popup: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContent: {
    backgroundColor: 'blue',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
  
  },
  popupTitle: {
    marginTop: '0',
  },
  popupDescription: {
    marginBottom: '15px',
  },
  button: {
    padding: '10px 20px',
    marginTop: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin:"2%",
  },
  footer: {
    position:"absolute",
    bottom:"0",
    width:"100%",
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 0',
    textAlign: 'center',
  },
  footerText: {
    margin: '0',
  },
};

export default UserDashboard;
