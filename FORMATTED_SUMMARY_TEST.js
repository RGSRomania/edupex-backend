// Test file to verify FormattedSummary rendering
import React from 'react';
import FormattedSummary from './frontend/src/components/FormattedSummary';

// Sample summary with markdown-style formatting
const testSummary = `## Textul Literar: 'Prietenul meu' de Ioana Pârvu

### Ce este un text literar?
Textul literar este o **creație artistică** a unui autor care transmite idei, emoții și sentimente într-un limbaj expresiv și plin de imaginație.

### Povestea 'Prietenul meu'
Povestea lui Ioana Pârvu ne prezintă aventura unui **copil pe nume Bogdan** din clasa a V-a. Bogdan se pregătește pentru teze și se gândește cum să-și ilustreze compunerea.

### Caracteristicile principale
**1. Joi - Personajul animalului**
Joi nu este doar orice catel. Este un chihuahua de culoare cafenie, **extrem de mic și delicat**.

**2. Limbajul expresiv**
Ioana Pârvu folosește cuvinte pline de **emoție și imagini evocative**.`;

export const TestFormattedSummary = () => {
  return (
    <div style={{ padding: '40px', background: '#f5f7ff' }}>
      <h2>FormattedSummary Component Test</h2>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        marginTop: '20px'
      }}>
        <FormattedSummary text={testSummary} />
      </div>
      <p style={{ marginTop: '30px', fontSize: '0.9em', color: '#666' }}>
        ✅ The component should:
        <ul>
          <li>Show main headings (##) in blue with bottom border</li>
          <li>Show sub-headings (###) in purple with left border</li>
          <li>Highlight **bold text** with yellow background</li>
          <li>Maintain proper spacing between sections</li>
          <li>Use friendly colors and large fonts for kids</li>
        </ul>
      </p>
    </div>
  );
};

