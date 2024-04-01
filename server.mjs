import express from "express"
const app = express()
app.use(express.json())
function heavyProcess() {return new Promise(res => setTimeout(res, 1500))}
const newRows = []
app.post("/insertNewRow", async (request, response) => {
  const {row} = request.body;
  await heavyProcess(150)
  newRows.push(row)
  return response.status(201).send()
})

app.get("/getRows", (request,response) => {
  return response.status(200).json(newRows)
})
app.listen(3000, () => console.log("Server at port 3000"))