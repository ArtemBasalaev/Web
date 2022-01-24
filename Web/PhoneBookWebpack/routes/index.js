const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
    res.render("index", {title: "Express"});
});

let contactId = 1;
let contacts = [];

router.get("/api/getContacts", (req, res, next) => {
    let term = (req.query.term || "").toUpperCase();

    let result = term.length === 0 ? contacts : contacts.filter(contact => {
        return contact.firstName.toUpperCase().includes(term)
            || contact.lastName.toUpperCase().includes(term)
            || contact.phone.toUpperCase().includes(term);
    })

    res.send(result);
});

router.post("/api/deleteContact", (req, res, next) => {
    let id = req.body.id;

    contacts = contacts.filter(contact => contact.id !== id);

    res.send({
        success: true,
        message: null
    });
})

router.post("/api/deleteContacts", (req, res, next) => {
    let contactsIdToDelete = req.body;

    contacts = contacts.filter(contact => {
        return !contactsIdToDelete.some(contactId => {
            return contact.id === contactId;
        });
    });

    res.send({
        success: true,
        message: null
    });
});

router.post("/api/createContact", (req, res, next) => {
    let requestData = req.body;

    if (!requestData.firstName) {
        res.send({
            success: false,
            message: "First name is required"
        });

        return;
    }

    if (!requestData.lastName) {
        res.send({
            success: false,
            message: "Last name is required"
        });

        return;
    }

    if (!requestData.phone) {
        res.send({
            success: false,
            message: "Phone number is required"
        });

        return;
    }

    let isContactPresent = contacts.some(contact => requestData.phone === contact.phone);

    if (isContactPresent) {
        res.send({
            success: false,
            message: "Phone number already exist!"
        });

        return;
    }

    let contact = {
        id: contactId,
        firstName: requestData.firstName,
        lastName: requestData.lastName,
        phone: requestData.phone
    }

    contactId++;

    contacts.push(contact);

    res.send({
        success: true,
        message: null
    });
})

module.exports = router;