const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')
const fs = require('fs').promises
const path = require('path')
const port = 3000

const moment = require('moment');
require('moment/locale/id');

const upload = require('./middleware/uploadFile')

const { Sequelize, where } = require('sequelize')
const sequelize = new Sequelize('personal_web', 'postgres', 'karapay02', {
    host: 'localhost',
    dialect: 'postgres'
})

const { Projects } = require('./models')
const { User } = require('./models')

app.use(session({
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 2 * 60 * 60 * 1000
    },
    resave: false,
    store: session.MemoryStore(),
    secret: 'session_storage',
    saveUninitialized: true
}))
app.use(flash())


app.set('view engine', 'hbs')
app.set('views', 'src/views')

app.use('/assets', express.static('src/assets'))
app.use(express.urlencoded({ extended: false }))

app.get('/', home)
app.get('/register', formRegister)
app.post('/register', addRegister)
app.get('/login', formLogin)
app.post('/login', isLogin)
app.get('/contact', contact)
app.get('/add-project', addProject)
app.post('/add-project',upload.single('image'), addPostProject)
app.get('/detail-project/:id', detailProject)
app.get('/edit-project/:id', editProject)
app.post('/edit-project/:id',upload.single('image'), updateProject)
app.get('/delete/:id', deleteProject)
app.get('/logout', logoutUser)



async function home(req, res) {
    try {
        // let query;
        // if (req.session.isLogin) {
        //     query = `SELECT * FROM "Projects" WHERE "userId" = ${req.session.userId}`;
        // } else {
        //     query = `SELECT * FROM "Projects"`;
        // }
        // const [data] = await sequelize.query(query); 
    // SELECT * FROM  projects where userId = userId LEFT JOIN User ON Projects.userId
    let data;
    if (req.session.isLogin) {
        data = await Projects.findAll({
            where: {
                userId: req.session.userId,
            },
            include: User
        })
    } else {
        data = await Projects.findAll({
            include: User
        });
    }
      res.render('index',{
        data,
        title: 'Home',
        isLogin: req.session.isLogin,
        user: req.session.user,
        
    })
    } catch (error) {
      console.error('Error rendering home page:', error);
      res.status(500).send('Internal Server Error');
    }
  }
  
  module.exports = {
    home,
  };


function formRegister(req, res) {
    if (req.session.isLogin) {
        res.redirect('/')
    }
    res.render('register', { title: 'Register Account' })
}

async function addRegister(req, res) {
    try {
        const { firstName, lastName, email, password } = req.body
        const salt = 10
        const hashPassword = await bcrypt.hash(password, salt)
        const data = {
            firstName,
            lastName,
            email,
            password: hashPassword
        }
        await User.create(data)
        res.redirect('/login')
    } catch (error) {
        console.error(error)
    }
}

function formLogin(req, res) {
    if (req.session.isLogin) {
        res.redirect('/')
    }
    res.render('login', { title: 'Login Account' })
}

async function isLogin(req, res) {
    try {
        const { email, password } = req.body
        const checkEmail = await User.findOne({ where: { email: email } })
        if (!checkEmail){
            req.flash('failed', 'Email not registered')
            res.redirect('/login')
        }
        const checkPassword = await bcrypt.compare(password, checkEmail.password)
        if (!checkPassword){
            req.flash('failed', 'Wrong password')
            res.redirect('/login')
        } else {
            req.session.isLogin = true
            req.session.user = checkEmail.firstName
            req.session.userId = checkEmail.id
            
            req.flash('success', 'Welcome Bro')
            res.redirect('/')
        }
    } catch (error) {
        console.error(error)
    }
}

function logoutUser(req, res) {
    req.session.destroy()
    res.redirect('/login')    
}

function contact(req, res) {
    res.render('contact', {
        title: 'Contact',
        isLogin: req.session.isLogin,
        user: req.session.user
    })
}

function addProject(req, res) {
    if (!req.session.isLogin) {
        res.redirect('/login')
    }
    res.render('add-project', {
        title: 'Add Project',
        isLogin: req.session.isLogin,
        user: req.session.user
    })
}


