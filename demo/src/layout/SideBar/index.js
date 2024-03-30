import React from 'react';

import ContentLoader from 'sections/SideBar';
import { asyncComponentLoader } from 'utils';

const ContentSection = asyncComponentLoader(ContentLoader);

const Console = _ => <div>
  <ContentSection />
</div>;

export default Console;
