import React from 'react';
import Select from 'react-select';
import './Navbar.css';

const Navbar = ({ userLang, setUserLang, userTheme,
    setUserTheme, fontSize, setFontSize }) => {
    const languages = [
        { value: "c", label: "C" },
        { value: "cpp", label: "C++" },
        { value: 'javascript', label: "JavaScript" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
    ];
    const themes = [
        { value: "vs-dark", label: "Dark" },
        { value: "light", label: "Light" },
    ]
    return (
        <div className="navbar">
            <Select options={languages} value={userLang}
                onChange={(e) => { setUserLang(e.value) }}
                placeholder={userLang}
            />
            <Select options={themes} value={userTheme}
                onChange={(e) => setUserTheme(e.value)}
                placeholder={userTheme} />
        </div>
    )
}

export default Navbar
