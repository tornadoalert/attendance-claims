from flask import request, Flask, render_template,jsonify
from flask_sqlalchemy import SQLAlchemy
import dateutil.parser
from config import SQLALCHEMY_DATABASE_URI
from flask_migrate import Migrate
app = Flask(__name__,static_url_path='/static')
app.config["DEBUG"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
db = SQLAlchemy(app)
migrate = Migrate(app, db)
from models import *
all_depts = """Anatomy
Physiology
Biochemistry
Community Medicine
Pathology
Pharmacology
Microbiology
Forensic Medicine
Medicine
ENT
OBG
Opthalmology
Surgery
Paediatrics
Pulmonary Medicine
Orthopaedics""".splitlines()
posting_depts = """Community Medicine
Medicine
ENT
OBG
Opthalmology
Surgery
Paediatrics
Pulmonary Medicine
Orthopaedics""".splitlines()
sample_post = {'name': 'Ash', 'email': 'ash@example.com', 'rollNumber': '150101007', 'serialNumber': '5', 'year': '2nd', 'batch': 'A', 'selectedClasses': [{'date': '2017-04-14', 'department': 'Surgery', 'end_time': '09:00:00', 'id': 68, 'name': 'Surgery', 'start_time': '08:00:00'}, {'date': '2017-04-14', 'department': 'Medicine', 'end_time': '12:30:00', 'id': 66, 'name': 'Postings', 'start_time': '09:30:00'}, {'date': '2017-04-14', 'department': 'Pathology', 'end_time': '15:00:00', 'id': 65, 'name': 'Pathology', 'start_time': '14:00:00'}, {'date': '2017-04-14', 'department': 'Community Medicine', 'end_time': '16:00:00', 'id': 67, 'name': 'Community Medicine practicals', 'start_time': '15:00:00'}, {'date': '2017-04-20', 'department': 'Pharmacology', 'end_time': '09:00:00', 'id': 64, 'name': 'Pharmacology', 'start_time': '08:00:00'}], 'event': 'UTSAV'}

def get_schedule(date,batch):
    day = dateutil.parser.parse(date).weekday()+1
    return Period.query.filter_by(day=day, batch = Batch.query.filter_by(name=batch).first()).order_by(Period.start_time).all()
def process_claim(data):
    pass
@app.route('/',methods = ['GET','POST'])
def index():
    return render_template('index.html')
@app.route('/classdata',methods = ['GET','POST'])
def class_data():
    """Request class data with params date=(2017-12-31) and batch=batch_a"""
    if request.method == 'GET':
        date = request.args.get('date')
        batch = request.args.get('batch')
        if date and batch:
            classes = []
            for period in get_schedule(date,batch):
                class_obj = {'id':period.id, 'name' : period.name, 'start_time':str(period.start_time), 'end_time':str(period.end_time),'department':all_depts,'date':date}
                if period.name == 'Postings':
                    class_obj['department'] = posting_depts
                if not period.department == None:
                    class_obj['department'] = period.department.name
                classes.append(class_obj)
            return jsonify(classes)
    if request.method == 'POST':
        data = request.json
        app.logger.info(str(data))
        user = User.query.filter_by(roll_no=int(data['rollNumber'])).first()
        new_user = False
        if user == None:

            new_user = True
            user = User(roll_no = int(data['rollNumber']), name = data['name'],email = data['email'], serial = data['serialNumber'])
            app.logger.info("User is {}".format(user.name))
            #db.add(u)
            #db.commit()
        for period in data['selectedClasses']:
            department = Department.query.filter_by(name = period['department']).first()
            claim_obj = Claim(event = data['event'], user = user, date = period['date'], start_time=period['start_time'], end_time = period['end_time'],department = department )
            app.logger.info(str(claim_obj))
            #db.add(claim_obj)
            #db.commit()
@app.route('/status_check',methods = ['GET','POST'])
def status_check():
    pass
@app.route('/login',methods = ['GET','POST'])
def login():
    pass
@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return "Not found page", 404
