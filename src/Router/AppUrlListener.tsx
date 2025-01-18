import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App, URLOpenListenerEvent } from '@capacitor/app';

let slugify = (url: string | URL) => new URL(url).pathname.match(/[^\/]+/g)

const AppUrlListener: React.FC<any> = () => {
  let navigate = useNavigate();
  useEffect(() => {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      const slug = slugify(event.url);
      if (slug) {
        navigate(slug.join('/'));
      }
    });
  }, []);

  return null;
};

export default AppUrlListener;
