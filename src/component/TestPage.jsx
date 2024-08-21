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
    }, [userAnswers]);

    function exitFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }

    const stopMediaStream = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
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
            const response = await axios.post(`https://backend-quiz-app-qpdg.onrender.com/api/submittest/${testId}`,
                {
                    answers: userAnswers,
                    email: email
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    }
                }
            );

            // Navigate to the test result page with the score
            stopMediaStream();
            exitFullScreen();
            navigate(`/test-result/${testId}`, { state: { score: response.data.score } });
        } catch (error) {
            console.error('Error submitting test:', error);
        }
    };

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const response = await axios.get(`https://backend-quiz-app-qpdg.onrender.com/api/test/${testId}`);
                setTest(response.data);
                console.log(response.data);
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
        const requestFullScreen = () => {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
                document.documentElement.msRequestFullscreen();
            }
        };

        requestFullScreen();

        const handleFullScreenChange = () => {
            if (!document.fullscreenElement) {
                handleFinishTest();
            }
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
        document.addEventListener('mozfullscreenchange', handleFullScreenChange);
        document.addEventListener('MSFullscreenChange', handleFullScreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
        };
    }, []);

    useEffect(() => {
        const handleCopyPaste = (event) => {
            event.preventDefault();
        };

        document.addEventListener('copy', handleCopyPaste);
        document.addEventListener('paste', handleCopyPaste);

        return () => {
            document.removeEventListener('copy', handleCopyPaste);
            document.removeEventListener('paste', handleCopyPaste);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key == 'Escape') {
                
                handleFinishTest();
            }
            
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [userAnswers, testId]);

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

   

    return (
        <>
            <div className="relative p-6 bg-gray-900 min-h-screen">
                {/* Merged Test Name and Video Section */}
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-4xl font-bold text-gray-100 quicksand-uniqueName">{test.testName}</h1>
                    <div className="w-1/8 h-1/6 ml-auto">
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            style={{ width: '120px', height: '100px' }}
                            className="object-cover rounded-lg border border-gray-600 shadow-md"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-semibold text-gray-100 mb-4 quicksand-uniqueName">
                            Question {currentQuestionIndex + 1} of {test.questions.length}
                        </h2>
                        <p className="text-gray-300 mb-4 quicksand-uniqueName">{test.questions[currentQuestionIndex].question}</p>
                        <ul className="space-y-3">
                            {test.questions[currentQuestionIndex].options.map((option, index) => (
                                <li key={index} className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        id={`option-${index}`}
                                        name="option"
                                        value={index}
                                        checked={userAnswers[currentQuestionIndex] === index}
                                        onChange={() => handleAnswerSelect(index)}
                                        className="cursor-pointer form-radio text-purple-600 focus:ring-2 focus:ring-purple-500 h-5 w-5"
                                    />
                                    <label
                                        htmlFor={`option-${index}`}
                                        className={`cursor-pointer p-2 rounded-lg transition-colors duration-300 ${userAnswers[currentQuestionIndex] === index
                                            ? 'bg-sky-900 text-gray-100'
                                            : 'hover:bg-sky-600 text-gray-200'
                                            }`}
                                    >
                                        {option}
                                    </label>
                                </li>
                            ))}
                        </ul>

                        <div className="flex justify-between mt-6">
                            <button
                                className="px-4 py-2 bg-teal-500 text-gray-100 rounded hover:bg-teal-600 transition-colors duration-300"
                                onClick={handlePreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </button>
                            <button
                                className="px-4 py-2 bg-indigo-500 text-gray-100 rounded hover:bg-indigo-600 transition-colors duration-300"
                                onClick={handleNextQuestion}
                                disabled={currentQuestionIndex === test.questions.length - 1}
                            >
                                Next
                            </button>
                        </div>

                        <button
                            className="w-full px-4 py-3 bg-emerald-600 text-gray-100 rounded mt-6 hover:bg-emerald-700 transition-colors duration-300"
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
