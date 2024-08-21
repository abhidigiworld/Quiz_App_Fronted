import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function TestPage() {
    const { testId } = useParams();
    const [test, setTest] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [mediaStream, setMediaStream] = useState(null);
    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const response = await axios.get(`https://backend-quiz-app-qpdg.onrender.com/api/test/${testId}`);
                setTest(response.data);
                setUserAnswers(new Array(response.data.questions.length).fill(null));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching test:', error);
                setError('Failed to load test.');
                setLoading(false);
            }
        };

        fetchTest();
    }, [testId]);

    useEffect(() => {
        const getMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setMediaStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setPermissionDenied(false);
            } catch (err) {
                console.error('Permission denied:', err);
                setPermissionDenied(true);
            }
        };

        getMedia();

        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [mediaStream]);

    if (permissionDenied) {
        return (
            <div className="p-6 bg-gray-900 min-h-screen flex items-center justify-center text-center text-gray-100">
                <div>
                    <h1 className="text-3xl font-bold mb-6">Permission Required</h1>
                    <p className="mb-6">Please grant camera and audio permissions to start the test.</p>
                    <p className="text-gray-300">Your test will not be displayed until permission is granted.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return <p>Loading test...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const handleAnswerSelect = (answerIndex) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentQuestionIndex] = answerIndex;
        setUserAnswers(updatedAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < test.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleFinishTest = async () => {
        try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('authToken');
    
            if (!token) {
                throw new Error('No token found. Please log in.');
            }
    
            // Decode the token to get the email
            const decodedToken = jwtDecode(token);
            const email = decodedToken.email;
    
            // Make the POST request with the token and user answers
            const response = await axios.post(`http://localhost:2523/api/submittest/${testId}`,
                {
                    answers: userAnswers,
                    email: email 
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token in the headers
                    }
                }
            );
    
            // Navigate to the test result page with the score
            navigate(`/test-result/${testId}`, { state: { score: response.data.score } });
        } catch (error) {
            console.error('Error submitting test:', error);
        }
    };
    


    return (
        <>
            <div className="relative p-6 bg-gray-900 min-h-screen">
                <div className="absolute top-4 right-4 w-1/6 h-1/6">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full h-full object-cover rounded-lg border border-gray-800"
                    />
                </div>

                <div className="pt-12">
                    <h1 className="text-3xl font-bold text-gray-100 mb-6">{test.testName}</h1>
                    <div className="bg-purple-600 shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-gray-100 mb-4">
                            Question {currentQuestionIndex + 1} of {test.questions.length}
                        </h2>
                        <p className="text-gray-200 mb-4">{test.questions[currentQuestionIndex].questionText}</p>
                        <ul className="space-y-2">
                            {test.questions[currentQuestionIndex].options.map((option, index) => (
                                <li
                                    key={index}
                                    className={`cursor-pointer p-2 border rounded transition-colors duration-300 ${userAnswers[currentQuestionIndex] === index
                                        ? 'bg-purple-700 text-white'
                                        : 'bg-purple-600 hover:bg-purple-500 text-gray-100'
                                        }`}
                                    onClick={() => handleAnswerSelect(index)}
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>

                        <div className="flex justify-between mt-6">
                            <button
                                className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors duration-300"
                                onClick={handlePreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </button>
                            <button
                                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors duration-300"
                                onClick={handleNextQuestion}
                                disabled={currentQuestionIndex === test.questions.length - 1}
                            >
                                Next
                            </button>
                        </div>

                        <button
                            className="px-4 py-2 bg-emerald-600 text-gray-100 rounded mt-6 hover:bg-emerald-700 transition-colors duration-300"
                            onClick={handleFinishTest}
                        >
                            Finish Test
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TestPage;
