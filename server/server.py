from flask import Flask, request, jsonify
from LEMMATIZER import LEMMATIZER as lm 
import json

app = Flask(__name__)

@app.route("/pattern/lemmatizer")
def lemmatizer():
    word = str(request.args.get("w"))
    if word == "None":
        return "ERROR, no found w", 500
    response = jsonify(lm(word).lemmatize())
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route("/pattern/parse")
def parse():
    word = str(request.args.get("w"))
    if word == "None":
        return "ERROR, no found w", 500
    response = jsonify(lm(word).whatIS())
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route("/pattern/conj")
def conj():
    inpt = request.args.get("i")
    verb = lm(inpt).find("VERB")
    tenses = lm(verb).tenses() if verb != False else False
    conj = [tenses[1]]+[tenses[2]] if tenses != False else [1, "singular"]
    wt = lm(inpt).wordTokenize()
    if "mi" in wt:
        noum = False
        conj = [1, "singular"]
    elif "li" in wt:
        noum = False
        conj = [3, "singular"]
    elif "ti" in wt:
        noum = False
        conj = [2, "singular"]
    elif "ci" in wt:
        noum = False
        conj = [1, "prural"]
    elif "vi" in wt:
        noum = False
        conj = [2, "prural"]
    elif "gli" in wt:
        noum = False
        conj = [3, "prural"]
    response = jsonify(conj)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route("/pattern/coniugate")
def coniugate():
    verb = request.args.get("v")
    person = int(request.args.get("p"))
    number = request.args.get("n")
    rt = lm(verb).conj(person, number)
    response = jsonify(rt)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route("/prepareBag")
def prepareBag():
    question = request.args.get("q")
    inpt = request.args.get("i")
    with open("models/"+question+"_data.json", "r") as f:
        load = json.load(f)
        w = load["w"]
        len_ = load.get('len')
        sw = lm(inpt).lemmatize()
        bag = [len(sw)] if len_ == True else []
        for i, word in enumerate(w):
            bag.append(1+i if len_ == True else 1) if word in sw else bag.append(-1)
    response = jsonify(bag)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route("/prepareBagGet")
def prepareBagGet():
    question = request.args.get("q")
    inpt = request.args.get("i")
    with open("models/"+question+"_data.json", "r") as f:
        load = json.load(f)
        w = load["w"]
        verb = load['v']
        sw = lm(inpt).lemmatize()
        bag = [len(sw)]
        aw = []
        for x in sw:
            aw.append(lm(x).whatIS())
        for i, word in enumerate(w):
            bag.append(1+aw.index(word)) if word in aw else bag.append(0)
        for i, x in enumerate(verb):
            bag.append(1+sw.index(x)) if x in sw else bag.append(0)
    response = jsonify(bag)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route("/getClass")
def getClass():
    i = int(request.args.get("i"))
    question = request.args.get("q")
    with open("models/"+question+"_data.json", "r") as f:
        load = json.load(f)
        cl = load['cl']
        response = jsonify(cl[i])
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response


app.run(debug=True)