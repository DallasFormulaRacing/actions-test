import sentry_sdk
from flask import Flask

sentry_sdk.init(
    dsn="https://b91d300f29870176c8f05b114d8ca558@o4510128361963520.ingest.us.sentry.io/4510145722056704",
    # Add data like request headers and IP for users,
    # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
    send_default_pii=True,
)
sentry_sdk.set_tag("service", "flask-app")

app = Flask(__name__)

@app.route("/")
def hello_world():
    1/0  # raises an error
    return "<p>Hello, World!</p>"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)