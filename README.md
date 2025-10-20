# simplekafkaapp — quick start

Follow these steps to run the Kafka container and start the producer and consumer scripts.

1. Change into the project directory:

```bash
cd actions-test
```

1. Switch to the feature branch (if you're not already on it):

```bash
git switch test/kafka-js
```

3. Start the Kafka container (detached):

```bash
docker compose up -d
```

4. Open three separate terminals. In VS Code you can split terminals using the split terminal button (the square-with-line icon near the terminal tabs).

Run the following in each terminal:

- Terminal 1:

```bash
node producer.js
```

- Terminal 2:

```bash
node producer2.js
```

- Terminal 3:

```bash
node consumer.js
```

Notes

- If you need to stop the Kafka container later:

```bash
docker compose down
```

That's it — you should see messages produced by the two producers and consumed by the consumer in the third terminal.
