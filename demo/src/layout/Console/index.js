import React from 'react';

import ContentLoader from 'sections/Console';
import { asyncComponentLoader } from 'utils';

const ContentSection = asyncComponentLoader(ContentLoader);

const Content = _ => <div>
  <ContentSection />
</div>;

export default Console;
