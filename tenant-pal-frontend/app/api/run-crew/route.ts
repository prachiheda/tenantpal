import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
    try {
        const { renter_issue_description, lease_document } = await request.json();

        // Basic validation
        if (!renter_issue_description || !lease_document) {
            return NextResponse.json({ error: 'Missing required input fields.' }, { status: 400 });
        }

        // --- Determine Paths (Adjust if your structure differs) ---
        // Assuming tenant-pal-frontend and tenant_pal_crew... are sibling dirs
        const backendRootDir = path.resolve(process.cwd(), '..'); // Go up one level from frontend root
        const pythonExecutable = path.join(backendRootDir, '.venv', 'bin', 'python3'); // Path to venv python
        const scriptPath = path.join(backendRootDir, 'src', 'tenant_pal_crew_automation_for_renters_rights', 'main.py');
        const scriptDir = path.dirname(scriptPath);

        // --- Data to send to Python script via stdin ---
        const inputData = JSON.stringify({
            renter_issue_description,
            lease_document
        });

        // --- Execute Python Script --- 
        console.log(`Executing: ${pythonExecutable} ${scriptPath} run in ${scriptDir}`);
        // Run from the script's *project root* directory (backendRootDir) so relative paths like
        // .env and ./knowledge work correctly within the python script
        const pythonProcess = spawn(pythonExecutable, [scriptPath, 'run'], { cwd: backendRootDir }); 

        let scriptOutput = '';
        let scriptError = '';

        // Send input data to stdin
        pythonProcess.stdin.write(inputData);
        pythonProcess.stdin.end();

        // Capture stdout
        pythonProcess.stdout.on('data', (data) => {
            scriptOutput += data.toString();
            // Optional: Log chunks for debugging complex output
            // console.log("Python stdout chunk:", data.toString());
        });

        // Capture stderr
        pythonProcess.stderr.on('data', (data) => {
            scriptError += data.toString();
            console.error("Python stderr:", data.toString()); // Log python errors/debug messages
        });

        // --- Handle Process Completion --- 
        const exitCode = await new Promise<number | null>((resolve) => {
            pythonProcess.on('close', (code) => {
                resolve(code);
            });
             pythonProcess.on('error', (err) => {
                console.error('Failed to start subprocess.', err);
                scriptError += `Failed to start subprocess: ${err.message}`;
                resolve(null); // Indicate failure
            });
        });

        console.log(`Python script exited with code ${exitCode}`);
        console.log(`Raw script output (stdout):\n${scriptOutput}`); // Log full raw output

        if (exitCode !== 0 || !scriptOutput) {
            console.error(`Python script error or no output. Exit code: ${exitCode}. Stderr: ${scriptError}`);
            const detail = scriptError || "Python script failed without specific error message.";
            return NextResponse.json({ error: 'Failed to run analysis.', details: detail }, { status: 500 });
        }

        // --- Parse and Return Output --- 
        // Re-enabled parsing/sanitization
        
        let jsonString = ""; // Declare outside try block
        try {
            // Sanitize the output: Trim whitespace and extract content up to the last '}'
            const trimmedOutput = scriptOutput.trim();
            const lastBraceIndex = trimmedOutput.lastIndexOf('}');
            
            if (lastBraceIndex === -1) {
                throw new Error("Could not find closing brace in script output.");
            }

            jsonString = trimmedOutput.substring(0, lastBraceIndex + 1); // Assign inside
            
            // Attempt to parse the extracted JSON string
            const result = JSON.parse(jsonString);
            return NextResponse.json(result);
        } catch (parseError) {
            console.error("Failed to parse JSON output after sanitization:", parseError);
            console.error("Original script output:", scriptOutput); // Log original for debugging
            console.error("Sanitized string attempted:", jsonString); // Now accessible
            const errorMessage = parseError instanceof Error ? parseError.message : "Unknown parsing error";
            return NextResponse.json({ 
                error: 'Failed to parse analysis result.', 
                details: `Parse Error: ${errorMessage}`,
                rawOutput: scriptOutput // Still send raw output in case of error
            }, { status: 500 });
        }
        
       // return NextResponse.json({ rawOutput: scriptOutput }); // DEBUG CODE REMOVED

    } catch (error) {
        console.error("API route error:", error);
        return NextResponse.json({ error: 'An internal server error occurred.', details: (error as Error).message }, { status: 500 });
    }
} 