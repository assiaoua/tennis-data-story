    var svg = d3.select("svg").attr("id", "mainSvg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        color = d3.scaleOrdinal(d3.schemeCategory10);


    /////// SLIDER YEAR ///////
    
    var L = 10;
    var slider_size = 0.65*width;
    var left_margin = 0.4*(width - slider_size);

    var x = d3.scaleLinear()
        .domain([0,10])
        .range([left_margin, slider_size + left_margin])
        .clamp(true);

    var slider = svg.append("g")
        .attr("transform", "translate(15,"+(height-50)+")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
       .attr("x2", x.range()[1])
       .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
       .attr("class", "track-inset")
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() { return hue(x.invert(d3.event.x)); }));

    var years = d3.range(2007,2023,1)
    var dx = L/(years.length-1)
    var xticks = d3.range(0,L+dx,dx)

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 25 + ")")
      .selectAll("text")
      .data(xticks)
      .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(function(d,i) { 
          if (years[i] != '2007') {return years[i]}
          else {return 'All'} });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 11)
        .attr("cx", x.range()[0]); //initial position to zero

    function hue(h) {
      handle.attr("cx", x(h));
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function click(d) {
        delete d.fx;
        delete d.fy;
        simulation.alpha(1).restart();
      }


    /////// SLIDER WRank ////////

    var minWRank = 1;
    var maxWRank = 600;

    $( function() {
        $( "#slider-range-Wrank" ).slider({
          range: true,
          min: 1,
          max: 600,
          values: [ 1, 100 ],
          slide: function( event, ui ) {
            $( "#amount-Wrank" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
            minWRank = ui.values[ 0 ];
            maxWRank = ui.values[ 1 ];
          }
        });
        $( "#amount-Wrank" ).val($( "#slider-range-Wrank" ).slider( "values", 0 ) +
          " - " + $( "#slider-range-Wrank" ).slider( "values", 1 ) );
      } );

      var d = document.getElementById('WRank');
      d.style.position = "absolute";
      d.style.left = 225+'px';
      d.style.top = 688+'px';
      d.style.width=980+'px';


    /////// SLIDER SIZE NODES AND LINKS ////////

    var minRadius = 15; //max radius of circle
    var maxRadius = 100; //min radius of circle

    $( function() {
      $( "#slider-range-NodeSize" ).slider({
        orientation: "vertical",
        range: true,
        min: 1,
        max: 100,
        values: [ 15, 100 ],
        slide: function( event, ui ) {
          $( "#amount-NodeSize" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
          minRadius = ui.values[ 0 ];
          maxRadius = ui.values[ 1 ];
        }
      });
      $( "#amount-NodeSize" ).val( $( "#slider-range-NodeSize" ).slider( "values", 0 ) +
        " - " + $( "#slider-range-NodeSize" ).slider( "values", 1 ) );
    } );

    var d = document.getElementById('NodeSize');
    d.style.position = "absolute";
    d.style.left = 1500+'px';
    d.style.top = 480+'px';


    var minLinkwidth = 3; //min width of link
    var maxLinkwidth = 20; //max width of link

    $( function() {
      $( "#slider-range-EdgeSize" ).slider({
        orientation: "vertical",
        range: true,
        min: 0,
        max: 100,
        values: [ 3, 20 ],
        slide: function( event, ui ) {
          $( "#amount-EdgeSize" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
          minLinkwidth = ui.values[ 0 ];
          maxLinkwidth = ui.values[ 1 ];
        }
      });
      $( "#amount-EdgeSize" ).val( $( "#slider-range-EdgeSize" ).slider( "values", 0 ) +
        " - " + $( "#slider-range-EdgeSize" ).slider( "values", 1 ) );
    } );

    var d = document.getElementById('EdgeSize');
    d.style.position = "absolute";
    d.style.left = 1580+'px';
    d.style.top = 480+'px';


    /////// GRAPH ////////

    d3.json("graph.json", function(error, graph) {
       if (error) throw error;

       // User-defined parameters
       var maxDistance = 200, //max distance between two nodes
           minDistance = 10 //min distance betwween two nodes

       var [maxConnect, maxFraction] = getnetworkProp(graph);

       var nodes = graph.nodes,
         nodeById = d3.map(nodes, function(d) { return d.id; }),
         links = graph.links,
         value = links.map(function(d){return d.value}),

       l = []
       links.forEach(function(link) {
           var s = nodeById.get(link.source),
               t = nodeById.get(link.target),
               v = link.value,
               y = link.year,
               atp = link.ATP,
               loc = link.Location,
               tourn = link.Tournament,
               ser = link.Series,
               crt = link.Court,
               surf = link.Surface,
               rnd = link.Round,
               wr = link.WRank,
               lr = link.LRank,
               wp = link.WPts,
               lp = link.LPts,
               w1 = link.W1,
               l1 = link.L1,
               w2 = link.W2,
               l2 = link.L2,
               w3 = link.W3,
               l3 = link.L3,
               w4 = link.W4,
               l4 = link.L4,
               w5 = link.W5,
               l5 = link.L5,
               wset = link.Wsets,
               lset = link.Lsets,
               com = link.Comment,
               pariw = link.B365W,
               paril = link.B365L,
               listyears = link.Year,
               win = link.Winner;

           l.push({source: s, target: t, year: y, value:v, ATP:atp, Location:loc, Tournament:tourn, Series:ser, Court:crt, Surface:surf, Round:rnd, WRank:wr, LRank:lr, WPts:wp, LPts:lp, W1:w1, L1:l1, W2:w2, L2:l2, W3:w3, L3:l3, W4:w4, L4:l4, W5:w5, L5:l5, Wsets:wset, Lsets:lset, Comment:com, B365W:pariw, B365L:paril, Year:listyears, Winner:win});
         });

       links = l

       simulation = d3.forceSimulation(nodes)

       simulation.force("charge", d3.forceManyBody().strength(-10))
           .force("link", d3.forceLink(links))
           .on("tick", ticked);

       var g = svg.append("g")//.attr("transform", "translate(" + width / 2 + "," + 0.45 * height + ")"),
           link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link"),
           node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");

       restart();

       d3.interval(function() {
           restart();
       },150)


       function restart() {

         var current_year = years[Math.round(x.invert(jQuery(".handle").attr("cx"))/dx)];
         // Get "radius" of each node for current_year
         var fraction = graph.nodes.map(function(d) {return d.fraction}).map(function(d) {return d[current_year.toString()];})

         // Apply the general update pattern to the nodes
         node = node.data(nodes, function(d) { return d.id;});
         node.exit().remove();
         node = node.enter().append("image")
                   .attr("class","node")
                   .attr("xlink:href", function(d){ return d.img; })
                   .merge(node)
                   .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged))
                        .on("click", click);
         
         // Append text to the node when mouse on it
         node.append("title")
             .text(function(d) { return d.id.concat(' (', d.flag, ') \n', 'year_pro: ', d.year_pro, '\n', 'weight: ', d.weight, ' kg \n', 'height: ', d.height, ' cm \n', d.hand); });

         // Apply transition to radii of nodes
         node.transition()
             .duration(10)
                .attr("width",function(d) {return Math.max(minRadius,d.fraction[current_year.toString()]/maxFraction * maxRadius);})
                .attr("height",function(d) {return Math.max(minRadius,d.fraction[current_year.toString()]/maxFraction * maxRadius);})
                .attr("transform", function(d) { 
                      var moveDX=d.x-Math.max(minRadius,d.fraction[current_year.toString()]/maxFraction * maxRadius)/2.0;   
                      var moveDY=d.y-Math.max(minRadius,d.fraction[current_year.toString()]/maxFraction * maxRadius)/2.0; 
                      return "translate(" + moveDX + "," + moveDY + ")"; })

         // Apply the general update pattern to the links
         links_filtered = links.filter(function(d) {return (d.year==current_year && Math.max(...d.WRank) <= maxWRank && Math.min(...d.WRank) >= minWRank);});
         link = link.data(links_filtered, function(d) { return d.source.id + "-" + d.target.id; });
         link.exit().remove();
         link = link.enter()
             .append("line")
             .attr("class", "link")
             .merge(link);

        // Filter node without link

        d3.selection.prototype.moveToSvgFront = function() {
          return this.each(function(){
            d3.select("#mainSvg").node().appendChild(this);
         });
        };

        node.attr("weightnode", function(d) {
            d.weightnode = links_filtered.filter(function(l) {return l.source.index == d.index || l.target.index == d.index}).length;
             if (d.weightnode == 0) {d3.select(this).style("opacity", 0).lower();}
             else {d3.select(this).style("opacity", 1).moveToSvgFront();}
         });

        // Define transition to width of edges
        link.transition()
          .duration(10)
          .attr("stroke-width", function(d,i) { return  Math.max(minLinkwidth,d.value/maxConnect * maxLinkwidth);})

         
        // Add information about link when we click on it
         
        link.on('click',function(mylink){

          var divComparison = document.getElementById("PlayersComparison");
          divComparison.innerHTML = "";

          d3.select('svg').append('svg:image')
          .attr('xlink:href', 'img/dessin_balle-tennis.png')
          .attr("width", 160)
          .attr("height", 160)
          .attr('x', '0px')
          .attr('y', '540px');

          d3.select('#PlayersComparison').append('svg')
            .attr("width", 500)
            .attr("height", 200)
            .attr("transform","translate(30,0)");
        
          d3.select('#PlayersComparison').select('svg').append('svg:image')
            .attr('xlink:href', mylink.source.img)
            .attr("width", 160)
            .attr("height", 160)
            .attr('x', '0px');
        
          d3.select('#PlayersComparison').select('svg').append('svg:image')
            .attr('xlink:href', mylink.target.img)
            .attr("width", 160)
            .attr("height", 160)
            .attr('x', '325px');
        
          d3.select('#PlayersComparison').select('svg').append('text')
            .attr("x", 200)
            .attr("y", 100)
            .attr("font-weight", 700)
            .attr("font-family", "sans-serif")
            .attr("font-style", "italic")
           .style("font-size", "60px")
           .text('VS');

          d3.select('#PlayersComparison').append('svg')
            .attr("width", 300)
            .attr("height", 200)
            .style("float", "left");

          d3.select('#PlayersComparison').append('svg')
            .attr("width", 920)
            .attr("height", 200)
            .style("float", "right");
        
          d3.select('#PlayersComparison').append('text')
            .attr("x", 70)
            .attr("y", 100)
            .attr("font-family", "sans-serif")
            .style("font-size", "20px")
            .style("float", "left")
            .html('<br />' + mylink.source.id + ' (' + mylink.source.flag + ') <br />' + 'year_pro: ' + mylink.source.year_pro + '<br />' + 'weight: ' + mylink.source.weight + ' kg <br />' + 'height: ' + mylink.source.height + ' cm <br />' + mylink.source.hand);
        
          d3.select('#PlayersComparison').append('text')
            .attr("x", 750)
            .attr("y", 100)
            .attr("font-family", "sans-serif")
            .style("font-size", "20px")
            .style("float", "right")
            .html('<br />' + mylink.target.id + ' (' + mylink.target.flag + ') <br />' + 'year_pro: ' + mylink.target.year_pro + '<br />' + 'weight: ' + mylink.target.weight + ' kg <br />' + 'height: ' + mylink.target.height + ' cm <br />' + mylink.target.hand);
          
        const matrixinfo = [mylink.Year, mylink.Winner, mylink.ATP, mylink.Location, mylink.Tournament, mylink.Series, mylink.Court, mylink.Surface, mylink.Round, mylink.WRank, mylink.LRank, mylink.WPts, mylink.LPts, mylink.W1, mylink.L1, mylink.W2, mylink.L2, mylink.W3, mylink.L3, mylink.W4, mylink.L4, mylink.W5, mylink.L5, mylink.Wsets, mylink.Lsets, mylink.Comment, mylink.B365W, mylink.B365L];
        const transpose = matrix => matrix.reduce((prev, next) => next.map((item, i) => (prev[i] || []).concat(next[i])), []);
        const transposeinfo = transpose(matrixinfo);

        d3.select('#PlayersComparison').append('table')
          .attr('id','datatableplayers')
          .attr('class', 'display')
          .attr('width', '100%');

        $(document).ready(function() {
          $('#datatableplayers').DataTable( {
              data: transposeinfo,
              columns: [
                  { title: "Year" },
                  { title: "Winner" },
                  { title: "ATP" },
                  { title: "Location" },
                  { title: "Tournament" },
                  { title: "Series" },
                  { title: "Court" },
                  { title: "Surface" },
                  { title: "Round" },
                  { title: "WRank" },
                  { title: "LRank" },
                  { title: "WPts" },
                  { title: "LPts" },
                  { title: "W1" },
                  { title: "L1" },
                  { title: "W2" },
                  { title: "L2" },
                  { title: "W3" },
                  { title: "L3" },
                  { title: "W4" },
                  { title: "L4" },
                  { title: "W5" },
                  { title: "L5" },
                  { title: "Wsets" },
                  { title: "Lsets" },
                  { title: "Comment" },
                  { title: "B365W" },
                  { title: "B365L" },
                ]
            } );
        } );

            })


         // Update and restart the simulation
         simulation.nodes(nodes).force("charge", d3.forceManyBody().strength(-6)).force("center", d3.forceCenter(width/2, 0.45*height));
         simulation.force("link").links(links)
         simulation.force("link", d3.forceLink(links)
                        .distance(function(d) {
                           if(d.year==current_year){
                               return Math.min(maxConnect/d.value * minDistance,maxDistance);
                           }
                           else{
                               return maxDistance;
                           }})
                          )

         simulation.alpha(0.4).restart();
       }

       // This function defines position of nodes and links
       // at each "simulation time step"
       function ticked() {
         node.attr("cx", function(d) { return d.x; })
             .attr("cy", function(d) { return d.y; })

         link.attr("x1", function(d) { return d.source.x; })
             .attr("y1", function(d) { return d.source.y; })
             .attr("x2", function(d) { return d.target.x; })
             .attr("y2", function(d) { return d.target.y; });
       }


    })

    // This function calculates properties of network
    // (i.e., max connection between nodes, max fraction value of node)
    function getnetworkProp(graph){
       //1) max connection between nodes
       var maxConnect = Math.max.apply(Math,graph.links.map(function(d) {return d.value;}));   //max connection between nodes
       //2) max fraction value (used to draw nodes radii)
       var maxFraction = 0;
       var arr, obj, maxf;
       for (i=0;i<graph.nodes.length;i++){
           obj = graph.nodes[i].fraction
           arr = Object.keys( obj ).map(function (key) { return obj[key]; });
           maxf = Math.max.apply( null, arr );
           maxFraction = Math.max(maxFraction,maxf);
       }
       return [maxConnect, maxFraction];
    }