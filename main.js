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

    title.text(`${GetCurrentYear()} Salary Trends`);

    if (GetCurrentYear() === 2020) {
      message.text("Message for 2020 Message Message  Message  Message  Message  Message  Message  Message  Message  Message  Message");
    } else if (GetCurrentYear() === 2021) {
      message.text("Message for 2021 Message Message  Message  Message  Message  Message  Message  Message  Message  Message  Message");
    } else if (GetCurrentYear() === 2022) {
      message.text("Message for 2022 Message Message  Message  Message  Message  Message  Message  Message  Message  Message  Message");
    } else if (GetCurrentYear() === 2023) {
      message.text("Message for 2023 Message Message  Message  Message  Message  Message  Message  Message  Message  Message  Message");
    }
  }
});
