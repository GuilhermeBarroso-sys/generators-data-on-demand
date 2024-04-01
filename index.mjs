import { createReadStream, createWriteStream } from "fs"
import {allFakers} from "@faker-js/faker"
import { resolve } from "path"
import axios from "axios";
const filename = "generator-database.csv"

const faker = allFakers.pt_BR
// const db = []
const filepath = resolve(filename)
const writeStream = createWriteStream(filepath)
function generateFakeData(dataLength = 1e2) {
  return new Promise(res => {
    const data = []
    for(let i = 0; i < dataLength; i ++) {
      const {person, internet}= faker
      const id = i
      const name = person.fullName()
      const email = internet.email()
      const gender = person.gender()
      const bio = person.bio()
      // db.push(`${id},${name},${email},${gender},${bio}\n`)
      data.push({id, name, email, gender, bio}) ;
    }
    res(data)
  })
}
async function insertData() {
  return new Promise(async (res) => {
    const dataInserted = []
    const fakeData = await generateFakeData(15);
    for(const data of fakeData) {
      const {id,name,email,gender,bio} = data
      const rowData = `${id},${name},${email},${gender},${bio}\n`;
      writeStream.write(rowData)
      dataInserted.push(rowData)
    }
    writeStream.close()
    res(dataInserted)
  })
}
writeStream.on('open', sendToServer)
writeStream.on('close', () => console.log("Finished, file created at " + filepath))


async function  sendToServer() {
  const data = await insertData()
  for (const row of data) {
    await axios.post('http://localhost:3000/insertNewRow', {row})
    
  }
  const getRows = await axios.get('http://localhost:3000/getRows')
  console.log(getRows.data)
  return 'ok'
}

// send to client


