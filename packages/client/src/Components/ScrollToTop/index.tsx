import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useEffect } from 'react';

interface ScrollToTopProps extends RouteComponentProps<any> { }

const ScrollToTop: React.FC<ScrollToTopProps> = ({ history }: ScrollToTopProps) => {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    }
  }, []);

  return null;
}

export default withRouter(ScrollToTop);