const express = require('express')
const path = require('path')
const app = express()
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')

app.use(express.json())

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
const { setDefaultResultOrder } = require('dns')
var rollbar = new Rollbar({
  accessToken: 'affae4a276e445c18d06517a62d3d537',
    // accessToken: 'a3a56c39a4754509ba04ff574d173e84',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

app.get('/', (req, res) => {
    //HERE IS FIRST ROLLBAR EVENT
    rollbar.info("Someone loaded up your HTML.")
    res.sendFile(path.join(__dirname, '../assessment-qa-devops/public/index.html'))
})

app.get('/js', (req, res) => {
    res.sendFile(path.join(__dirname, '../assessment-qa-devops/public/index.js'))
})

app.get('/css', (req, res) => {
    res.sendFile(path.join(__dirname, '../assessment-qa-devops/public/index.css'))
})

app.get('/api/robots', (req, res) => {
    try {
        //HERE IS SECOND ROLLBAR EVENT
        rollbar.log("Here are all the robots.")
        res.status(200).send(botsArr)
    } catch (error) {
        console.log('ERROR GETTING BOTS', error)
        res.sendStatus(400)
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        //HERE IS THIRD ROLLBAR EVENT
    rollbar.warning("Make sure 5 robots appear.")
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        res.status(200).send({choices, compDuo})
    } catch (error) {
        console.log('ERROR GETTING FIVE BOTS', error)
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
         //HERE IS FOURTH ROLLBAR EVENT
        rollbar.critical("This is a CRITICAL error. Robots are gaining consciousness.")
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            res.status(200).send('You lost!')
             //HERE IS ONE ROLLBAR EVENT
            rollbar.critical("This is a CRITICAL error. Robots are gaining consciousness.")
        } else {
            playerRecord.losses++
            res.status(200).send('You won!')
        }
    } catch (error) {
        console.log('ERROR DUELING', error)
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        res.status(200).send(playerRecord)
    } catch (error) {
        console.log('ERROR GETTING PLAYER STATS', error)
        res.sendStatus(400)
    }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})