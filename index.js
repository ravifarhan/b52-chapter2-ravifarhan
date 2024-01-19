const express = require('express')
const app = express()
const port = 3000


const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('personal_web', 'postgres', 'karapay02', {
    host: 'localhost',
    dialect: 'postgres'
})

const { Projects } = require('./models')



app.set('view engine', 'hbs')
app.set('views', 'src/views')

app.use('/assets', express.static('src/assets'))
app.use(express.urlencoded({ extended: false }))

app.get('/', home)
app.get('/contact', contact)
app.get('/add-project', addProject)
app.post('/add-project', addPostProject)
app.get('/detail-project/:id', detailProject)
app.get('/edit-project/:id', editProject)
app.post('/edit-project/:id', updateProject)
app.get('/delete/:id', deleteProject)


// const data = []

// function home(req, res) {
//     res.render('index', {data, title: 'Home'}) 
// }

// async function home(req, res) {
//     try {
//       await sequelize.authenticate();
//       console.log('Koneksi Sukses');
//       res.render('index', { data, title: 'Home' });
//     } catch (error) {
//       console.error('Unable to connect to the database:', error);
//       res.status(500).send('Internal Server Error'); // Menambahkan respons kesalahan jika koneksi gagal
//     }
//   }
  
//   module.exports = home;

async function home(req, res) {
    try {
      const data = await Projects.findAll()
      res.render('index', { data, title: 'Home' });
    } catch (error) {
      console.error('Error rendering home page:', error);
      res.status(500).send('Internal Server Error');
    }
  }
  
  module.exports = {
    home,
  };

// async function home(req, res) {
//    try {
    
//     const [results] = await sequelize.query('SELECT * FROM "Projects"')
    
//     res.render('index', { results, title: 'Home' })
//    } catch (error) {
//     console.error(error)
//    }
// }


function contact(req, res) {
    res.render('contact', {title: 'Contact'})
}

function addProject(req, res) {
    res.render('add-project', {title: 'Add Project'})
}

// function addPostProject(req, res) {
//     const date = new Date()
//     const year = date.getFullYear()
//     const startDate = new Date(req.body.startdate)
//     const endDate = new Date(req.body.enddate)
//     const diffTime = endDate - startDate

//     let duration = diffTime / (1000 * 60 * 60 * 24)

//     let durationResult = ''
//     if (duration > 29){
//         duration = Math.floor(duration / 30)
//         durationResult = duration + " Bulan"
//     }else{
//         durationResult = duration + " Hari"
//     }

//     const image = "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg"
    

//     const {projectname, description, nodejs, golang, vuejs, reactjs, startdate, enddate  } = req.body
//     const id = data.length + 1;

//     data.push({id, projectname, description, nodejs, golang, vuejs, reactjs, year , image , startdate, enddate, durationResult })

//     res.redirect('/')
// }
async function addPostProject(req, res) {
    try {
        const date = new Date()
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

        const image = "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg"

        const dataProject = {
            project_name: req.body.project_name,
            description: req.body.description,
            startdate: req.body.startdate,
            enddate: req.body.enddate,
            nodejs: req.body.nodejs,
            golang: req.body.golang,
            vuejs: req.body.vuejs,
            reactjs: req.body.reactjs,
            image: image,
            duration: duration
        }
        await Projects.create(dataProject)
        res.redirect('/')
    } catch (error) {
        console.error('Insert data failed',error)
    }
}


// function detailProject(req, res) {
//     const { id } = req.params
//     const dataDetail = data[id]

//     res.render('detail-project', { data: dataDetail, title: 'Detail Project' })
// }
async function detailProject(req, res) {
    const { id } = req.params
    const data = await Projects.findByPk(id);
    if (!data) {  //data===null
        return res.status(404).send('Project not found')
    } else {
      res.render('detail-project', { data, title: 'Detail Project' })
    }
    
}
async function editProject(req, res) {
    const { id } = req.params
    const data = await Projects.findByPk(id);

    res.render('edit-project', { data, title: 'Edit Project' })
}

// function updateProject(req, res) {
//     const { id } = req.params;
//     const { projectname, description, nodejs, golang, vuejs, reactjs, startdate, enddate } = req.body;

//     const year = new Date().getFullYear();
//     const startDate = new Date(startdate);
//     const endDate = new Date(enddate);
//     const diffTime = endDate - startDate;

//     let duration = diffTime / (1000 * 60 * 60 * 24);

//     let durationResult = '';
//     if (duration > 29){
//         duration = Math.floor(duration / 30);
//         durationResult = duration + " Bulan";
//     } else {
//         durationResult = duration + " Hari";
//     }

//     const image = "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg" //gambar default
    
//     // Temukan indeks data yang akan diupdate berdasarkan ID
//     const dataIndex = data.findIndex(item => item.id == id);

//     if (dataIndex !== -1) {
//         // Update data jika ID ditemukan menggunakan data.splice
//         const updatedData = {
//             id,
//             projectname,
//             description,
//             year,
//             image,
//             nodejs,
//             golang,
//             vuejs,
//             reactjs,
//             startdate,
//             enddate,
//             durationResult
//         };

//         // Update data
//         data.splice(dataIndex, 1, updatedData);
//     }

//     res.redirect('/');
// }
async function updateProject(req, res) {
    try {
            const { id } = req.params;
        
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
        
            const image = "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg" //gambar default
        
            const dataProject = {
                project_name: req.body.project_name,
                description: req.body.description,
                startdate: req.body.startdate,
                enddate: req.body.enddate,
                nodejs: req.body.nodejs,
                golang: req.body.golang,
                vuejs: req.body.vuejs,
                reactjs: req.body.reactjs,
                image: image,
                duration: duration
            }
            await Projects.update(dataProject, {
                where: {
                    id: id
                }
            })
            res.redirect('/')
    } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).send("Internal Server Error");
    }
}



// function deleteProject(req, res) {
//     const { id } = req.params

//     data.splice(id, 1)
//     res.redirect('/')
// }

async function deleteProject(req, res) {
    const { id } = req.params;

    try {
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


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})