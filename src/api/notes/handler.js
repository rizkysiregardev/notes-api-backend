const ClientError = require("../../exceptions/ClientError");

class NotesHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postNoteHandler = this.postNoteHandler.bind(this);
        this.getNotesHandler = this.getNotesHandler.bind(this);
        this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
        this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
        this.deleteNoteByIdHandlder = this.deleteNoteByIdHandlder.bind(this);
        
    }

    postNoteHandler(request, h) {

        try {
            // validator
            this._validator.validateNotePayload(request.payload);

            const { title = 'untitled', body, tags } = request.payload;
            this._service.addNote({ title, body, tags });

            // get id from response addNote
            const noteId = this._service.addNote({ title, body, tags });

            const response = h.response({
                status: 'success',
                message: 'Catatan berhasil ditambahkan',
                data: {
                    noteId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if(error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.statusCode);
                return response;
            }
            
            // Server Error
            const response = h.response({
                status: 'error',
                message: 'Maaf terjadi kesalahan pada server kami',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    getNotesHandler() {
        const notes = this._service.getNotes();
        return {
            status: 'success',
            data: {
                notes,
            },
        };
    }

    getNoteByIdHandler(request) {
        try {
            const { id } = request.params;
            const note = this._service.getNoteById(id);
            return {
                status: 'success',
                data: {
                    note,
                },
            };
        } catch (error) {
            if(error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.statusCode);
                return response;
            }

            // server error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami'
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    putNoteByIdHandler(request) {
        try {
            // validate 
            this._validator.validateNotePayload(request.payload);

            const { id } = request.params;

            this._service.editNoteById(id, request.payload);
            return {
                status: 'success',
                message: 'Catatan berhasil diperbaharui'
            };
        }catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                  status: 'fail',
                  message: error.message,
                });
                response.code(error.statusCode);
                return response;
              }
         
              // Server ERROR!
              const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
              });
              response.code(500);
              console.error(error);
              return response;
        }   
    }

    deleteNoteByIdHandlder() {
        try {
            const {id} = request.params;
            this.service.deleteNoteByIdHanlder(id);

            return { 
                status: 'success',
                message: 'Catatan berhasil dihapus',
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                  status: 'fail',
                  message: error.message,
                });
                response.code(error.statusCode);
                return response;
              }
         
              // Server ERROR!
              const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
              });
              response.code(500);
              console.error(error);
              return response;
        }
    }
}

module.exports = NotesHandler;