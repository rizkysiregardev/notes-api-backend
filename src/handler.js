const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, h) => {
    // get request from client using payload
    const {title, tags, body} = request.payload;

    // make random id 
    const id = nanoid(16);
    const createAt = new Date().toISOString;
    const updateAt = createAt;

    const newNote = {
        title, tags, body, id, createAt, updateAt
    };

    notes.push(newNote);

    // check is note success added to notes
    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    // response based isSuccess
    if(isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan'
    });
    response.code(500);
    return response;

};


const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes
    },
});

const getNoteByIdHandler = (request, h) => {
    // get the specific id
    const {id} = request.params;

    // get notes by id 
    const note = notes.filter((n) => n.id === id)[0];

    // make sure note is not undifined
    if(note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            }
        }
    }

    // if note is undifined
    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan'
    });
    response.code(404);
    return response;
};

const editNoteByIdHandler = (request, h) => {
    // get the specific note id
    const {id} = request.params;

    // get new notes data from body request
    const {title, tags, body} = request.payload;

    // new value for updateAt
    const updateAt = new Date().toISOString();

    // get the notes index of array
    const index = notes.findIndex((note) => note.id === id);

    // check the index if is there
    if(index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updateAt
        };

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbaharui'
        });
        response.code(200);
        return response;
    }

    // if notes not found in index of array
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbaharui catatan. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};

const deleteNoteByIdHandler = (request, h) => {
    // get the specific note id
    const {id} = request.params;

    // get the index of note
    const index = notes.findIndex((note) => note.id === id);

    if(index !== -1) {
        notes.slice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus'
        });
        response.code(200);
        return response;
    } 

    // if id not find in notes
    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;

};

// exports with object literals
module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler}