import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Global component to scroll to top on route changes
 * This is different from the hook as it's always active globally
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  
  // Effect to handle scroll restoration
  useEffect(() => {
    // For back navigation, use a delay to ensure content loads first
    if (navigationType === 'POP') {
      const timeoutId = setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'instant'
        });
      }, 100);
      
      return () => clearTimeout(timeoutId);
    } else {
      // For regular navigation, scroll immediately
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }
  }, [pathname, navigationType]);
  
  return null;
};

export default ScrollToTop;
