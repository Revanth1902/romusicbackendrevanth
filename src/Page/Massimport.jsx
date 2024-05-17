import React, { useState, useEffect } from "react";

const GoogleProductTaxonomy = () => {
  const [taxonomyData, setTaxonomyData] = useState(null);

  useEffect(() => {
    const fetchTaxonomyData = async () => {
      try {
        const response = await fetch('/taxonomy.en-US.txt');
        const textData = await response.text();
        const parsedData = parseTaxonomyData(textData);
        setTaxonomyData(parsedData);
      } catch (error) {
        console.error('Error fetching taxonomy data:', error);
      }
    };
      
    fetchTaxonomyData();
  }, []);

  const parseTaxonomyData = (taxonomyText) => {
    const categories = {};

    taxonomyText.split("\n").forEach((line) => {
      const parts = line.split(" > ");
      const category = parts[0];
      const subcategory = parts[1];

      if (!categories[category]) {
        categories[category] = [];
      }
      
      if (subcategory && !categories[category].includes(subcategory)) {
        categories[category].push(subcategory);
      }
    });

    return categories;
  };

  return (
    <div>
      <h1>Google Product Taxonomy</h1>
      <pre>{JSON.stringify(taxonomyData, null, 2)}</pre>
    </div>
  );
};

export default GoogleProductTaxonomy;
