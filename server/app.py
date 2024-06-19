from config import *

from flask import Flask, request, jsonify, send_file, send_from_directory
from models import db,Tool, Category, Reservation, TestLine
from config import app
from pulp import *
import pulp
from itertools import chain, repeat
from scipy.optimize import minimize
import numpy as np
from collections import defaultdict
from datetime import datetime
from flask_cors import CORS
from werkzeug.utils import secure_filename

from routes.routes import *

import pandas as pd
from io import BytesIO

@app.route('/api/testlines', methods=['GET'])
def get_testlines():
    testlines = TestLine.query.all()
    return jsonify([testline.to_dict() for testline in testlines]), 200

@app.route('/api/add_testline', methods=['POST'])
def add_testline():
    data = request.get_json()

    new_testline = TestLine(
        name=data.get('name'),
        status=data.get('status', 'available')
    )

    db.session.add(new_testline)
    db.session.commit()

    return jsonify(new_testline.to_dict()), 200


@app.route('/api/reserve_testline', methods=['POST'])
def reserve_testline():
    data = request.get_json()
    user_id = data.get('user_id')
    testline_id = data.get('testline_id')

    user = User.query.get(user_id)
    testline = TestLine.query.get(testline_id)

    if not user or not testline:
        return jsonify({'error': 'User or TestLine not found'}), 404

    # Check if testline is already reserved by the same user
    existing_reservation = Reservation.query.filter_by(user_id=user_id, testline_id=testline_id, end_time=None).first()
    if existing_reservation:
        return jsonify({'error': 'TestLine already reserved by this user'}), 400

    # Check if testline is available
    if testline.status != 'available':
        return jsonify({'error': 'TestLine is not available'}), 400

    # Create a new reservation
    reservation = Reservation(user_id=user_id, testline_id=testline_id)
    testline.status = 'checked out'

    db.session.add(reservation)
    db.session.commit()

    return jsonify(reservation.to_dict()), 200

@app.route('/api/return_testline', methods=['POST'])
def return_testline():
    data = request.get_json()
    user_id = data.get('user_id')
    testline_id = data.get('testline_id')

    reservation = Reservation.query.filter_by(user_id=user_id, testline_id=testline_id, end_time=None).first()
    if not reservation:
        return jsonify({'error': 'Reservation not found'}), 404

    reservation.end_time = datetime.utcnow()
    reservation.testline.status = 'available'

    db.session.commit()

    return jsonify({'message': 'TestLine returned successfully'}), 200

@app.route('/api/tools_details', methods=['GET'])
def get_tools_details():
    tools = Tool.query.all()

    return jsonify([tool.to_dict() for tool in tools]), 200

@app.route('/api/add_tool', methods=['POST'])
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
        serialNumber=data.get('serial'),
        productName=data.get('model'),
        description=data.get('description'),
        status=data.get('status'),
        productId=data.get('productId'),
        siteId=data.get('siteId'),
        storageLocation=data.get('storageLocation'),
        itemOwner=data.get('itemOwner'),
        nokiaSto=data.get('nokiaSto'),
        notes=data.get('notes'),
        category_id=category_id
    )

    db.session.add(new_tool)
    db.session.commit()

    return jsonify(new_tool.to_dict()), 200



        

@app.route('/api/update_tool/<int:tool_id>', methods=['PATCH'])
def update_tool(tool_id):
    data = request.get_json()

    tool = Tool.query.get(tool_id)
    if not tool:
        return jsonify({'error': 'Tool not found'}), 404

    if 'serialNumber' in data:
        tool.serialNumber = data['serialNumber']
    if 'productName' in data:
        tool.productName = data['productName']
    if 'productId' in data:
        tool.productId = data['productId']
    if 'description' in data:
        tool.description = data['description']
    if 'siteId' in data:
        tool.siteId = data['siteId']
    if 'storageLocation' in data:
        tool.storageLocation = data['storageLocation']
    if 'status' in data:
        tool.status = data['status']
    if 'itemOwner' in data:
        tool.itemOwner = data['itemOwner']
    if 'nokiaSto' in data:
        tool.nokiaSto = data['nokiaSto']
    if 'notes' in data:
        tool.notes = data['notes']
    if 'category_id' in data:
        tool.category_id = data['category_id']

    db.session.commit()

    return jsonify(tool.to_dict()), 200


@app.route('/api/tool_metrics/<int:tool_id>', methods=['DELETE'])
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
    

@app.route('/api/add_category', methods=['POST'])
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


@app.route('/api/get_categories', methods=['GET'])
def fetch_categories():
    categories = Category.query.all()

    return jsonify([category.to_dict() for category in categories]), 200


@app.route('/api/export/tools', methods=['GET'])
def export_tools():
    tools = Tool.query.all()
    tools_data = [
        {
            'ID': tool.id,
            'Name': tool.name,
            'Serial Number': tool.serialNumber,
            'Product Name': tool.productName,
            'Product ID': tool.productId,
            'Description': tool.description,
            'Site ID': tool.siteId,
            'Storage Location': tool.storageLocation,
            'Status': tool.status,
            'Item Owner': tool.itemOwner,
            'Nokia STO': tool.nokiaSto,
            'Notes': tool.notes,
            'Category ID': tool.category_id,
            'Category': tool.category.name if tool.category else None
        }
        for tool in tools
    ]
    df = pd.DataFrame(tools_data)
    excel_file = BytesIO()
    with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Tools')
    excel_file.seek(0)
    return send_file(
        excel_file,
        as_attachment=True,
        download_name='tools_export.xlsx',
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )


@app.route('/api/import/tools', methods=['POST'])
def import_tools():
    if 'file' not in request.files:
        app.logger.error("No file part in the request")
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        app.logger.error("No selected file")
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        try:
            # Read the Excel file
            df = pd.read_excel(file_path)
            app.logger.info(f"Read {len(df)} rows from the Excel file")

            # Check required columns
            required_columns = ['Name', 'Serial Number', 'Product Name', 'Product ID', 'Description', 'Site ID', 'Storage Location', 'Status', 'Item Owner', 'Nokia STO', 'Notes', 'Category ID']
            for column in required_columns:
                if column not in df.columns:
                    raise ValueError(f"Missing required column: {column}")

            imported_tools = []

            # Process the DataFrame and insert into the database
            for index, row in df.iterrows():
                tool = Tool(
                    name=row['Name'],
                    serialNumber=row['Serial Number'],
                    productName=row['Product Name'],
                    productId=row['Product ID'],
                    description=row['Description'],
                    siteId=row['Site ID'],
                    storageLocation=row['Storage Location'],
                    status=row['Status'],
                    itemOwner=row['Item Owner'],
                    nokiaSto=row['Nokia STO'],
                    notes=row['Notes'],
                    category_id=row['Category ID']
                )
                db.session.add(tool)
                imported_tools.append(tool)
            db.session.commit()

            imported_tools_data = [tool.to_dict() for tool in imported_tools]

            app.logger.info("Data imported successfully")
            return jsonify(imported_tools_data), 200
        except Exception as e:
            app.logger.error(f"Error importing data: {str(e)}")
            return jsonify({'error': str(e)}), 500
    else:
        app.logger.error("Invalid file format")
        return jsonify({'error': 'Invalid file format'}), 400
    
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'xlsx'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


if __name__=='__main__':
    app.run(port=5555,debug=True)