from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


# SQLite DB setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///thoughts.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database model
class Thought(db.Model):
    __tablename__ = 'thoughts'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(50), default='Anonymous')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Thought {self.id} - {self.content[:20]}>'

# Create tables
with app.app_context():
    db.create_all()

# API routes
@app.route('/thoughts', methods=['GET'])
def get_thoughts():
    thoughts = Thought.query.order_by(Thought.timestamp.desc()).all()
    return jsonify([
        {
            'id': t.id,
            'content': t.content,
            'author': t.author,
            'timestamp': t.timestamp.strftime('%Y-%m-%d %H:%M')
        } for t in thoughts
    ])

@app.route('/thoughts', methods=['POST'])
def add_thought():
    data = request.json
    new_thought = Thought(
        content=data['content'],
        author=data.get('author', 'Anonymous') or 'Anonymous'
    )
    db.session.add(new_thought)
    db.session.commit()
    return jsonify({'message': 'Thought added!'})

@app.route('/thoughts/<int:id>', methods=['PUT'])
def update_thought(id):
    data = request.json
    thought = Thought.query.get(id)
    if thought:
        thought.content = data['content']
        db.session.commit()
        return jsonify({'message': 'Thought updated!'})
    return jsonify({'error': 'Not found'}), 404

@app.route('/thoughts/<int:id>', methods=['DELETE'])
def delete_thought(id):
    thought = Thought.query.get(id)
    if thought:
        db.session.delete(thought)
        db.session.commit()
        return jsonify({'message': 'Thought deleted!'})
    return jsonify({'error': 'Not found'}), 404

if __name__ == '__main__':
     app.run(debug=True)
