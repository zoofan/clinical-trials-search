from flask import Flask, jsonify, request
import json
from datetime import datetime

app = Flask(__name__)

def traverse(obj):
    """
    Generator function to recursively traverse a nested JSON object and yield all string values.
    """
    if isinstance(obj, dict):
        for value in obj.values():
            yield from traverse(value)
    elif isinstance(obj, list):
        for item in obj:
            yield from traverse(item)
    else:
        yield obj

def contains_search_query(trial, query):
    """
    Check if the search query is present in any string field within the trial.
    The search is case-insensitive.
    """
    for value in traverse(trial):
        if isinstance(value, str) and query in value.lower():
            return True
    return False

def parse_date(date_str):
    """
    Attempt to parse a date string into a datetime object.
    Supports multiple date formats.
    Returns datetime.min if parsing fails.
    """
    date_formats = [
        '%B %d, %Y',  # e.g., March 5, 2025
        '%Y-%m-%d',    # e.g., 2025-03-05
        '%Y-%m',       # e.g., 2025-03
        '%Y',          # e.g., 2025
    ]
    for fmt in date_formats:
        try:
            return datetime.strptime(date_str, fmt)
        except (ValueError, TypeError):
            continue
    return datetime.min  # Default date if parsing fails

def get_completion_date(trial):
    """
    Safely extract and parse the completion date from a trial.
    Returns datetime.min if the date is missing or cannot be parsed.
    """
    try:
        date_str = trial['protocolSection']['statusModule']['completionDateStruct']['date']
        return parse_date(date_str)
    except (KeyError, TypeError):
        return datetime.min

@app.route('/api/trials', methods=['GET'])
def get_trials():
    try:
        # Load the trial data from the JSON file
        with open('data/ctg-studies.json', 'r') as file:
            data = json.load(file)

        # Retrieve query parameters
        search_query = request.args.get('q', '').lower()
        status_filter = request.args.get('status', 'ALL').upper()
        sort_order = request.args.get('sort', 'asc').lower()

        # Start with all trials
        filtered_data = data

        # Apply comprehensive search if a search query is provided
        if search_query:
            filtered_data = [
                trial for trial in filtered_data
                if contains_search_query(trial, search_query)
            ]

        # Apply status filtering if the status is not 'ALL'
        if status_filter and status_filter != 'ALL':
            filtered_data = [
                trial for trial in filtered_data
                if status_filter == trial['protocolSection']['statusModule']['overallStatus'].upper().replace(' ', '_')
            ]

        # Sort the filtered trials by completion date
        filtered_data.sort(
            key=get_completion_date,
            reverse=(sort_order == 'desc')
        )

        # Return the top 10 trials after filtering and sorting
        return jsonify(filtered_data[:30]), 200

    except FileNotFoundError:
        return jsonify({'error': 'Data file not found.'}), 500
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format in data file.'}), 500
    except Exception as e:
        # Log the error for debugging purposes
        app.logger.error(f"Error fetching trials: {e}")
        return jsonify({'error': 'An unexpected error occurred.'}), 500

if __name__ == '__main__':
    app.run(debug=True)