const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')
const colorToggle = document.getElementById('colorToggle');
const plotDiv = document.getElementById('plot');

let points = [];
let isPointsColored = false;

btn.addEventListener('click', async () => {
  const result = await window.electronAPI.openFile()
  if(result.canceled) {
    filePathElement.textContent = 'Nie wybrano pliku.';
    return;
  }
  else{
    filePathElement.innerText = result.filePath
    points = txtToPoints(result.content);
    drawPlot(points, isPointsColored);
  }
  
})

colorToggle.addEventListener('click', () => {
  if(!points.length) 
  {
    return;
  }
  else{
    isPointsColored = !isPointsColored;
    drawPlot(points, isPointsColored);
  }
  
});

function txtToPoints(content) {
  const lines = content.trim().split(/\r?\n/);
  const pts = [];

  for (const line of lines) {
    const [x, y, z] = line.trim().split(/\s+/).map(Number);
    pts.push({ x, y, z });
  }
  return pts;
}



function drawPlot(points, isPointsColored) {
  const x = points.map(p => p.x);
  const y = points.map(p => p.y);
  const z = points.map(p => p.z);

  const colors = isPointsColored
    ? z.map(v => (v < -1 ? 'red' : v < 0.5 ? 'orange' : 'green'))
    : new Array(z.length).fill('gray');

  const trace = {
    x, y, z,
    mode: 'markers',
    type: 'scatter3d',
    marker: {
      size: 1,
      color: colors,
    }
  };

  const layout = {
    title: isPointsColored ? 'Coloured Points' : 'Gray Points',
    scene: {
      xaxis: { title: 'X' },
      yaxis: { title: 'Y' },
      zaxis: { title: 'Z' }
    }
  };

  const config = { responsive: true };

  Plotly.newPlot(plotDiv, [trace], layout, config);
}


