export async function onRunClick(): Promise<void> {
    const testModeCheckboxChecked = (document.getElementById('testMode') as HTMLInputElement).checked;
    const selectedPuzzle = (document.getElementById('puzzles') as HTMLSelectElement).value;

    let filePath = '../src/' + selectedPuzzle + '/input/' + (testModeCheckboxChecked ? 'test.txt' : 'input.txt');
    const file = await fetch(filePath).then(res => res.text()).catch(() => null);
    if(!file) return Promise.reject();

    const output = document.getElementById('output');
    if(!output) return Promise.reject();

    const puzzleModule = await import('../dist/'+ selectedPuzzle +'/' + selectedPuzzle + '.js');
    output.textContent = await puzzleModule.solve(file.split("\r\n"));
}

document.addEventListener('DOMContentLoaded', () => {
    const runBtn = document.getElementById('buttonRun') as HTMLButtonElement | null;
    runBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        onRunClick();
    });
});