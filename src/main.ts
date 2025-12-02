export async function onRunClick(): Promise<void> {
    const input = document.getElementById('inputFile');
    const file = await (input as HTMLInputElement).files?.[0]?.text();
    if(!file) return Promise.reject();

    const output = document.getElementById('output');
    if(!output) return Promise.reject();

    const selectedPuzzle = (document.getElementById('puzzles') as HTMLSelectElement).value;

    const puzzleModule = await import('./puzzles/' + selectedPuzzle + '.js');
    output.textContent = await puzzleModule.solve(file.split("\r\n"));
}

document.addEventListener('DOMContentLoaded', () => {
    const runBtn = document.getElementById('buttonRun') as HTMLButtonElement | null;
    runBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        onRunClick();
    });
});