import flask 
import os
import random

from resources.py import classes 

app = flask.Flask(__name__) 
app.template_folder = os.path.abspath("./webserver/templates")
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config["TEMPLATES_AUTO_RELOAD"] = True

wordle = classes.Wordle()


@app.route("/")
def index():
    wordle.stats.games += 1
    return flask.render_template("index.html")

@app.route("/api/stats")
def stats():
    return flask.jsonify(
        wordle.stats.to_dict()
    )

@app.route("/api/addGame", methods=["POST"])
def addGame():
    wordle.stats.games += 1
    return {"stats":wordle.stats.to_dict()}

@app.route("/api/autoFillRow", methods=["POST"])
def autoFillRow():
    data = flask.request.json 

    letters_raw = data["words"]
    letters = []

    row = data["row"]

    for i, raw_letter in enumerate(letters_raw):
        if (i <= row * 5) and raw_letter["value"] != "":
            letters.append(classes.Letter(raw_letter["value"], raw_letter["state"], raw_letter["wordIndex"]))

    words = wordle.calculate_word(wordle.wordle_words, letters)
    if len(words) == 0:
        words = wordle.calculate_word(wordle.words, letters)

    if len(words) == 0:
        words = [None]

    return flask.jsonify(
        {"word":random.choice(words), "stats":wordle.stats.to_dict()}
    )

@app.route("/api/doWords", methods=["POST"])
def doWords():
    data = flask.request.json 

    letters_raw = data["words"]
    letters = []

    for raw_letter in letters_raw:
        if raw_letter["value"] != "":
            letters.append(classes.Letter(raw_letter["value"], raw_letter["state"], raw_letter["wordIndex"]))

    possible_words = wordle.calculate_word(wordle.words, letters)
    likely = wordle.calculate_word(wordle.wordle_words, letters)

    return flask.jsonify(
        {"words":possible_words[:20], "length":len(possible_words), "total":len(wordle.words), "likely":likely[:20], "stats":wordle.stats.to_dict()}
    )

app.run(host="0.0.0.0", port=5000)