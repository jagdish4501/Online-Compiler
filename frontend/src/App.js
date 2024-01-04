import { useState, useRef } from 'react';
import './App.css';
import Editor from "@monaco-editor/react";
import Navbar from './Navbar.js';
import Axios from 'axios';
import spinner from './logo.svg';

function App() {
  const [userLang, setUserLang] = useState("javascript");
  const [userTheme, setUserTheme] = useState("vs-dark");
  const [userOutput, setUserOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const code = useRef({
    'c': '',
    'cpp': '',
    'javascript': '',
    'python': '',
    'java': '',
    'input': '',
  })

  // Function to call the compile endpoint
  const compile = async () => {
    setLoading(true);
    try {
      if (code.current[userLang] === '') {
        setLoading(false);
        return;
      }
      const res = await Axios.post('http://127.0.0.1:5000/compile', {
        code: code.current[userLang],
        language: userLang,
        input: code.current['input']
      });
      if (typeof res.data.message === 'string')
        setUserOutput(res.data.message);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleCodeChange = (value) => {
    code.current[userLang] = value;
  }
  // Function to clear the output screen
  function clearOutput() {
    setUserOutput("");
  }

  return (
    <div className="App">
      <Navbar
        userLang={userLang} setUserLang={setUserLang}
        userTheme={userTheme} setUserTheme={setUserTheme}
      />
      <div className="main">
        <div className="left-container">
          <Editor
            options={{ fontSize: 16 }}
            height="calc(100vh - 50px)"
            width="100%"
            theme={userTheme}
            language={userLang}
            defaultValue='//java public className must be Temp '
            onChange={handleCodeChange}
          />
          <button className="run-btn" onClick={compile}>Run</button>
        </div>
        <div className="right-container">
          <h3>STD Input</h3>
          <div className="input-box">
            <textarea id="code-inp" onChange=
              {(e) => { code.current['input'] = e.target.value }}>
            </textarea>
          </div>
          <h3>STD Output</h3>
          {loading ? (
            <div className="spinner-box">
              <img src={spinner} alt="Loading..." />
            </div>
          ) : (
            <div className="output-box">
              <pre>{userOutput}</pre>
              <button onClick={() => { clearOutput() }}
                className="clear-btn">
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;