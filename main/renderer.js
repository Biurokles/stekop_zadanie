const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')
const fileContent = document.getElementById('fileContent');

btn.addEventListener('click', async () => {
  const result = await window.electronAPI.openFile()

    if (result.canceled) {
    fileContent.textContent = 'Nie wybrano pliku.';

    return;
  }
  else{
    filePathElement.innerText = result.filePath
    fileContent.textContent = `\n${result.content}`;
  }
  
})