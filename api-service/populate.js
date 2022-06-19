const { MongoClient } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017/api_service";
const client = new MongoClient(uri); // creates new db if it does not exist

// Customer
const data_customer = [
    {
        "_id": "2387647b-9c4f-4694-9498-cd19832e7cfb",
        "name": "M&H",
        "created": 1655502702960
    },
    {
        "_id": "57589fa0-93c3-4632-99e2-2d36b592715b",
        "name": "Brand New Fashion",
        "created": 1655502702961
    },
    {
        "_id": "5bbdd136-43f3-4051-afc2-91e1dd03113d",
        "name": "70s and 80s Fashion",
        "created": 1655502702962
    }
]

// Rider
const data_rider = [
    {
        "_id": "e1c860f1-9098-4c1d-8172-d6ddefbbf66d",
        "name": "René",
        "created": 1655502702963
    },
    {
        "_id": "3173bd9e-595e-4777-8319-be2b58c49894",
        "name": "Olaf",
        "created": 1655502702964
    },
    {
        "_id": "84841fdb-5ee7-4ab2-be21-22cc31b7c73c",
        "name": "Angela",
        "created": 1655502702965
    }
]

// Shipment
const data_shipment = [
    // Initial shipment
    {
        "_id": "714e9835-c6cc-4c15-8fec-8be2249ac328",
        "created": 1655502702966,
        "customer": "2387647b-9c4f-4694-9498-cd19832e7cfb", // M&H
        "address": "Maximilianstraße 1, Munich",
        "status": "CREATED",
        "status_history": [
            {
                "date": 1655502702966,
                "status": "CREATED",
            }
        ],
        "location": {
            "lat": 50.1433,
            "long": 0.1233,
        },
        "location_history": [
            {
                "date": 1655502702966,
                "lat": 50.1433,
                "long": 0.1233,
            }
        ],
        "rider": null, // none selected yet
        "deleted": false,
        "__v": 0,
    },

    // Shipment in progress
    {
        "_id": "4118a238-b9ca-42d3-992c-8f3c659c0692",
        "created": 1655502702966,
        "customer": "2387647b-9c4f-4694-9498-cd19832e7cfb", // M&H
        "address": "Maximilianstraße 1, Munich",
        "status": "IN_PROGRESS",
        "status_history": [
            {
                "date": 1655502702966,
                "status": "CREATED",
            },
            {
                "date": 1655502703966,
                "status": "IN_PROGRESS",
            }
        ],
        "location": {
            "lat": 50.1433,
            "long": 1.1233,
        },
        "location_history": [
            {
                "date": 1655502702966,
                "lat": 50.1433,
                "long": 0.1233,
            },
            {
                "date": 1655502702966,
                "lat": 50.1433,
                "long": 1.1233,
            }
        ],
        "rider": "e1c860f1-9098-4c1d-8172-d6ddefbbf66d",
        "deleted": false,
        "__v": 0,
    },
]

async function run() {
    try {
        await client.connect();
        const db = client.db('api_service');

        const customer = db.collection('customer'); // creates
        await customer.insertMany(data_customer, { ordered: false });

        const rider = db.collection('rider');
        await rider.insertMany(data_rider, { ordered: false });

        const shipment = db.collection('shipment')
        await shipment.insertMany(data_shipment, { ordered: false });

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);