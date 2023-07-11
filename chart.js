
const svg = d3.select('#chart');

const margin = {top: 20, right: 20, bottom: 30, left: 250};
const width = +svg.attr('width') - margin.left - margin.right;
const height = +svg.attr('height') - margin.top - margin.bottom;

const tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("background", "#f4f4f4")
  .style("padding", "5px")
  .style("border", "1px solid #333")
  .style("border-radius", "5px")
  .style("visibility", "hidden");

const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleBand().range([height, 0]).padding(0.1);
const xAxis = d3.axisTop(x);
const yAxis = d3.axisLeft(y);

const color = d3.scaleLinear()
  .range(["blue", "red"]);  


export function createChart(data, remote_ratio_selections) {
    svg.selectAll("*").remove();

    let aggData = d3.rollups(
        data, 
        v => ({ 
          avgSalary: d3.mean(v, d => +d.salary_in_usd),
          remote: d3.sum(v, d => d.remote_ratio === '100' ? 1 : 0) / v.length,
          hybrid: d3.sum(v, d => d.remote_ratio === '50' ? 1 : 0) / v.length,
          office: d3.sum(v, d => d.remote_ratio === '0' ? 1 : 0) / v.length
        }), 
        d => d.job_title
      ).sort((a, b) => d3.ascending(a[1].avgSalary, b[1].avgSalary));
      
    aggData = aggData.filter(d => {
        const ratios = d[1];
        return (remote_ratio_selections.remote && ratios.remote > 0) || 
               (remote_ratio_selections.hybrid && ratios.hybrid > 0) || 
               (remote_ratio_selections.office && ratios.office > 0);
    });

    let g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
    x.domain([0, d3.max(aggData, d => d[1].avgSalary)]);
    y.domain(aggData.map(d => d[0]));
    color.domain([d3.min(aggData, d => d[1].avgSalary), d3.max(aggData, d => d[1].avgSalary)]);
    
  
    g.append('g')
    .attr('class', 'x axis')
    .style('font-family', 'Roboto')
    .style('font-size', '0.65em')
    .call(xAxis);
  
    g.append('g')
    .attr('class', 'y axis')
    .style('font-family', 'Roboto')
    .style('font-size', '0.65em')
    .call(yAxis);
  
    let tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip') // add class here
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden');

    // Draw bars
    g.selectAll('.bar')
    .data(aggData)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('y', d => y(d[0]))
    .attr('height', y.bandwidth())
    .attr('x', 0)
    .attr('width', d => x(d[1].avgSalary))
    .attr('fill', d => color(d[1].avgSalary))
    .on('mouseover', function(event, d) {
        tooltip.html(`Remote: ${(d[1].remote * 100).toFixed(2)}%<br>Hybrid: ${(d[1].hybrid * 100).toFixed(2)}%<br>Office: ${(d[1].office * 100).toFixed(2)}%`)
        .style('visibility', 'visible')
        .style('top', (event.pageY - 10) + 'px')
        .style('left', (event.pageX + 10) + 'px');
    })
    .on('mouseout', function() {
        tooltip.style('visibility', 'hidden');
    });
}
  