async function addPostProject(req, res) {
    try {
        const startDate = new Date(req.body.startdate)
        const endDate = new Date(req.body.enddate)
        const diffTime = endDate - startDate
    
        let countDuration = diffTime / (1000 * 60 * 60 * 24)
        let duration = ''
        if (countDuration > 29){
            countDuration = Math.floor(countDuration / 30)
            duration = countDuration + " Bulan"
        }else{
            duration = countDuration + " Hari"
        }

        const dataProject = {
            project_name: req.body.project_name,
            description: req.body.description,
            startdate: req.body.startdate,
            enddate: req.body.enddate,
            nodejs: req.body.nodejs,
            golang: req.body.golang,
            vuejs: req.body.vuejs,
            reactjs: req.body.reactjs,
            image: req.file.filename,
            userId: req.session.userId,
            duration: duration
        }
        await Projects.create(dataProject)
        res.redirect('/')
    } catch (error) {
        console.error('Insert data failed',error)
    }
}


async function detailProject(req, res) {
    const { id } = req.params
    const data = await Projects.findByPk(id)
    const dataUser = await User.findByPk(data.userId)

    const formatStartdate = moment(data.startdate).format('DD MMMM YYYY')
    const formatEnddate = moment(data.enddate).format('DD MMMM YYYY')
    if (!data) {  //data===null
        return res.status(404).send('Project not found')
    } else {
        res.render('detail-project', {
            data,
            dataUser,
            formatStartdate,
            formatEnddate,
            title: 'Detail Project',
            isLogin: req.session.isLogin,
            user: req.session.user,
        })
    }
    
}
async function editProject(req, res) {
    if (!req.session.isLogin) {
        res.redirect('/login')
    }
    const { id } = req.params
    const data = await Projects.findByPk(id);

    res.render('edit-project', {
        data,
        title: 'Edit Project',
        isLogin: req.session.isLogin,
        user: req.session.user
    })
}


async function updateProject(req, res) {
    try {
        const { id } = req.params;

        const dataProject = await Projects.findOne({
            where: {
                id : id
            }
        })
        if (dataProject){
            const { project_name, description, startdate, enddate, nodejs, golang, vuejs, reactjs } = req.body

            const startDate = new Date(startdate)
            const endDate = new Date(enddate)
            const diffTime = endDate - startDate
        
            let countDuration = diffTime / (1000 * 60 * 60 * 24)
            let duration = ''
            if (countDuration > 29){
                countDuration = Math.floor(countDuration / 30)
                duration = countDuration + " Bulan"
            }else{
                duration = countDuration + " Hari"
            }

            if (req.file) {
                // ambil nama file gambar
                image = req.file.filename;
              
                // Hapus file lama jika ada
                if (dataProject.image) {
                  const imageDirectory = path.join('src/assets/file', dataProject.image)
                  try {
                    await fs.unlink(imageDirectory)
                  } catch (error) {
                    console.error("Error deleting image:", error);
                  }
                }
              } else {
                // Jika tidak ada file baru, gunakan file lama
                image = dataProject.image; 
              }
              
              // Simpan file yang baru
              const newImageFilePath = path.join('src/assets/file', image)
              console.log('newImage:', newImageFilePath)
              
            
            await Projects.update({
                project_name,
                description,
                startdate,
                enddate,
                nodejs,
                golang,
                vuejs,
                reactjs,
                duration,
                image
            },{where: {id:id}})
        }else{
            return res.status(404).send('Project not found');
        }

            res.redirect('/')
    } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).send("Internal Server Error");
    }
}


async function deleteProject(req, res) {
    if (req.session.isLogin) {
        const { id } = req.params;
        
        try {
            // Mendapatkan nama file gambar dari database
            const project = await Projects.findOne({
                where: {
                    id: id
                }
            });

            if (!project) {
                return res.status(404).send('Project not found');
            }
            // Path file gambar
            const imagePath = `src/assets/file/${project.image}`;

            // Menghapus file gambar
            await fs.unlink(imagePath);

            await Projects.destroy({
                where: {
                    id: id
                }
            });

            res.redirect('/');
        } catch (error) {
            console.error("Error deleting project:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    res.redirect('/login')
}


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})