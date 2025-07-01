import json
from datetime import datetime
races = [
  {"round": 11, "name": "Austria", "date": "June 27–29", "image": "...", "status": ""},
  {"round": 12, "name": "Great Britain", "date": "July 04–06", "image": "...", "status": ""},
  {"round": 13, "name": "Belgium", "date": "July 25–27", "image": "...", "status": ""},
  {"round": 14, "name": "Hungary", "date": "August 01–03", "image": "...", "status": ""}
]
today = datetime.utcnow()
for race in races:
  if "July 04" in race["date"]:
    race["status"] = "current"
  elif "June" in race["date"]:
    race["status"] = "previous"
  else:
    race["status"] = "upcoming"
with open('races.json', 'w') as f:
  json.dump(races, f, indent=2)
