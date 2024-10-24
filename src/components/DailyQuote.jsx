import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const DailyQuote = () => {
    const [quotes, setQuotes] = useState([]);
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [fade, setFade] = useState(false);

    const fetchQuotes = async () => {
        setIsLoading(true);
        try {
            console.log("Fetching new quotes...");
            const genAI = new GoogleGenerativeAI("AIzaSyBAksDQ78gFv_aOo7E91ReCxS9lVpdOM4M");
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });

            const generationConfig = {
                temperature: 1,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
            };

            const chatSession = model.startChat({
                generationConfig,
                history: [],
            });

            const result = await chatSession.sendMessage("Generate 5 (two lines), inspirational daily quotes for mental health and well-being. Each quote should be no longer than 15 words. Separate each quote with a newline character.");
            const newQuotes = result.response.text().split('\n').filter(quote => quote.trim() !== '');

            console.log("New quotes received:", newQuotes);
            setQuotes(newQuotes.map(quote => `"${quote.trim()}"`));
        } catch (error) {
            console.error('Error fetching quotes:', error);
            setQuotes([
                '"Every day is a new opportunity to grow."',
                '"Your mental health is a priority."',
                '"You are stronger than you think."',
                '"Small steps lead to big changes."',
                '"Be kind to your mind."'
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    useEffect(() => {
        if (quotes.length > 0) {
            const interval = setInterval(() => {
                setFade(true);
                setTimeout(() => {
                    setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
                    setFade(false);
                }, 500); // Half of the transition time
            }, 10000); // Change quote every 10 seconds

            return () => clearInterval(interval);
        }
    }, [quotes]);

    return (
        <div className="fixed top-4 right-4 max-w-md p-4 rounded-lg z-50 mt-4">
            {isLoading ? (
                <p className="text-sm italic text-gray-600 font-bold">Loading quotes...</p>
            ) : (
                <p className={`text-sm italic text-[#022954] font-bold transition-opacity duration-1000 ${fade ? 'opacity-0' : 'opacity-100'} font`}>
                    {quotes[currentQuoteIndex]}
                </p>
            )}
        </div>
    );
};

export default DailyQuote;
