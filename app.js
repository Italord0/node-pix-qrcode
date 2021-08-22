const { PIX } = require('gpix/dist');

const express = require('express')
const app = express()
const port = 7777
app.use(express.json())

function generateImgTag(base64) {
    return `<img src="${base64}"/>`
}

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

app.post('/pix', async (req, res) => {

    try {
        let pix = generatePix(req.body)
        let base64 = await pix.getQRCode()

        console.log(pix)

        res.send(generateImgTag(base64))
    } catch (error) {
        res.json(400,{"error" : error})
    }

})

app.listen(port, () => {
    console.log(`servidor rodando na porta : ${port}`)
})
