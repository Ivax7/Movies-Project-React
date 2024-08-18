// src/components/hooks/useNavToggle.js
import { useState } from 'react';

export const useNavToggle = () => {
  const [isTranslated, setIsTranslated] = useState(false);

  const handleToggle = () => {
    setIsTranslated(!isTranslated);
  };

  return {
    isTranslated,
    handleToggle
  };
};
