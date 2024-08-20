import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function SetQuestionPaper() {
    const [testName, setTestName] = useState('');
    const [numQuestions, setNumQuestions] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [expiryTime, setExpiryTime] = useState('');
    const   navigate= useNavigate();

    const handleNumQuestionsChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setNumQuestions(value);
        const newQuestions = Array(value).fill({}).map(() => ({
            question: '',
            options: ['', '', '', ''],
            correctAnswer: ''
        }));
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        if (field === 'question') {
            newQuestions[index].question = value;
        } else if (field.startsWith('option')) {
            const optionIndex = parseInt(field.replace('option', ''), 10);
            newQuestions[index].options[optionIndex] = value;
        } else if (field === 'correctAnswer') {
            newQuestions[index].correctAnswer = value;
        }
        setQuestions(newQuestions);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:2523/api/tests', {
                testName,
                questions,
                expiryTime
            });
            alert('Test saved successfully!');
            navigate('/admin');
            
        } catch (error) {
            console.error('Error saving test:', error);
        }
    };

    return (
       <>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
  <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl">
    <h1 className="text-3xl font-bold text-gray-100 mb-6">Set MCQ Test</h1>

    <div className="mb-4">
      <label className="block text-gray-300">Test Name:</label>
      <input
        type="text"
        value={testName}
        onChange={(e) => setTestName(e.target.value)}
        className="border p-2 w-full rounded bg-gray-700 text-white focus:outline-none focus:border-purple-500"
        required
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-300">Number of Questions:</label>
      <input
        type="number"
        value={numQuestions}
        onChange={handleNumQuestionsChange}
        className="border p-2 w-full rounded bg-gray-700 text-white focus:outline-none focus:border-purple-500"
        required
      />
    </div>

    {questions.map((q, index) => (
      <div key={index} className="mb-4">
        <label className="block text-gray-300">Question {index + 1}:</label>
        <input
          type="text"
          value={q.question}
          onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
          className="border p-2 w-full rounded bg-gray-700 text-white focus:outline-none focus:border-purple-500"
          required
        />
        <label className="block text-gray-300 mt-2">Options:</label>
        {q.options.map((opt, optIndex) => (
          <input
            key={optIndex}
            type="text"
            value={opt}
            onChange={(e) => handleQuestionChange(index, `option${optIndex}`, e.target.value)}
            className="border p-2 w-full rounded bg-gray-700 text-white mt-1 focus:outline-none focus:border-purple-500"
            placeholder={`Option ${optIndex + 1}`}
            required
          />
        ))}
        <label className="block text-gray-300 mt-2">Correct Answer:</label>
        <input
          type="text"
          value={q.correctAnswer}
          onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
          className="border p-2 w-full rounded bg-gray-700 text-white focus:outline-none focus:border-purple-500"
          required
        />
      </div>
    ))}

    <div className="mb-4">
      <label className="block text-gray-300">Expiry Time:</label>
      <input
        type="datetime-local"
        value={expiryTime}
        onChange={(e) => setExpiryTime(e.target.value)}
        className="border p-2 w-full rounded bg-gray-700 text-white focus:outline-none focus:border-purple-500"
        required
      />
    </div>

    <button
      onClick={handleSubmit}
      className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition duration-300"
    >
      Save Test
    </button>
  </div>
</div>

       </>
    );
}

export default SetQuestionPaper;
