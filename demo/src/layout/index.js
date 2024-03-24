import React from 'react';

import Header from './Header';
import Content from './Content';
import Console from './Console';
import Structure from './Structure';
import { ThemeProvider } from 'theme';

const Layout = _ => <ThemeProvider>
  <section className="full-size">
    <Header />
    <Content />
    <Structure />
    <Console />
  </section>
</ThemeProvider>;

export default Layout;
