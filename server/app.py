from config import *

from flask import request, jsonify
from models import db,Tool, Category
from config import app
from pulp import *
import pulp
from itertools import chain, repeat
from scipy.optimize import minimize
import numpy as np
from collections import defaultdict
from datetime import datetime
from flask_cors import CORS

from routes.routes import *


@app.route('/tools_details', methods=['GET'])
def get_tools_details():
    tools = Tool.query.all()

    return jsonify([tool.to_dict() for tool in tools]), 200

@app.route('/add_tool', methods=['POST'])
def add_tool():
    data = request.get_json()
    app.logger.info(f'Received data for new tool: {data}')

    # Handling Category
    category_id = data.get('category_id')
    if not category_id:
        return jsonify({'error': 'Category ID is required'}), 400

    category = Category.query.get(category_id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    # Creating or updating the tool
    new_tool = Tool(
        name=data.get('name'),
        serial=data.get('serial'),
        model=data.get('model'),
        description=data.get('description'),
        category_id=category_id
    )

    db.session.add(new_tool)
    db.session.commit()

    return jsonify(new_tool.to_dict()), 200

        

@app.route('/update_tool/<int:tool_id>', methods=['PATCH'])
def update_tool(tool_id):
    data = request.get_json()

    # Retrieve the tool to be updated
    tool = Tool.query.get(tool_id)
    if not tool:
        return jsonify({'error': 'Tool not found'}), 404

    # Update basic tool details if provided
    if 'name' in data:
        tool.name = data['name']

    if 'serial' in data:
        tool.serial = data['serial']

    if 'description' in data:
        tool.description = data['description']

    if 'model' in data:
        tool.model = data['model']

    if 'status' in data:
        tool.status = data['status']

    if 'category_id' in data:
        tool.category_id = data['category_id']

    db.session.commit()

    return jsonify(tool.to_dict()), 200


@app.route('/tool_metrics/<int:tool_id>', methods=['DELETE'])
def delete_tool(tool_id):
    # Get the session
    session = db.session
    
    # Get the tool with the new session.get method
    tool = session.get(Tool, tool_id)
    if tool:
        
        session.delete(tool)
        session.commit()
        return jsonify({'message': 'tool deleted successfully'})
    else:
        return jsonify({'error': 'tool not found'}), 404
    

@app.route('/add_category', methods=['POST'])
def add_category():
    data = request.get_json()
    app.logger.info(f'Received data for new tool: {data}')

    # # Handling Category
    # category_id = data.get('category_id')
    # if not category_id:
    #     return jsonify({'error': 'Category ID is required'}), 400

    # category = Category.query.get(category_id)
    # if not category:
    #     return jsonify({'error': 'Category not found'}), 404

    # Creating or updating the tool
    new_category = Category(
        name=data.get('name'),
    )

    db.session.add(new_category)
    db.session.commit()

    return jsonify(new_category.to_dict()), 200


@app.route('/get_categories', methods=['GET'])
def fetch_categories():
    categories = Category.query.all()

    return jsonify([category.to_dict() for category in categories]), 200


if __name__=='__main__':
    app.run(port=5555,debug=True)