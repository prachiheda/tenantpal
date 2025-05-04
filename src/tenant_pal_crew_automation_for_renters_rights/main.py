#!/usr/bin/env python
from dotenv import load_dotenv
import os
import sys
import json
from tenant_pal_crew_automation_for_renters_rights.crew import TenantPalCrewAutomationForRentersRightsCrew

# This main file is intended to be a way for your to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

def run():
    """
    Run the crew.
    """
    load_dotenv()
    try:
        # Read input data from stdin
        input_data = sys.stdin.read()
        inputs = json.loads(input_data)
        print(f"Received inputs: {inputs}", file=sys.stderr) # Log received inputs to stderr for debugging

        # Validate inputs (simple check)
        if 'renter_issue_description' not in inputs or 'lease_document' not in inputs:
            print("Error: Missing required fields in input JSON.", file=sys.stderr)
            sys.exit(1)

        # Run the crew
        crew_output = TenantPalCrewAutomationForRentersRightsCrew().crew().kickoff(inputs=inputs)

        # Print the final JSON result (which should be the last task's raw output)
        # to stdout. The API route expects ONLY the JSON here.
        print(crew_output.raw)

    except json.JSONDecodeError:
        print("Error: Invalid JSON received on stdin.", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error during crew execution: {e}", file=sys.stderr)
        sys.exit(1)

def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        'renter_issue_description': 'sample_value',
        'lease_document': 'sample_value'
    }
    try:
        TenantPalCrewAutomationForRentersRightsCrew().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        TenantPalCrewAutomationForRentersRightsCrew().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        'renter_issue_description': 'sample_value',
        'lease_document': 'sample_value'
    }
    try:
        TenantPalCrewAutomationForRentersRightsCrew().crew().test(n_iterations=int(sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")

if __name__ == "__main__":
    # Check if 'run' argument is provided
    if len(sys.argv) > 1 and sys.argv[1] == 'run':
         run()
    else:
         print("Usage: python main.py run", file=sys.stderr)
