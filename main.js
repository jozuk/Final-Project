import { createChart } from './chart.js';

const title = d3.select('#title');
const baseYear = 2020;
const prevButton = d3.select('#prev');
const nextButton = d3.select('#next');
const message = d3.select('#message');

let currentSlide = 0;
let remote_ratio_selections = {
  remote: true,
  hybrid: true,
  office: true
};

function updateButtons() {
  prevButton.attr('disabled', currentSlide === 0 ? true : null);
  nextButton.attr('disabled', currentSlide === 3 ? true : null); // 2020, 2021, 2022, 2023
}

function GetCurrentYear() {
  return baseYear + currentSlide;
}


d3.csv('ds_salaries.csv').then(data => {
  updateSlide();

  prevButton.on('click', () => {
    --currentSlide;
    updateSlide();
  });

  nextButton.on('click', () => {
    ++currentSlide;
    updateSlide();
  });

  d3.select('#remote').on('change', function() {
    remote_ratio_selections.remote = this.checked;
    updateSlide();
  });
  
  d3.select('#hybrid').on('change', function() {
    remote_ratio_selections.hybrid = this.checked;
    updateSlide();
  });
  
  d3.select('#office').on('change', function() {
    remote_ratio_selections.office = this.checked;
    updateSlide();
  });

  function updateSlide() {
    updateButtons();
    createChart(data.filter(row => +row.work_year === GetCurrentYear()), remote_ratio_selections);

    title.text(`Data Science Salary Trends in ${GetCurrentYear()}`);

    if (GetCurrentYear() === 2020) {
      message.text(
        "In 2020, with a diversity of 23 job titles, the average salary stood at $92.3K with a considerable standard deviation of $82.3K. The year was marked by a high average remote ratio of 65%, reflecting the swift shift to remote work due to the COVID-19 pandemic.");
    } else if (GetCurrentYear() === 2021) {
      message.text(
        "2021 saw a significant expansion in the job market, with the emergence of 45 different job titles. The average salary rose slightly to $94K, while the standard deviation in salary reduced to $68.6K. The average remote ratio remained high at 68%, as the effects of the pandemic persisted.");
    } else if (GetCurrentYear() === 2022) {
      message.text(
        "By 2022, there was an explosive growth in the data science field, with 67 job titles and a substantial increase in the average salary to $133K. The standard deviation in salary shrunk further to $58.9K, indicating a consolidation of the pay scale. Interestingly, the average remote ratio dipped to 55%, a possible indication of the easing of pandemic restrictions.");
    } else if (GetCurrentYear() === 2023) {
      message.text(
        "In 2023, the variety of job titles plateaued at 65, but the average salary continued its upward trend to reach $149K. The standard deviation in salary showed a slight increase to $61.3K. The most notable shift was the significant drop in the average remote ratio to 34%, suggesting a major shift back to in-office work as the world adapted to the post-pandemic era.");
    }
  }
});
