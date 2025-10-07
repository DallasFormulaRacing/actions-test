import sentry_sdk
from flask import Flask

sentry_sdk.init(
    dsn="https://086406d651154e51a261082a9153fe78@sentry-intake.us5.datadoghq.com/1",
)
sentry_sdk.set_tag("service", "flask-app")

app = Flask(__name__)

@app.route("/error")
def trigger_error():
    raise Exception("This is a test exception for Sentry->Datadog!")

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)