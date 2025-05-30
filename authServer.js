require('dotenv').config()

import express, { json } from 'express'
const app = express()
import { verify, sign } from 'jsonwebtoken'

app.use(json())

let refreshTokens = []
app.delete('/logout', (req,res) =>{
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post('/token', (req,res) => {
    const refreshToken = req.body.token
    if(refreshToken == null) return res.sendStatus(401)
    if(refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken({name: user.name})
        res.json({accessToken: accessToken})
    })
})

app.post('/login', (req, res) => {
    //Authenticate User
    const username = req.body.username
    const user = {name: username}

    const accessToken = generateAccessToken(user)
    const refreshToken = sign(user,process.env.REFRESH_TOKEN_SECRET )
    res.json({ accessToken: accessToken, refreshToken: refreshToken}) 
})

// function AuthenticateToken(req, res, next){
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
//     if(token == null) return res.sendStatus(401)

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403)
//         req.user = user
//         next()
//     })
// }
function generateAccessToken(user){
    return sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'})
}

app.listen(4000)