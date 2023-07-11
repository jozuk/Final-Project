import { createChart } from './chart.js';

let currentSlide = 0;
const slides = d3.selectAll('.slide');
const prevButton = d3.select('#prev');
const nextButton = d3.select('#next');

// Loading CSV data
d3.csv('ds_salaries.csv').then(data => {
  // (same code as before)
});
