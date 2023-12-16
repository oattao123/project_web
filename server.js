require('dotenv').config()
const bcrypt = require('bcryptjs')
const express = require('express')
const cors = require('cors')
const router = express.Router();

const mongoose = require('mongoose')

const conectarDB = async () => {
     try {
     await mongoose.connect(process.env.DB_MONGO, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
     })
     console.log('DB Conectada')
     } catch (error) {
     console.log('Hubo un error')
     console.log(error)
     process.exit(1) // Detener la app
     }
     }

conectarDB();


const app = express()
app.use(cors())
app.use(express.json())


const getUsers = async (req, res) => {
     try {
          const users = await User.find()
          res.json(users)
     } catch (error) {
          console.log(error)
          res.status(500).send('Hubo un error')
     }
}

const getUserById = async (req, res) => {
     try {
          const user = await User.findById(req.params.id)
          res.json(user)
     } catch (error) {
          console.log(error)
          res.status(500).send('Hubo un error')
     }
}

const getUserByName = async (req, res) => {
     try {
          const user = await User.findOne({ username: req.params.username })
          res.json(user)
     }
     catch (error) {
          console.log(error)
          res.status(500).send('Hubo un error')
     }
}

module.exports = {
     getUsers,
     getUserById,
     getUserByName
}

const userSchema = mongoose.Schema({
     username: {
          type: String,
          required: true,
          unique: true
     },
     firstName: {
          type: String,
          required: true
     },
     lastName: {
          type: String,
          required: true
     },
     email: {
          type: String,
          required: true,
          unique: true
     },
     password: {
          type: String,
          required: true
     },
})

const User = mongoose.model('User', userSchema)

// Register User
router.post('/register', async (req, res) => {
     try {
         const { username, firstName, lastName, email, password } = req.body;
 
         // Check if user already exists
         const existingUser = await User.findOne({ email });
         if (existingUser) {
             return res.status(400).json({ msg: 'El usuario ya existe' });
         }
 
         // Hash the password
         const hashedPassword = await bcrypt.hash(password, 10);
 
         // Create a new user
         const user = new User({
             username,
             firstName,
             lastName,
             email,
             password: hashedPassword
         });
 
         // Save the user
         await user.save();
 
         res.json({ msg: 'Usuario creado correctamente' });
     } catch (error) {
         console.log(error);
         res.status(500).send('Hubo un error');
     }
 });

// Login User
router.post('/login', async (req, res) => {
     try {
         const { email, password } = req.body;
 
         // Find user by email
         const user = await User.findOne({ email });
         if (!user) {
             return res.status(400).json({ msg: 'El usuario no existe' });
         }
 
         // Check password
         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) {
             return res.status(400).json({ msg: 'Credenciales incorrectas' });
         }
 
         // Login successful
         res.json({ msg: 'Login correcto' });
     } catch (error) {
         console.log(error);
         res.status(500).send('Hubo un error');
     }
 });

// Get ALL User
router.get('/users', async (req, res) => {
     try {
          const users = await User.find()
          res.json(users)
     } catch (error) {
          console.log(error)
          res.status(500).send('Hubo un error')
     }
})

// Get User by ID
router.get('/user/:id', async (req, res) => {
     try {
          const user = await User.findById(req.params.id)
          res.json(user)
     } catch (error) {
          console.log(error)
          res.status(500).send('Hubo un error')
     }
})




const getProductos = async (req, res) => {
     try {
          const productos = await Producto.find()
          res.json(productos)
     } catch (error) {
          console.log(error)
          res.status(500).send('Hubo un error')
     }
}

const getProductoById = async (req, res) => {
     try {
          const producto = await Producto.findById(req.params.id)
          res.json(producto)
     } catch (error) {
          console.log(error)
          res.status(500).send('Hubo un error')
     }
}

module.exports = {
     getProductos,
     getProductoById
}

const getProductoByName = async (req, res) => {
     try {
          const producto = await Producto.findOne({ name: req.params.name })
          res.json(producto)
     }
     catch (error) {
          console.log(error)
          res.status(500).send('Hubo un error')
     }
}



const productoSchema = mongoose.Schema({
     name : {
          type: String,
          required: true,
     },
     description : {
          type: String,
          required: true,
     },
     price : {
          type: Number,
          required: true,
     },
     countInStock : {
          type: Number,
          required: true,
     },
     imageUrl : {
          type: String,
          required: true,
     }
})

const Producto = mongoose.model('Producto', productoSchema)

module.exports = Producto

