import React from 'react';

import Header from './Header';
import Content from './Content';

//import Structure from './Structure';
import { MuiThemeProvider } from 'theme';

const Layout = _ => <MuiThemeProvider>
  <section
      className="full-size"
  >
    <Header />
  </section>
</MuiThemeProvider>;

export default Layout;
