from models import db, User, Tool, Category, TestLine, Reservation
from config import app
import random
from werkzeug.security import generate_password_hash

def seed():
    with app.app_context():
        # Clear existing data
        Reservation.query.delete()
        TestLine.query.delete()
        Tool.query.delete()
        Category.query.delete()
        User.query.delete()
        db.session.commit()

        # Create users with roles
        admin = User(username='admin', email='admin@example.com', password_hash=generate_password_hash('adminpass'), role='admin')
        user1 = User(username='user1', email='user1@example.com', password_hash=generate_password_hash('password1'), role='user')
        user2 = User(username='user2', email='user2@example.com', password_hash=generate_password_hash('password2'), role='user')

        db.session.add(admin)
        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()

        # Define categories and statuses
        categories = [
            'Laptops', 'Handheld Phones', 'Routers', 'Tablets', 'Monitors',
            'Printers', 'Keyboards', 'Mice'
        ]
        statuses = ['new', 'in use', 'storage', 'damaged', 'lost']
        item_owners = ['Verizon', 'Nokia', 'AT&T']
        storage_locations = ['US47-52000', 'US47-53000', 'US47-54000']
        nokia_stos = ['SCE Project Return', 'DXC Return', 'NFL Stadium Deployment Return']
        sites = ['Site1', 'Site2', 'Site3']

        # Create categories and tools
        for i, category_name in enumerate(categories, start=1):
            user = user1 if i % 2 == 0 else user2
            category = Category(name=category_name, user=user)
            db.session.add(category)
            db.session.commit()

            for j in range(10):
                tool = Tool(
                    serialNumber=f'L{random.randint(1000000000, 9999999999)}',
                    productName=f'Product {i * 10 + j + 1}',
                    productId=f'ID{random.randint(1000, 9999)}',
                    description=f'Description for Tool {i * 10 + j + 1}',
                    status=random.choice(statuses),
                    siteId=random.choice(sites),
                    storageLocation=random.choice(storage_locations),
                    itemOwner=random.choice(item_owners),
                    nokiaSto=random.choice(nokia_stos),
                    notes=f'Notes for Tool {i * 10 + j + 1}',
                    category=category
                )
                db.session.add(tool)
                db.session.commit()

        # Create test lines
        testline_statuses = ['available', 'checked out']
        for k in range(20):
            testline = TestLine(
                name=f'TestLine {k + 1}',
                status=random.choice(testline_statuses)
            )
            db.session.add(testline)
            db.session.commit()

if __name__ == '__main__':
    seed()
