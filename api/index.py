from flask import Flask, jsonify, request
import json
from datetime import datetime

app = Flask(__name__)

@app.route('/api/trials', methods=['GET'])
def get_trials():
    try:
        with open('data/ctg-studies.json', 'r') as file:
            data = json.load(file)

        search_query = request.args.get('q', '').lower()
        status_filter = request.args.get('status', '').upper()
        sort_order = request.args.get('sort', 'asc').lower()

        filtered_data = data

        # Filter by search query if provided
        if search_query:
            filtered_data = [
                trial for trial in filtered_data
                if search_query in trial['protocolSection']['identificationModule']['briefTitle'].lower()
            ]

        # Filter by status if provided and not 'ALL'
        if status_filter and status_filter != 'ALL':
            filtered_data = [
                trial for trial in filtered_data
                if status_filter in trial['protocolSection']['statusModule']['overallStatus'].upper().replace(' ', '_')
            ]

        # Updated parse_date function
        def parse_date(date_str):
            date_formats = [
                '%B %d, %Y',  # e.g., March 5, 2025
                '%Y-%m-%d',   # e.g., 2025-03-05
                '%Y-%m',      # e.g., 2025-03
                '%Y',         # e.g., 2025
            ]
            for fmt in date_formats:
                try:
                    return datetime.strptime(date_str, fmt)
                except ValueError:
                    continue
            return datetime.min  # Use a default date if parsing fails

        # Define helper function to get completion date safely
        def get_completion_date(trial):
            try:
                date_str = trial['protocolSection']['statusModule']['completionDateStruct']['date']
                return parse_date(date_str)
            except (KeyError, TypeError):
                return datetime.min

        # Sort the filtered data
        filtered_data.sort(
            key=get_completion_date,
            reverse=(sort_order == 'desc')
        )

        return jsonify(filtered_data[:10]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500