const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());


//connecting mongodb
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
    console.log('DB connection successful')
})
.catch((err)=>{
    console.log('error')
})

const todoschema=new mongoose.Schema({
    title:{
        required:true,
        type:String
    },
    description:String
})

const todomodel=mongoose.model('Todo',todoschema);

//create
app.post('/todos',async(req,res)=>{
    const {title,description}=req.body;
    try{
        const newtodo=new todomodel({title,description});
        await newtodo.save();
        res.status(201).json(newtodo);


    }catch(error){
        console.log(error);
        res.status(500).json({message:error.message});


    }
    
    
})

//get
app.get('/todos',async(req,res)=>{
    try{
        const todos=await todomodel.find();
        res.json(todos);
    }catch(error){
        res.status(500).json({message:error.message});

    }
})

//update
app.put('/todos/:id',async(req,res)=>{
    try{
        const {title,description}=req.body;
        const id=req.params.id;
        const updatetodo= await todomodel.findByIdAndUpdate(
            id,
            {title,description},
            {new:true}
        )
        if(!updatetodo){
            return res.status(404).json({message:"Todo not found"})
        }
        res.json(updatetodo)

    }catch(error){
        console.log(error);
        res.status(500).json({message:error.message});

    }
    

})

//delete
app.delete('/todos/:id',async(req,res)=>{
    try{
        const id=req.params.id;
        await todomodel.findByIdAndDelete(id);
        res.status(204).end();

    }catch(error){
        console.log(error);
        res.status(500).json({message:error.message});

    }
    
})

const port =8000;
app.listen(port,()=>{
    console.log('server is listening to port '+port);
})