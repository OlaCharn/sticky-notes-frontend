import axios from "axios";

const MyURL = "https://sticky-notes-node-backend-1.onrender.com"
const saveNoteEndpoint = "/saveNote";
const editNoteEndpoint = "/editNote";
const deleteNoteEndpoint = "/deleteNote";
//"http://localhost:3000"
//"http://localhost:3000/saveNote"
//"http://localhost:3000/editNote"
//"http://localhost:3000/deleteNote"


const getAllNotes = (setmyNote)=>{
    axios.get(`${MyURL}`)
    .then(({data}) => {
        console.log("Data from server:", data); // Добавьте эту строку
        setmyNote(data);
    })
    .catch(error => {
        console.error("Error during Axios GET request:", error);
    });
};

const addNote = (title, setTitle, setmyNote) =>{
    axios.post(`${MyURL}${saveNoteEndpoint}` , { title })
    .then((data)=>{
        console.log(data);
        setTitle("");
        getAllNotes(setmyNote);
    })
}

const editNote = (noteId, title, setTitle, setmyNote, setEditing) =>{
    axios.post(`${MyURL}${editNoteEndpoint}`, { _id: noteId, title })
    .then((data) =>{
        console.log(data);
        setTitle("");
        setEditing(false);
        getAllNotes(setmyNote);
    })
}
const deleteNote = (_id, setmyNote)=>{
    axios.post(`${MyURL}${deleteNoteEndpoint}`, {_id }) 
        .then((data)=>{
        console.log(data);
        getAllNotes(setmyNote);
    })
}
export { getAllNotes, addNote, editNote, deleteNote };
