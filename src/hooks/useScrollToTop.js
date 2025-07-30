import { useEffect } from 'react';

/**
 * Custom hook to scroll to top of the page
 * Usage: Call useScrollToTop() at the beginning of any component
 * where you want to scroll to top when the component mounts
 */
const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};

export default useScrollToTop;
