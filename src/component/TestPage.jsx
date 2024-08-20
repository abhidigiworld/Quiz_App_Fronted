import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function TestPage() {
    const { testId } = useParams(); // Get testId from URL parameters
    const [test, setTest] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const response = await axios.get(`http://localhost:2523/api/test/${testId}`);
                setTest(response.data);
                setUserAnswers(new Array(response.data.questions.length).fill(null)); // Initialize answers array
            } catch (error) {
                console.error('Error fetching test:', error);
            }
        };

        fetchTest();
    }, [testId]);

    const handleAnswerSelect = (answerIndex) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentQuestionIndex] = answerIndex; // Save the selected answer
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
            const response = await axios.post(`http://localhost:2523/api/submit-test/${testId}`, {
                answers: userAnswers
            });

            // Redirect to results page or display score
            navigate(`/test-result/${testId}`, { state: { score: response.data.score } });
        } catch (error) {
            console.error('Error submitting test:', error);
        }
    };

    if (!test) {
        return <p>Loading test...</p>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{test.testName}</h1>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Question {currentQuestionIndex + 1} of {test.questions.length}
                </h2>
                <p className="text-gray-800 mb-4">{test.questions[currentQuestionIndex].questionText}</p>
                <ul className="space-y-2">
                    {test.questions[currentQuestionIndex].options.map((option, index) => (
                        <li
                            key={index}
                            className={`cursor-pointer p-2 border rounded ${userAnswers[currentQuestionIndex] === index ? 'bg-blue-100' : 'bg-white'
                                }`}
                            onClick={() => handleAnswerSelect(index)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>

                <div className="flex justify-between mt-6">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === test.questions.length - 1}
                    >
                        Next
                    </button>
                </div>

                <button
                    className="px-4 py-2 bg-green-500 text-white rounded mt-6"
                    onClick={handleFinishTest}
                >
                    Finish Test
                </button>
            </div>
        </div>
    );
}

export default TestPage;
