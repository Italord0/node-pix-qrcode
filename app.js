const { PIX } = require('gpix/dist');

const express = require('express')
const path = require('path');
const app = express()
const port = 7777

app.use(express.json())
app.use('/img',express.static(__dirname + '/img'))

function generatePix(params) {
    let {
        receiverName,
        receiverCity,
        receiverZipCode,
        key,
        description,
        uniqueTransaction,
        amount
    } = params

    return PIX.static()
        .setReceiverName(receiverName)
        .setReceiverCity(receiverCity)
        .setReceiverZipCode(receiverZipCode)
        .setKey(key)
        .setDescription(description)
        .isUniqueTransaction(uniqueTransaction)
        .setAmount(amount)
}

app.post('/pix64', async (req, res) => {

    try {
        let pix = generatePix(req.body)
        let base64 = await pix.getQRCode()

        console.log(pix)

        res.json({ "base64": base64 })
    } catch (error) {
        res.json(400, { "error": error })
    }

})

app.post('/pix', async (req, res) => {
    let pix = generatePix(req.body)
    let date = new Date()
    let fileName = 'img/' + date.getTime() + '.png'
    if (await pix.saveQRCodeFile(fileName)) {
        console.log('success in saving static QR-code')
        res.status(201).json({ "url": 'http://italomelo.dev.br/' + fileName });
    } else {
        console.log('error saving QR-code')
    }

})


app.listen(port, () => {
    console.log(`servidor rodando na porta : ${port}`)
})
