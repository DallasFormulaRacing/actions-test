import sentry_sdk
from flask import Flask

sentry_sdk.init(
    dsn = "https://b91d300f29870176c8f05b114d8ca558@o4510128361963520.ingest.us.sentry.io/4510145722056704",
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    traces_sample_rate=1.0,
)

app = Flask(__name__)

@app.route("/error")
def trigger_error():
    raise Exception("This is a test exception for Sentry.")

@app.route("/")
def hello_world():
    return "Go to /error to return a error to Sentry. Hi Team!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
