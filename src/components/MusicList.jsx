import React, { useState, useRef, useEffect } from 'react';
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";

const musicList = [
  { id: 1,  title: "Cassical Piano", file: "/music/cassical-piano.mp3",image:"piano.png" },
  { id: 2, title: "Om Chanting", file: "/music/om-chanting.mp3",image:"om-chants.png"},
  { id: 3, title: "Relaxing Birds & Piano", file: "/music/relaxing-birds-and-piano-music.mp3",image:"bird-piano.png" },
  { id: 4, title: "Relaxing Guitar", file: "/music/relaxing-guitar-music.mp3" ,image:"guitar.png"},
  { id: 5, title: "Yoga Meditation", file: "/music/yoga-meditation-music.mp3",image:"yoga.png" },
  { id: 6, title: "Buddhism Singing Bowl", file: "/music/singing-bowl.mp3" ,image:"singingbowl.png"},
];

const MusicList = () => {
  const [showMusicList, setShowMusicList] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', () => setDuration(audio.duration));
    };
  }, []);

  const updateTime = () => setCurrentTime(audioRef.current.currentTime);

  const playMusic = (music) => {
    if (currentTrack && currentTrack.id === music.id) {
      togglePlayPause();
    } else {
      audioRef.current.src = music.file;
      audioRef.current.play();
      setCurrentTrack(music);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <>
      <button 
        onClick={() => setShowMusicList(true)}
        className="mb-2 rounded-full mr-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white px-4 py-2"
      >
        Calming Music
      </button>

      {showMusicList && (
        <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#FFFFF0] px-8 py-2 my-10 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 rounded-full">Calming Music</h2>
            <ul className="grid grid-cols-2 gap-4 mb-4 ">
              {musicList.map((music) => (
                <li key={music.id} className="mb-2">
                  <button 
                    onClick={() => playMusic(music)}
                    className="text-black outline-none p-4 bg-[#fffcb2] hover:font-medium  rounded-xl flex items-center w-full"
                  >
                    <img 
                      src={music.image} 
                      alt={music.title} 
                      className="w-8 h-8 object-cover rounded-full mr-3"
                    />
                    <span>{music.title}</span>
                  </button>
                </li>
              ))}
            </ul>
            {currentTrack && (
              <div className="mb-4">
                <p className="font-bold">{currentTrack.title}</p>
                <div className="flex items-center  bg-[#fffcb2] p-2 rounded-xl mt-2">
                  <button 
                    onClick={togglePlayPause}
                    className="bg-transparent text-black outline-none px-4 py-2 mr-2"
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <input 
                    type="range"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={handleSliderChange}
                    className="w-full accent-black outline-none"
                  />
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}
            <button 
              onClick={() => {
                setShowMusicList(false);
                audioRef.current.pause();
                setIsPlaying(false);
              }}
              className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicList;
