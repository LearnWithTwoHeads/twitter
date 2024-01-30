import { createContext, useContext, useState } from "react";

const TweetContext = createContext(null);

export const TweetProvider = ({ children }) => {
  const [shouldRerender, setShouldRerender] = useState(false);

  const toggleRerender = () => {
    setShouldRerender((prevState) => !prevState);
  };

  return (
    <TweetContext.Provider value={{ shouldRerender, toggleRerender }}>
      {children}
    </TweetContext.Provider>
  );
};

export const useTweetContext = () => {
  return useContext(TweetContext);
};
