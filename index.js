const express = require('express')
const app = express()
const port = 3000


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


const data = []

function home(req, res) {
    res.render('index', {data, title: 'Home'}) 
}

function contact(req, res) {
    res.render('contact', {title: 'Contact'})
}

function addProject(req, res) {
    res.render('add-project', {title: 'Add Project'})
}

function addPostProject(req, res) {
    const date = new Date()
    const year = date.getFullYear()
    const startDate = new Date(req.body.startdate)
    const endDate = new Date(req.body.enddate)
    const diffTime = endDate - startDate

    let duration = diffTime / (1000 * 60 * 60 * 24)

    let durationResult = ''
    if (duration > 29){
        duration = Math.floor(duration / 30)
        durationResult = duration + " Bulan"
    }else{
        durationResult = duration + " Hari"
    }

    const image = "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg"
    

    const {projectname, description, nodejs, golang, vuejs, reactjs, startdate, enddate  } = req.body
    const id = data.length + 1;

    data.push({id, projectname, description, nodejs, golang, vuejs, reactjs, year , image , startdate, enddate, durationResult })

    res.redirect('/')
}

function detailProject(req, res) {
    const { id } = req.params
    const dataDetail = data[id]

    res.render('detail-project', { data: dataDetail, title: 'Detail Project' })
}

function editProject(req, res) {
    const { id } = req.params
    const dataEdit = data[id]

    res.render('edit-project', { data: dataEdit, title: 'Edit Project' })
}

function updateProject(req, res) {
    const { id } = req.params;
    const { projectname, description, nodejs, golang, vuejs, reactjs, startdate, enddate } = req.body;

    const year = new Date().getFullYear();
    const startDate = new Date(startdate);
    const endDate = new Date(enddate);
    const diffTime = endDate - startDate;

    let duration = diffTime / (1000 * 60 * 60 * 24);

    let durationResult = '';
    if (duration > 29){
        duration = Math.floor(duration / 30);
        durationResult = duration + " Bulan";
    } else {
        durationResult = duration + " Hari";
    }

    const image = "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg" //gambar default
    
    // Temukan indeks data yang akan diupdate berdasarkan ID
    const dataIndex = data.findIndex(item => item.id == id);

    if (dataIndex !== -1) {
        // Update data jika ID ditemukan menggunakan data.splice
        const updatedData = {
            id,
            projectname,
            description,
            year,
            image,
            nodejs,
            golang,
            vuejs,
            reactjs,
            startdate,
            enddate,
            durationResult
        };

        // Update data
        data.splice(dataIndex, 1, updatedData);
    }

    res.redirect('/');
}

function deleteProject(req, res) {
    const { id } = req.params

    data.splice(id, 1)
    res.redirect('/')
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})