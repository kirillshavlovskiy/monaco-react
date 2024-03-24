import React from 'react';

import ContentLoader from 'sections/Structure';
import { asyncComponentLoader } from 'utils';

const ContentSection = asyncComponentLoader(ContentLoader);

const Structure = _ => <div>
  <ContentSection />
</div>;

export default Structure;
