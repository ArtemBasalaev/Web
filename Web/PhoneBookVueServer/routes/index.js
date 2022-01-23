var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
    res.render("index", {title: "Express"});
});

var contactId = 1;
var contacts = [];

router.get("/api/getContacts", function (req, res, next) {
    var term = (req.query.term || "").toUpperCase();

    var result = term.length === 0 ? contacts : contacts.filter(function (contact) {
        return contact.firstName.toUpperCase().includes(term)
            || contact.lastName.toUpperCase().includes(term)
            || contact.phone.toUpperCase().includes(term);
    })

    res.send(result);
});

router.post("/api/deleteContact", function (req, res, next) {
    var id = req.body.id;

    contacts = contacts.filter(function (contact) {
        return contact.id !== id;
    });

    res.send({
        success: true,
        message: null
    });
})

router.post("/api/deleteContacts", function (req, res, next) {
    var contactsIdToDelete = req.body;

    contacts = contacts.filter(function (contact) {
        return !contactsIdToDelete.some(function (contactId) {
            return contact.id === contactId;
        });
    });

    res.send({
        success: true,
        message: null
    });
});

router.post("/api/createContact", function (req, res, next) {
    var requestData = req.body;

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

    var hasContact = contacts.some(function (contact) {
        return requestData.phone === contact.phone;
    });

    if (hasContact) {
        res.send({
            success: false,
            message: "Phone number already exist!"
        });

        return;
    }

    var contact = {
        id: contactId,
        firstName: requestData.firstName,
        lastName: requestData.lastName,
        phone: requestData.phone
    };

    contactId++;

    contacts.push(contact);

    res.send({
        success: true,
        message: null
    });
})

module.exports = router;