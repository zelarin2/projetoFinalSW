from flask import Flask, render_template, redirect, url_for, request, flash #flask basic imports
from flask_sqlalchemy import SQLAlchemy # Extensao de flask para apoiar o uso de SQLALCHEMY (Ajuda na entrada e saida de informação na base de dados)
from sqlalchemy.sql import func, desc
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user # Extensao de flask que trata do login e das sessoes
from flask_bcrypt import Bcrypt # Extensao de Flask para encriptar informação (Usado nas passwords)

app = Flask(__name__)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'secretkey'

#Para criação da tabela escrever na consola:
#python
#from app import db
#db.create_all()
#Instalar sqlite3
#Para verificar que a tabela foi criada:
#sqlite3 database.db (nomedoficheiro.db)
#.tables

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

#User callback 
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

#Tabela User (guarda o ID, username, password e email do utilizador)
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), nullable=False, unique=True)
    password = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(150), unique=True)
    leaderboard = db.relationship('Leaderboard')
    
class Leaderboard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15))
    score = db.Column(db.Integer)
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

#home
@app.route("/")
def home():
    bAuth = current_user.is_authenticated
    if bAuth:
        maxScores = db.session.query(func.max(Leaderboard.score)).filter_by(username=current_user.username).first()
        return render_template('home.html', user=current_user, score=maxScores)
    else:
        return render_template('home.html', user=current_user)
    #userMaxScore = db.session.query(Leaderboard).filter(Leaderboard.score == maxScores and user.username == current_user.username).first()
    
    

#/login
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        if user:
            if bcrypt.check_password_hash(user.password, password):
                login_user(user, remember=True)
                return redirect(url_for('home'))
            else:
                flash('Wrong Password')
        else:
            flash('Wrong Username')
    return render_template('login.html', user=current_user)

#/logout
@app.route("/logout", methods=["GET", "POST"])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

#/register
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        email = request.form.get('email')
        username = request.form.get('username')
        password = request.form.get('password')
        passwordcf = request.form.get('passwordcf')
        user = User.query.filter_by(username=username).first()
        email = User.query.filter_by(email=email).first()
        if user:
            flash("User already exists")
        if email:
            flash("Email already on use")
        if password != passwordcf:
            flash("Password mismatch")
        else:
            hashed_password = bcrypt.generate_password_hash(password=password)
            new_user = User(email=email,username=username, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            flash("Account sucessfully created!")
            return redirect(url_for('home'))
        
    return render_template('register.html', user=current_user)

@app.route("/floppybirb", methods=["GET", "POST"])
def floppybirb():
    if request.method == 'POST':
        score = request.form.get('score')
        new_score = Leaderboard(score=score, user_id=current_user.id, username=current_user.username)
        db.session.add(new_score)
        db.session.commit()
        flash('Score added!')
    return render_template('floppybirb.html', user=current_user)

@app.route("/Leaderboard")
def leaderboard():
    maxScores = db.session.query(Leaderboard).order_by(Leaderboard.score.desc()).all()
    #lead = db.session.query(Leaderboard).limit(100)
    return render_template('leaderboard.html', user=current_user, leaderboard=maxScores)


#default
if (__name__ == '__main__'):
    app.run(
        port=5555,
        debug=True
    )