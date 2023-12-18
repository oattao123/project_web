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
          name: "Football Manager 2024",
          imageUrl:
          "https://www.gamesrig.com/img/index/football-manager-2024-cover.jpg",
          description:
               "Football Manager 2024 is a football management simulation video game developed by Sports Interactive and published by Sega. It was released worldwide for Microsoft Windows, macOS and Nintendo Switch on 9 November 2023.",
          price: 1299,
          countInStock: 10,
     },
     {
          name: "Sekiro: Shadows Die Twice - GOTY Edition",
          imageUrl:
          "https://www.gamesrig.com/img/index/sekiro-shadows-die-twice-goty-edition-cover.jpg",
          description:
               "Sekiro: Shadows Die Twice is an action-adventure video game developed by FromSoftware and published by Activision. The game was released worldwide for Microsoft Windows, PlayStation 4, and Xbox One on 22 March 2019.",
          price: 1290,
          countInStock: 10,
     },
     {
          name: "NBA 2K23",
          imageUrl:
          "https://www.gamesrig.com/img/index/nba-2k23-cover.jpg",
          description:
               "NBA 2K23 is a basketball simulation video game developed by Visual Concepts and published by 2K Sports, based on the National Basketball Association. It is the 23rd installment in the NBA 2K franchise and the successor to NBA 2K22.",
          price: 590,
          countInStock: 10,
     },
     {
          name: "God of War",
          imageUrl:
          "https://www.gamesrig.com/img/index/god-of-war-cover.jpg",
          description:
               "God of War is an action-adventure game developed by Santa Monica Studio and published by Sony Interactive Entertainment. Released on April 20, 2018, for the PlayStation 4 console, it is the eighth installment in the God of War series, the eighth chronologically, and the sequel to 2010's God of War III.",
          price: 899,
          countInStock: 10,
     },
     {
          name: "Hogwarts Legacy: Digital Deluxe Edition",
          imageUrl:
          "https://www.gamesrig.com/img/index/hogwarts-legacy-digital-deluxe-edition-cover.jpg",
          description:
               "Hogwarts Legacy is an upcoming action role-playing video game set in the late 1800s in the Wizarding World being developed by Avalanche Software and published by Warner Bros. Interactive Entertainment under its Portkey Games label.",
          price: 1290,
          countInStock: 10,
     },
     {
          name: "NBA 2K24 Kobe Bryant Edition",
          imageUrl:
          "https://www.gamesrig.com/img/index/nba-2k24-cover.jpg",
          description:
               "NBA 2K24 is a basketball simulation video game developed by Visual Concepts and published by 2K Sports, based on the National Basketball Association. It is the 24th installment in the NBA 2K franchise and the successor to NBA 2K23.",
          price: 790,
          countInStock: 10,
     },
     {
          name: "Resident Evil 4",
          imageUrl:
          "https://www.gamesrig.com/img/index/resident-evil-4-cover.jpg",
          description:
               "Resident Evil 4 is a third-person shooter game developed by Capcom Production Studio 4 and published by Capcom. The sixth major installment in the Resident Evil series, it was originally released for the GameCube in 2005.",
          price: 1490,
          countInStock: 10,
     },
     {
          name: "Home Sweet Home EP2",
          imageUrl:
          "https://www.gamesrig.com/img/index/home-sweet-home-ep2-cover.jpg",
          description:
               "Home Sweet Home EP2 is a first-person horror adventure game based on Thai myths and beliefs. The core gameplay focuses on storytelling and stealth to avoid perilous spirits hunting you. Moreover, few puzzles are added into the game, making gameplay more various.",
          price: 299,
          countInStock: 10,
     },
     {
          name: "Marvel’s Spider-Man: Miles Morales",
          imageUrl:
          "https://www.gamesrig.com/img/index/marvels-spider-man-miles-morales-cover.jpg",
          description:
               "Marvel's Spider-Man: Miles Morales is a dynamic action-adventure game featuring the young superhero Miles Morales. In this immersive gaming experience, players navigate Miles as he masters unique spider-like powers and faces challenges in a vividly rendered New York City.",
          price: 899,
          countInStock: 10,

     },
     {
          name: "Project Zomboid",
          imageUrl:
          "https://www.gamesrig.com/img/index/project-zomboid-cover.jpg",
          description:
               "Project Zomboid is an open world survival horror video game in alpha stage development by British and Canadian independent developer, The Indie Stone. The game is set in a post apocalyptic, zombie infested world where the player is challenged to survive for as long as possible before inevitably dying.",
          price: 299,
          countInStock: 10,
     },
     {
          name: "WWE 2K23",
          imageUrl:
          "https://www.gamesrig.com/img/index/wwe-2k23-cover.jpg",
          description:
               "WWE 2K23 is a professional wrestling video game developed by Visual Concepts and published by 2K Sports. It was released worldwide on October 22, 2023 for PlayStation 4, Xbox One and Microsoft Windows.",
          price: 790,
          countInStock: 10,
     },
     {
          name: "Brothers - A Tale of Two Sons",
          imageUrl:
          "https://www.gamesrig.com/img/index/brothers-a-tale-of-two-sons-cover.jpg",
          description:
               "Brothers: A Tale of Two Sons is an adventure game developed by Starbreeze Studios and published by 505 Games for Xbox 360, Microsoft Windows, PlayStation 3, PlayStation 4, Xbox One, iOS, Android, Windows Phone, and Nintendo Switch.",
          price: 299,
          countInStock: 10,
     },
     {
          name : "Mortal Kombat 1 Premium Edition",
          imageUrl:
          "https://www.gamesrig.com/img/index/mortal-kombat-1-premium-edition-cover.jpg",
          description:
               "Mortal Kombat 1 Premium Edition is a fighting game developed by NetherRealm Studios and published by Warner Bros. Interactive Entertainment. It is the eleventh main installment in the Mortal Kombat series and a sequel to 2015's Mortal Kombat X.",
          price: 1290,
          countInStock: 10,
     },
     {
          name: "Squad",
          imageUrl:
          "https://www.gamesrig.com/img/index/squad-cover.jpg",
          description:
               "Squad is a tactical first-person shooter video game developed by Canadian studio Offworld Industries. It is self-published through Steam and is a spiritual successor to the multi-award-winning Project Reality modification for Battlefield 2.",
          price: 299,
          countInStock: 10,
     },
     {
          name: "Marvel’s Spider-Man Remastered",
          imageUrl:
          "https://www.gamesrig.com/img/index/marvels-spider-man-remastered-cover.jpg",
          description:
               "Marvel's Spider-Man Remastered is an updated version of the acclaimed action-adventure game. It features enhanced graphics and improved gameplay mechanics, allowing players to experience the story of Peter Parker as Spider-Man in a visually stunning and more responsive New York City. The remaster includes the base game and previously released DLCs.",
          price: 1290,
          countInStock: 10,
     },
     {
          name: "Back 4 Blood",
          imageUrl:
          "https://www.gamesrig.com/img/index/back-4-blood-cover.jpg",
          description:
               "Back 4 Blood is a first-person shooter game developed by Turtle Rock Studios and published by Warner Bros. Interactive Entertainment. It is a spiritual successor to Left 4 Dead, also developed by Turtle Rock Studios.",
          price: 290,
          countInStock: 10,
     },
     {
          name: "Attack on Titan 2: Final Battle",
          imageUrl:
               "https://www.gamesrig.com/img/index/attack-on-titan-2-cover.jpg",
          description:
               "Attack on Titan 2: Final Battle is an action hack and slash video game based on Hajime Isayama's manga series of the same name released for Nintendo Switch, PlayStation 4, PlayStation Vita, Xbox One, Microsoft Windows and Stadia.",
          price: 1199,
          countInStock: 10,
     },
     {
          name: "Battlefield 2042",
          imageUrl:
               "https://www.gamesrig.com/img/index/battlefield-2042-cover.jpg",
          description:
               "Battlefield 2042 is a first-person shooter video game developed by EA DICE and published by Electronic Arts. It is the seventeenth installment in the Battlefield series and the successor to 2018's Battlefield V.",
          price: 999,
          countInStock: 10,
     },
     {
          name: "Final Fantasy XV Episode Ardyn Complete Edition",
          imageUrl:
               "https://www.gamesrig.com/img/index/final-fantasy-xv-episode-ardyn-complete-edition-cover.jpg",
          description:
               "Final Fantasy XV is an action role-playing game developed and published by Square Enix as part of the Final Fantasy series. It was released for the PlayStation 4 and Xbox One in 2016, Microsoft Windows in 2018, and Stadia as a launch title in 2019.",
          price: 1290,
          countInStock: 10,
     },
     {
          name: "Don't Starve Together",
          imageUrl:
               "https://www.gamesrig.com/img/index/dont-starve-together-cover.jpg",
          description:
               "Don't Starve Together is a multiplayer survival video game developed by Klei Entertainment. It is a standalone multiplayer expansion of the uncompromising survival game Don't Starve.",
          price: 299,
          countInStock: 10,
     },
     {
          name: "Gotham Knights",
          imageUrl:
               "https://www.gamesrig.com/img/index/gotham-knights-cover.jpg",
          description:
               "Gotham Knights is an upcoming action role-playing video game based on the DC Comics character Batman and his supporting cast. The game is being developed by WB Games Montréal and will be published by Warner Bros. Interactive Entertainment.",
          price: 290,
          countInStock: 10,

     },
     {
          name: "Hatsune Miku: Project DIVA Mega Mix+",
          imageUrl:
               "https://www.gamesrig.com/img/index/hatsune-miku-project-diva-mega-mix-cover.jpg",
          description:
               "Hatsune Miku: Project DIVA Mega Mix is a rhythm game developed and published by Sega for the Nintendo Switch. The game is a port of Hatsune Miku: Project DIVA Future Tone, containing over 100 songs, 300 modules, and Arcade Mode.",
          price: 799,
          countInStock: 10,
     },
     {
          name: "Farm Together",
          imageUrl:
               "https://www.gamesrig.com/img/index/farm-together-cover.jpg",
          description:
               "Farm Together is a farming simulation video game developed by Milkstone Studios and published by Milkstone Studios SL. The game was released for Microsoft Windows on 11 October 2018, for Xbox One on 1 March 2019, and for PlayStation 4 on 6 November 2019.",
          price: 299,
          countInStock: 10,

     },
     {
          name: "The Henry Stickmin Collection",
          imageUrl:
               "https://www.gamesrig.com/img/index/the-henry-stickmin-collection-cover.jpg",
          description:
               "The Henry Stickmin Collection is a Newgrounds choose-your-own-path classic, reborn and revitalized. This 6-game epic culminates in multiple entirely canon, extremely different endings. Each step of the journey has you choose from options such as a Teleporter or calling in your buddy Charles to help you out.",
          price: 199,
          countInStock: 10,
     },

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

const importData = async () => {
     try {
          await Producto.deleteMany()
          await Producto.insertMany(products)
          console.log('Data importada')
          process.exit()
     } catch (error) {
          console.error('Error importando data')
          process.exit(1)
     }
}

importData()

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
