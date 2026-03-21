/**
 * Product Comparison section JavaScript
 * Handles highlighting of matched columns in the comparison table
 */
 
document.addEventListener('DOMContentLoaded', function() {
  // Find all product comparison sections on the page
  const comparisonSections = document.querySelectorAll('.comparison-section');
  
  comparisonSections.forEach(section => {
    if (!section) return;
    
    // Add CSS classes to all cells in the same column as the highlighted header
    const highlightedHeaders = section.querySelectorAll('.product-header.highlighted');
    highlightedHeaders.forEach(header => {
      const columnIndex = header.getAttribute('data-column');
      if (!columnIndex) return;
      
      // Select all cells in the same column
      const columnCells = section.querySelectorAll(`.value-cell[data-column="${columnIndex}"]`);
      columnCells.forEach(cell => {
        cell.classList.add('highlighted');
      });
    });
  });
}); 