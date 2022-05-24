const mongoose = require('mongoose');
const service = require('../models/services');
const Service = service.Service;
const data = require('./gb.json');
const { priceRangeArray, nameA, nameB, categoryArray } = require('./seedHelp.js')

mongoose.connect('mongodb+srv://RatedPeople:2pnpE8HibM91lmRE@cluster0.m1rlj.mongodb.net/?retryWrites=true&w=majority');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

function convertToSlug(Text) {
  return Text.toLowerCase()
             .replace(/[^\w ]+/g, '')
             .replace(/ +/g, '-');
}


const seedDB = async () => {
    await Service.deleteMany({});
    for (let i = 1; i < 500; i++) {
        const randome1000 = Math.floor(Math.random() * 1000);
        const randome4 = Math.floor(Math.random() * 4);
        const price = Math.floor(Math.random() * 20) + 10;
        const title = `${sample(nameA)}, ${sample(nameB)}`;
        const category = sample(categoryArray);
        const location = `${data[randome1000].city}, ${data[randome1000].country}`;
        const serv = new Service({
            location: location,
            geometry: {
                type: "Point",
                coordinates: [
                data[randome1000].lng,
                data[randome1000].lat
            ]},
            title: title,
            url: convertToSlug(title),
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa est dolorum, alias totam assumenda magni iure magnam voluptas delectus, tempore dicta qui quae hic aliquam eum temporibus voluptates, soluta tempora. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi vel expedita accusamus iusto ratione accusantium voluptate molestias earum? Nemo mollitia fugiat nisi obcaecati sed, quos est facilis excepturi numquam eaque!',
            priceRange: priceRangeArray[randome4],
            serviceCategory: {
                name: category.name,
                slug: category.slug
            },
            images: [
                    {
                    url: 'https://res.cloudinary.com/dqcioken9/image/upload/v1651664980/RatedPeople/vi6arc8ni6i1pipbrsrc.webp',
                    filename: 'RatedPeople/vi6arc8ni6i1pipbrsrc',
                    },
                    {
                    url: 'https://res.cloudinary.com/dqcioken9/image/upload/v1651664980/RatedPeople/jawc7baekz0ml38fzdmo.jpg',
                    filename: 'RatedPeople/jawc7baekz0ml38fzdmo',
                    }
                ],
            author: "628bbfc19dd35ba1847fb5ee"
        });
        await serv.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})