const express = require("express")
const morgan = require("morgan")
const app = express()
const cors = require("cors")
app.use(express.static('dist'))


app.use(cors())
app.use(express.json())

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "61464664664"
    },
    {
        id: 2,
        name: "Ariana",
        number: "878788752875"
    },
    {
        id: 3,
        name: "Harry Kane",
        number: "993278758828"
    }]

app.get('/', (request, response) => {
    response.send('<h1>API REST - Agenda Telefónica</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const count = persons.length
    const date = new Date()
    response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).json({ error: 'Person not found' })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (!person) {
        return response.status(404).json({ error: 'Person not found' })
    }
    persons = persons.filter(p => p.id !== id)
    console.log('Deleted:', id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({ error: 'Name is missing' })
    }
    if (!body.number) {
        return response.status(400).json({ error: 'Number is missing' })
    }
    const nameExists = persons.some(p => p.name === body.name)
    if (nameExists) {
        return response.status(400).json({ error: 'name must be unique' })
    }
    const newPerson = {
        id: Math.floor(Math.random() * 1000000),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(newPerson)
    console.log('Added:', newPerson)
    response.json(newPerson)
})

app.put('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const body = request.body

    const person = persons.find(p => p.id === id)
    if (!person) {
        return response.status(404).json({ error: 'Person not found' })
    }

    const updatedPerson = { ...person, number: body.number }
    persons = persons.map(p => (p.id === id ? updatedPerson : p))

    console.log('Updated:', updatedPerson)
    response.json(updatedPerson)
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
