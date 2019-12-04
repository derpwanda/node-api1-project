// implement your API here
const express = require("express")
let db = require("./data/db.js")
const server = express()

//middleware
server.use(express.json())

server.get("/", (request, response) => {
    console.log("ip:", request.ip)

    response.json({ message: "we in here!" })
})

//POST - add userR
server.post("/api/users", (request, response) => {
    const newUser = request.body

    if (!newUser.name) {
        return response.status(400).json({ errorMessage: "Please provide name for the user." })
    } else if (!newUser.bio) {
        return response.status(400).json({ errorMessage: "Please provide bio for the user." })
    } else {
        db.insert(newUser).then(result => {
            response.status(201).json(result)
        }).catch(error => {
            response.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
        })
    }
})

//GET - get userS
server.get("/api/users", (request, response) => {
    db.find().then(users => {
        response.status(200).json(users)
    }).catch(error => {
        response.status(500).json({ errorMessage: "The users information could not be retrieved." })
    })
})

//GET - get user BY ID
server.get("/api/users/:id", (request, response) => {
    const { id } = request.params

    db.findById(id).then(user => {
        if (user) {
            response.status(200).json(user);
        } else {
            response.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    }).catch(error => {
        response.status(500).json({ errorMessage: "The user information could not be retrieved." })
    })
})

server.delete("/api/users/:id", (request, response) => {
    const { id } = request.params

    db.findById(id).then(user => {
        if (user) {
            db.remove(id).then(removed => {
                response.status(200).json(removed)
            })
        } else {
            response.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    }).catch(error => {
        response.status(500).json({ errorMessage: "The user could not be removed" })
    })
})
server.listen(9000, () => console.log('the server is alive'))