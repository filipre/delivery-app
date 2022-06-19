const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const app = express()
const port = 3000

const Model = require('./models/model');

//
// Helper
//
function getRandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

const mongoose = require('mongoose');
const uri = "mongodb://database:27017/api_service";

//
// Database stuff
//
mongoose.connect(uri);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error);
});

database.once('connected', () => {
    console.log('Database Connected');
});

//
// Routing
//
const jsonParser = bodyParser.json()

app.get('/', (req, res) => {
    res.send('API Service Index');
});
app.get('/healthcheck', (req, res) => {
    res.send('OK');
});


// READ
app.get('/shipment/:shipment_id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.shipment_id);
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ message: "Invalid shipment ID" });
    }
})

// CREATE
app.post('/shipment', jsonParser, async (req, res) => {
    ts_created = new Date();
    lat_init = 48.137154;
    long_init = 11.576124;

    const data = new Model({
        "_id": uuidv4(),
        "created": ts_created,
        "customer": req.body.customer, // TODO: validation
        "address": req.body.address,
        "status": "CREATED",
        "status_history": [
            {
                "date": ts_created,
                "status": "CREATED",
            }
        ],
        "location": {
            "lat": lat_init,
            "long": long_init,
        },
        "location_history": [
            {
                "date": ts_created,
                "lat": lat_init,
                "long": long_init,
            }
        ],
        "rider": null, // none selected yet
        "deleted": false,
    });

    try {
        const dataToSave = await data.save();
        res.status(201).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE
app.patch('/shipment/:shipment_id', jsonParser, async (req, res) => {
    const shipment_id = req.params.shipment_id;
    const updatedData = req.body;
    const options = { new: true };
    const result = await Model.findByIdAndUpdate(
        shipment_id, updatedData, options
    );
    res.send(result);
});

//
// Start app
//
app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`);
});

