const { NotePayLoadSchema } = require("./schema");

const NotesValidator = {
    validateNotePayload: (payload) => {
        const validationResult = NotePayLoadSchema.validate(payload);
        if(validationResult.error) {
            throw new Error(validationResult.error.message);
        }
    },
};

module.exports = NotesValidator;