# app/routes/user_routes.py
from flask import Blueprint
from app.controllers.summary_controller import create_summary,get_all_summaries,get_summary_by_time_group,generate_summary_report
# Create a blueprint for user-related routes
summary_bp = Blueprint('summary_bp', __name__, url_prefix='/summary')

# Register routes to the blueprint
summary_bp.route('/', methods=['POST'])(create_summary)
summary_bp.route('/', methods=['GET'])(get_all_summaries)
summary_bp.route('/<time_group>', methods=['GET'])(get_summary_by_time_group)
summary_bp.route('/generate-report/<time_group>', methods=['GET'])(generate_summary_report)


