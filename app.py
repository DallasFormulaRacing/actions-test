from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return "Testing CI/CD(october6- attempt 2)"

if __name__ == "__main__":
        print("test 1")
    app.run(host="0.0.0.0", port=5000, debug=True)
