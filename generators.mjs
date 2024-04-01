import { createReadStream, createWriteStream } from "fs"
import {allFakers} from "@faker-js/faker"
import { resolve } from "path"
import axios from "axios";
const filename = "generator-database.csv"

const faker = allFakers.pt_BR
// const db = []
const filepath = resolve(filename)
const writeStream = createWriteStream(filepath)
function * generateFakeData(dataLength = 1e5) {
  for(let i = 0; i < dataLength; i ++) {
    const {person, internet}= faker
    const id = i
    const name = person.fullName()
    const email = internet.email()
    const gender = person.gender()
    const bio = person.bio()
    // db.push(`${id},${name},${email},${gender},${bio}\n`)
  
 
    yield {id, name, email, gender, bio};
  }
}
function * insertData() {
  for(const fakeData of generateFakeData(15)) {
    const {id,name,email,gender,bio} = fakeData
    const data = `${id},${name},${email},${gender},${bio}\n`;
    writeStream.write(data)
    yield data;
  }
  writeStream.close()
}
writeStream.on('open', insertData)
writeStream.on('close', () => console.log("Finished, file created at " + filepath))


async function * sendToServer() {
  for (const data of insertData()) {
    const response = await axios.post('http://localhost:3000/insertNewRow', {row: data})
    yield response.data;
  }
}

// send to client
for await (const data of sendToServer()) {
  const getRows = await axios.get('http://localhost:3000/getRows')
  console.log(getRows.data[getRows.data.length - 1])
  // data coming on demand
}
