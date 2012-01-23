# Written by Shuhao Wu of Team 4069
# Released under GPLv3

VERSION = 0.1

import flask
from settings import *
app = flask.Flask(__name__)

from collections import deque

# Global variables?
# For now it's an okay solution.

# Server don't care if the data is json or not. It just passes a string around.

command_queue = deque()
data_queue = deque()
kv_store = {}

location_map = {
    "commands" : command_queue,
    "data" : data_queue
}


def notfound():
  response = flask.jsonify(error="not found")
  response.status_code = 404
  return response

def success():
  return flask.jsonify(success=1)

@app.route("/q/<location>", methods=["POST", "GET"])
def operations(location):
  queue = location_map.get(location, None)
  if queue is None:
    response = flask.jsonify(error="invalid url")
    response.status = 404
    return response

  if flask.request.method == "POST":
    data = flask.request.data
    print data
    queue.append(data)
    return success()
  elif flask.request.method == "GET":
    try:
      response = flask.make_response(queue.popleft())
      response.mimetype = "text/plain"
      return response
    except IndexError:
      return notfound()

@app.route("/kv/<key>", methods=["POST", "GET", "DELETE"])
def kv(key):
  global kv_store
  if flask.request.method == "POST":
    data = flask.request.data
    kv_store[key] = data
    return success()
  elif flask.request.method == "GET":
    try:
      return kv_store[key]
    except KeyError:
      return notfound()
  elif flask.request.method == "DELETE":
    try:
      del kv_store[key]
      return success()
    except KeyError:
      return notfound()

@app.route("/credits")
def credits():
  return flask.jsonify(author="team4069", version=VERSION)

if __name__ == "__main__":
  if DEBUG == True:
    app.run(debug=True, host="", port=4069)
  else:
    from gevent.wsgi import WSGIServer
    http_server = WSGIServer(("", DEPLOY_PORT), app)
    http_server.serve_forever()
