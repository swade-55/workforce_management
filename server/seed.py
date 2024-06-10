from models import db, User, Tool, Category

from config import app
import random

def seed():
    with app.app_context():
        # Clear existing data
        Tool.query.delete()
        Category.query.delete()
        User.query.delete()
        db.session.commit()

        # Create users
        user1 = User(username='user1', password_hash='password1')
        user2 = User(username='user2', password_hash='password2')

        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()

        # Define categories and statuses
        categories = [
            'Laptops', 'Handheld Phones', 'Routers', 'Tablets', 'Monitors',
            'Printers', 'Keyboards', 'Mice'
        ]
        statuses = ['new', 'in use', 'storage', 'damaged', 'lost']

        # Create categories and tools
        for i, category_name in enumerate(categories, start=1):
            user = user1 if i % 2 == 0 else user2
            category = Category(name=category_name, user=user)
            db.session.add(category)
            db.session.commit()

            for j in range(10):
                tool = Tool(
                    name=f'Tool {i * 10 + j + 1}',
                    serial=f'{random.randint(10000, 99999)}',
                    model=f'Model {chr(65 + j)}',
                    description=f'Description for Tool {i * 10 + j + 1}',
                    status=random.choice(statuses),
                    category=category
                )
                db.session.add(tool)
                db.session.commit()

if __name__ == '__main__':
    seed()
