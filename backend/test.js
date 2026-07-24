import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://jebakhatun57_db_user:Jebamongodb@cluster0.pwirxnj.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();