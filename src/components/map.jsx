import React, { useState } from 'react';
import WorldMap from 'react-world-map';

export function PrescriptionErrorMap() {
  const [selectedContinent, setSelectedContinent] = useState(null);

  // Data for each continent
  const continentData = {
    na: "North America: 7,000–9,000 deaths yearly due to medication errors (U.S. Institute of Medicine). Poor handwriting is a leading cause.",
    sa: "South America: 5-10% of medication errors stem from illegible prescriptions, likely causing hundreds of deaths yearly.",
    eu: "Europe: 5% of hospital admissions are due to medication errors (EU study). Countries like the UK and Germany use e-prescribing to reduce errors.",
    af: "Africa: Limited data, but handwritten prescriptions contribute to hundreds or thousands of deaths annually.",
    as: "Asia: In India and China, 10-15% of prescription errors are due to poor handwriting, causing thousands of deaths yearly.",
    oc: "Australia/Oceania: Strong e-prescribing systems minimize errors, but rural areas may still face risks.",
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Deaths Due to Poor Handwritten Prescriptions</h2>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <WorldMap 
          selected={selectedContinent} 
          onSelect={setSelectedContinent} 
        />
      </div>
      {selectedContinent && (
        <div style={{ marginTop: '20px', padding: '10px', borderRadius: '5px' }}>
          <h3>{continentData[selectedContinent]}</h3>
        </div>
      )}
    </div>
  );
}

// Render the component (assuming you have a root element)
// ReactDOM.render(<PrescriptionErrorMap />, document.getElementById('root'));