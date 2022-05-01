from uuid import uuid4
from flask import Flask, request, make_response
from typing import Dict, TypedDict
from flask_cors import CORS

class BankEntry(TypedDict):
    id: str
    description: str
    amount: float


entries: Dict[str, BankEntry] = {'potato':{'id':'potato', 'description':'potat', 'amount': 100 }}

app = Flask(__name__)
CORS(app)

@app.route('/')
def listing(): return entries


@app.route('/', methods=['POST'])
def add_entry(): 
    eid = str(uuid4())
    entry: BankEntry = request.get_json()
    entry['id']=eid
    entries[eid]=entry
    return entry
    

@app.route('/<eid>')
def get_entry(eid: str):
    if eid in entries :
        return entries[eid]
    return make_response('Could not find entry', 404)



@app.route('/<eid>', methods=['PUT'])
def update_entry(eid: str): 
    if eid not in entries:
        return 'ERROR',404
    entry: BankEntry = request.get_json()
    entry['id']=eid
    entries[eid]= entry
    return entry

@app.route('/<eid>', methods=['DELETE'])
def delete_entry(eid: str):
    if eid in entries :
        del entries[eid]
        return eid+' has been deleted', 204
        
        
    return make_response('Could not find entry', 404)



if __name__ == '__main__':
    app.run(debug=True)