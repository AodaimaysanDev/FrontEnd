import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Custom hook to scroll to top of the page
 * Usage: Call useScrollToTop() at the beginning of any component
 * where you want to scroll to top when the component mounts or navigation occurs
 */
const useScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  
  useEffect(() => {
    // Special handling for POP navigation (browser back/forward)
    // Use a longer delay to ensure content is fully loaded before scrolling
    if (navigationType === 'POP') {
      const timeoutId = setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
      }, 100); // Longer delay for browser back/forward navigation
      
      return () => clearTimeout(timeoutId);
    } 
    // For regular navigation (PUSH/REPLACE), scroll immediately
    else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, [pathname, navigationType]);
};

export default useScrollToTop;
