import { createContext, useState, useEffect } from 'react';
export const ThemeContext = createContext();


function ThemeProvider({children}) {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
      const savedMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedMode);
      document.body.classList.toggle('dark-mode', savedMode);
    }, []);
  
    const toggleDarkMode = () => {
      const newMode = !darkMode;
      setDarkMode(newMode);
      localStorage.setItem('darkMode', newMode);
      document.body.classList.toggle('dark-mode', newMode);
    };
  return (
<>

<ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>

</>  )
}

export default ThemeProvider