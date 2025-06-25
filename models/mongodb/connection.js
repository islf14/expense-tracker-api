import { MongoClient } from 'mongodb'

export function connection() {
  const DEFAULT_CONFIG =
    'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.8'
  const uri = process.env.URI_MONGODB ?? DEFAULT_CONFIG
  const client = new MongoClient(uri)
  return client
}
