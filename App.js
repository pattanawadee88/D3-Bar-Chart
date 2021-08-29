const w = 1000;
const h = 600;
const padding = 40;
const tooltip = document.getElementById("tooltip");

const svg = d3.select(".container")
          .append("svg")
          .attr("width", w)
          .attr("height", h);


const header = d3.select("svg")
                .append("text")
                .attr("fill","red")
                .attr("id","title")
                .attr("x", 250)
                .attr("y", 60)
                .text("United States GDP");              

const URL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const req = new XMLHttpRequest()
    req.open('GET',URL,true);
    req.send();
    req.onreadystatechange = ()=>{
        if(req.readyState === 4 && req.status === 200){
            const json= JSON.parse(req.responseText);
            const string = JSON.stringify(json)
            const dataset = json.data; // data
          
            createD3(dataset)

            
        }
    }

function createD3(data, y){
   
    let datesArr = data.map( (d)=>{
        return new Date(d[0])
    });
    
    const xScale = d3.scaleLinear()
                     .domain([0,data.length-1 ]) 
                     .range([padding,w-padding]);

    const xYearScale = d3.scaleTime()
                         .domain([d3.min(datesArr),d3.max(datesArr)])
                         .range([padding,w-padding]);

    const yScale = d3.scaleLinear()
                    .domain([0,d3.max(data, d=>d[1]) ])
                    .range([h-padding,padding]);

    const heightScale = d3.scaleLinear()
                    .domain([0,d3.max(data, d=>d[1]) ])
                    .range([0 ,(h-(2*padding))]);
    
    const rect = d3.select("svg").selectAll('rect')
            .data(data)
            .enter()
            .append("rect")
            .attr("class","bar")
            .attr("data-date", d=>{return d[0];})
            .attr("data-gdp", d=>{return d[1]})
            .attr("width", (w-(2*padding)) / data.length)
            .attr("height", d=>{ return heightScale(d[1])})
            .attr("x",(d,i)=> {return xScale(i)})
            .attr("y",(d,i)=>{ return yScale(d[1])})
            .on("mouseover", (d,i)=>{
                tooltip.setAttribute("data-date", d[0])
                tooltip.style.left = (xScale(i))+'px';
                tooltip.style.opacity = 1;
                tooltip.style.top = (yScale(d[1])+60)+'px';
                tooltip.innerHTML = `Year: ${d[0]} </br> $${d[1]} Billion`  
            } )
            .on("mouseout", (d,i)=>{
                tooltip.style.opacity = 0;
            })
            // .attr("height", (d,i)=> {return yScale(d[1])})
    const xAxis = d3.axisBottom(xYearScale);
                    svg.append("g")
                        .attr("id","x-axis")
                        .attr("transform", "translate(0, " + ((h)-padding) + ")")
                        .call(xAxis)
                        .append("text")
                        .attr("x", w-(padding*5))
                        .attr("y", 30)
                        .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf');
            
    const yAxis = d3.axisLeft(yScale);
                    svg.append("g")
                        .attr("id","y-axis")
                        .attr("transform", "translate(" + padding + ",0)")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("x", -100)
                        .attr("y", 20)
                        .text("Gross Domestic Product");
            
}
