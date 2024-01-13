const express = require('express')
const app = express()
const port = 3000


app.set('view engine', 'hbs')
app.set('views', 'src/views')

app.use('/assets', express.static('src/assets'))

app.get('/', home)
app.get('/contact', contact)
app.get('/project', project)
app.get('/project-detail/:id', projectDetail)


function home(req, res) {
  
const data = [
    {
        id: 1,
        title: "Ravi App",
        image: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg",
        year: "2024",
        description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        duration: "3 bulan",
    },
    {
        id: 2,
        title: "Mugiwara",
        image: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        year: "2024",
        description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        duration: "2 bulan",
    },
    {
        id: 3,
        title: "Dumbways App",
        image: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg",
        year: "2024",
        description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        duration: "1 bulan",
    }
]
    res.render('index', {data}) 
}

function contact(req, res) {
    res.render('contact')
}

function project(req, res) {
    res.render('project')
}

function projectDetail(req, res) {
    const { id } = req.params

    res.render('project-detail', { id })
}


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})