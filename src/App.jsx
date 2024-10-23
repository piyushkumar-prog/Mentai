import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/navbar";
import Header from "./components/Header";
import axios from "axios";
import { MdVolumeUp } from "react-icons/md";
import Markdown from 'react-markdown';
import { IoMdSend } from "react-icons/io";
import MusicList from './components/MusicList';


function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messageContainerRef = useRef(null);
  const [showQuotePopup, setShowQuotePopup] = useState(false);
  const [dailyQuote, setDailyQuote] = useState("");
  const [moodHistory, setMoodHistory] = useState([]);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(true);
  const [showDailyQuote, setShowDailyQuote] = useState(false);
  


  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);
  
  const fetchDailyQuote = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get("https://api.quotable.io/random");
        setDailyQuote(response.data.content);
        return;
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        if (i === retries - 1) {
          const randomIndex = Math.floor(Math.random() * localQuotes.length);
          setDailyQuote(localQuotes[randomIndex]);
        }
      }
    }
  };
  

  const localQuotes = [
    "Every day is a new opportunity to grow and be a better version of yourself.",
    "Believe you can and you're halfway there.",
    "The future belongs to those who believe in the beauty of their dreams.",
  ];
  

  useEffect(() => {
    fetchDailyQuote();
  }, []);
  
  const submitMood = (selectedMood) => {
    const newMoodEntry = { date: new Date(), mood: selectedMood };
    setMoodHistory([...moodHistory, newMoodEntry]);
    setShowMoodTracker(false);
  };
  
  
  
  const generateWeeklyReport = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyMoods = moodHistory.filter(entry => new Date(entry.date) >= oneWeekAgo);
    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return daysOfWeek.map(day => {
      const moodForDay = weeklyMoods.find(entry => daysOfWeek[new Date(entry.date).getDay()] === day);
      return { day, mood: moodForDay ? moodForDay.mood : null };
    });
  };
  
  const speakMessage = (text) => {
    const cleanText = text.replace(/[^a-zA-Z0-9 .,?!]/g, '');
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
  
    const speech = new SpeechSynthesisUtterance(cleanText);
    
    speech.rate = 0.7;
    speech.pitch = 0.1;
    speech.volume = 1.0;
    
    window.speechSynthesis.speak(speech);
  };
  
  async function generateAnswer() {
    setLoading(true);
    console.log("Loading....");
    try {
      const response = await axios.post('/api/chat', {
        message: question,
        user_id: localStorage.getItem('user_id') || null
      });
      
      const newAnswer = response.data.response; 
      if (response.data.user_id) {
        localStorage.setItem('user_id', response.data.user_id);
      }
      setMessages([...messages, 
        { type: 'user', content: question },
        { type: 'ai', content: newAnswer }
      ]);
      setQuestion("");
      setLoading(false);
  
      speakMessage(newAnswer);
    } catch (error) {
      console.error("Error fetching response:", error);
      setLoading(false);
    }
  }
  
  

 
  return (
    <>
      <div className="bg-gradient-to-r from-orange-200 via-yellow-100 to-pink-200 min-h-screen w-full overflow-x-hidden flex flex-col">
        <Navbar />
        <Header />
        <div className="ml-6 md:ml-16 rounded-full">
        {showDailyQuote && (
  <div className="fixed top-4 right-4 bg-white p-4 md:mr-10 rounded-full shadow-md max-w-md">
    <h3 className="text-xl font-bold mb-2">Daily Quote</h3>
    <p>{dailyQuote}</p>
  </div>
)}
        <button 
         onClick={() => setShowQuotePopup(true)}
         className="mb-2 mr-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white px-4 py-2">
         Daily Quote
        </button>

        <button 
  onClick={() => setShowMoodTracker(true)}
  className="mb-2 mr-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white px-4 py-2 rounded-full"
>
  Track Mood
</button>
<button 
  onClick={() => setShowWeeklyReport(true)}
  className="mb-2 mr-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white px-4 py-2 rounded-full"
>
  Weekly Report
</button>
  <MusicList/>
  </div>

        <div className="flex-grow mb-20 md:mb-10 bg-gradient-to-r from-pink-100 via-yellow-100 to-orange-100 text-black w-11/12 pr-4 md:p-6 p-4 m-2 md:ml-12 rounded-2xl flex flex-col">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'} flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`inline-block p-2 px-6 py-4 rounded-lg ${message.type === 'user' ? 'bg-[#fec381]' : 'bg-[#f9de8a]'} break-words h-auto`}>
                <Markdown className="md:text-xl font-one text-xs">{message.content}</Markdown>
              </div>
              {message.type === 'ai' && (
                <div className="flex flex-col ml-2">
                  <button onClick={() => speakMessage(message.content)} className="mt-2"><MdVolumeUp /></button>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="animate-pulse">
              <p>Typing.....</p>
            </div>
          )}
        </div>

        <div className=" fixed bg-transparent p-4 bottom-0 left-0 right-0">
          <div className="flex items-center justify-center">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  generateAnswer();
                }
              }}
              type="text"
              className=" font-one font-medium rounded-3xl md:w-1/2 w-3/4 mb-2 text-slate-800 border-2 border-solid border-white bg-white bg-clip-padding px-3 py-2 text-base leading-[1.6] outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-black focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-slate-500 dark:focus:border-primary"
              placeholder="Talk with your friend,MentAI..."
            />
            <button onClick={generateAnswer} className="rounded-3xl  mb-2 bg-gradient-to-r from-pink-500 to-orange-400 p-2">
              <IoMdSend className="text-black text-sm w-6 h-6"  />
            </button>
          </div>
        </div>
      </div>
      {showQuotePopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-[#FFFFF0] p-8 rounded-lg max-w-md">
      <h2 className="text-2xl font-bold mb-4">Daily Quote</h2>
      <p className="text-lg italic mb-6">{dailyQuote}</p>
      <button 
        onClick={() => setShowQuotePopup(false)}
        className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-4 py-2 rounded-md"
      >
        Close
      </button>
    </div>
  </div>
)}

{showMoodTracker && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-[#FFFFF0] p-8 rounded-lg max-w-md">
      <h2 className="text-2xl font-bold mb-4">How are you feeling today?</h2>
      <div className="grid grid-cols-3 gap-10 mb-4 outline-none">
        {['happy', 'relax', 'excited', 'sad', 'frustrated', 'stress', 'angry', 'confused', 'worried'].map((mood) => (
          <button 
            key={mood}
            onClick={() => submitMood(mood)}
            className="bg-transparent outline-none">
            <img src={`${mood}-face.png`} className="w-10 h-10 hover:animate-bounce" alt={mood} />
          </button>
        ))}
      </div>
    </div>
  </div>
)}
{showWeeklyReport && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-[#FFFFF0] p-8 rounded-lg max-w-md">
      <h2 className="text-2xl font-bold mb-4">Your Weekly Mood Report</h2>
      <div className="grid grid-cols-7 gap-4 mb-4">
        {generateWeeklyReport().map(({ day, mood }) => (
          <div key={day} className="flex flex-col items-center">
            {mood && <img src={`${mood}-face.png`} className="w-10 h-10" alt={mood} />}
            <span className="text-xs mt-1">{day.slice(0, 3)}</span>
          </div>
        ))}
      </div>
      <button 
        onClick={() => setShowWeeklyReport(false)}
        className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-4 py-2 rounded-md"
      >
        Close
      </button>
    </div>
  </div>
)}
    </>
  );
}

export default App;