const products = [
     {
       name: "PlayStation 5",
       imageUrl:
         "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80",
       description:
         "PlayStation 5 (PS5) is a home video game console developed by Sony Interactive Entertainment. Announced in 2019 as the successor to the PlayStation 4, the PS5 was released on November 12, 2020 in Australia, Japan, New Zealand, North America, Singapore, and South Korea, and November 19, 2020 onwards in other major markets except China and India.",
       price: 499,
       countInStock: 15,
     },
     {
       name: "Iphone 12",
       imageUrl:
         "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1463&q=80",
       description:
         "Welcome to a new era of iPhone. Beautifully bright 6.1-inch Super Retina XDR display.1 Ceramic Shield with 4x better drop performance.2 Incredible low-light photography with Night mode on all cameras. Cinema-grade Dolby Vision video recording, editing, and playback. Powerful A14 Bionic chip. And new MagSafe accessories for easy attach and faster wireless charging.3 Let the fun begin.",
       price: 1099,
       countInStock: 10,
     },
     {
       name: "Cannon EOS-1D",
       imageUrl:
         "https://images.unsplash.com/photo-1519183071298-a2962feb14f4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
       description:
         "The EOS-1D X combines speed with image quality, to create the next generation camera for professionals. Full frame 18 megapixel sensor with Dual “DIGIC 5+” processors sets the standard, and up to 12 frames per second shooting takes it beyond.",
       price: 1300,
       countInStock: 5,
     },
     {
       name: "Amazon Alexa",
       imageUrl:
         "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80",
       description:
         "It is capable of voice interaction, music playback, making to-do lists, setting alarms, streaming podcasts, playing audiobooks, and providing weather, traffic, sports, and other real-time information, such as news. Alexa can also control several smart devices using itself as a home automation system.",
       price: 50,
       countInStock: 25,
     },
     {
       name: "Audio Technica Headphones",
       imageUrl:
         "https://images.unsplash.com/photo-1558756520-22cfe5d382ca?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
       description:
         "Outfitted with 45mm large-aperture dynamic drivers and an over-ear, closed-back design, the ATH-M50x headphones deliver clarity, deep bass, and extended bandwidth (15 Hz to 28 kHz) while isolating you from outside sounds.",
       price: 233,
       countInStock: 4,
     },
     {
       name: "JBL FLIP 4",
       imageUrl:
         "https://images.unsplash.com/photo-1564424224827-cd24b8915874?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80",
       description:
         "JBL Flip 4 is the next generation in the award-winning Flip series; it is a portable Bluetooth speaker that delivers surprisingly powerful stereo sound. This compact speaker is powered by a 3000mAh rechargeable Li-ion battery that offers up to 12 hours of continuous, high-quality audio playtime.",
       price: 140,
       countInStock: 10,
     },
     {
          name: "Samsung Galaxy S21",
          imageUrl:
            "https://images.unsplash.com/photo-1610366525881-5a6c4c3a9a3c?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8c2Ftc3VuZyUyMGdhbGF4eSUyMHN2YXJpZXMlMjBzZWVrZXJ8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
          description:
               "Samsung Galaxy S21 is a line of Android-based smartphones designed, developed, marketed, and manufactured by Samsung Electronics as part of its Galaxy S series. They collectively serve as the successor to the Galaxy S20 and were released on 29 January 2021.",
          price: 799,
          countInStock: 10,
     }
   ];
   
   module.exports = products;

// // Get ALL Productos
// router.get('/productos', async (req, res) => {
//      try {
//          const products = await Producto.find({});
//          res.json(products);
//      } catch (error) {
//          console.error(error);
//          res.status(500).send('Error on the server.');
//      }
//  });

// // Get Producto by Name
// router.get('/producto/:name', async (req, res) => {
//      try {
//          const productName = req.params.name;
//          const product = await Producto.findOne({ name: productName });
//          if (!product) {
//              return res.status(404).send('Product not found.');
//          }
//          res.json(product);
//      } catch (error) {
//          console.error(error);
//          res.status(500).send('Error on the server.');
//      }
//  });

router.get("/", getProductos);
router.get("/:id", getProductoById);

// const importData = async () => {
//      try {
//           await Producto.deleteMany()
//           await Producto.insertMany(products)
//           console.log('Data importada')
//           process.exit()
//      } catch (error) {
//           console.error('Error importando data')
//           process.exit(1)
//      }
// }

// importData()

app.get('/', (req, res) => {
     res.send('Hola Mundo')
})

app.get ('/api', (req, res) => {
     res.send('Hola API')
}
)

app.get('/api/users', getUsers)
app.get('/api/user/:id', getUserById)

app.get('/api/productos', getProductos)
app.get('/api/producto/:name', getProductoByName)

const port = process.env.PORT || 5002

app.listen(port, () => {
     console.log(`Servidor funcionando en el puerto ${port}`)
})
