import React from 'react';

import Header from './Header';
import Content from './Content';

//import Structure from './Structure';
import { CustomThemeProvider } from 'theme';

const Layout = _ => <CustomThemeProvider>
  <section className="full-size">
    <Header />
    <Content />

  </section>
</CustomThemeProvider>;

export default Layout;
