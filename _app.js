// pages/_app.js

import '../styles/globals.css';
import Layout from '../components/Layout';
import CustomCursor from '../components/CustomCursor';

function MyApp({ Component, pageProps, router }) {
  return (
    <>
      <CustomCursor />
      <Layout>
        <Component {...pageProps} key={router.route} />
      </Layout>
    </>
  );
}

export default MyApp;
