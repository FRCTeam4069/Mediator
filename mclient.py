import urllib2
import json

USER_AGENT = "Team4069MediatorClient/1.0"

class MClient(object):
  def __init__(self, server="http://localhost:4069/"):
    self.server = server


  def send(self, postfix, data=None, delete=False):
    request = urllib2.Request(
        self.server + postfix,
        data,
        {"User-Agent" : USER_AGENT, "Content-Type" : "application/json"}
    )
    if delete:
      request.get_method = lambda: "DELETE"
    try:
      r = urllib2.urlopen(request)
    except urllib2.HTTPError, e:
      if e.code == 404:
        return None
      raise e
    return r.read()

  def putCommand(self, **kwargs):
    s = json.dumps(kwargs)
    self.send("q/commands", s)

  def getData(self):
    return json.loads(self.send("q/data"))

  def addKV(self, key, **kwargs):
    self.send("kv/%s" % key, json.dumps(kwargs))

  def getKV(self, key):
    response = self.send("kv/%s" % key)
    if response:
      return json.loads(response)
    else:
      return None

  def deleteKV(self, key):
    self.send("kv/%s" % key, delete=True)



