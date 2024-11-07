const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(listingController.newListing)
  );

router.get("/new", isLoggedIn, listingController.newForm); //define 'new' route before ':id' to avoid 'new' being considered as an 'id'

router
  .route("/:id")
  .get(wrapAsync(listingController.show))
  .patch(
    isLoggedIn,
    isOwner,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(listingController.update)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editForm)
);

// //________________________________________________________________________________________________________________________________________________________
// //  INDEX ROUTE    ________________________________________________________________________
// router.get("/", wrapAsync(listingController.index));

// //________________________________________________________________________________________________________________________________________________________
// //  CREATE ROUTE    ___________________________________________________________________
// router.get("/new", isLoggedIn, listingController.newForm);

// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.newListing)
// );

//________________________________________________________________________________________________________________________________________________________
//  SHOW ROUTE    ___________________________________________________________________
// router.get("/:id", wrapAsync(listingController.show));

//________________________________________________________________________________________________________________________________________________________
//  EDIT ROUTE    ___________________________________________________________________
// router.get(
//   "/:id/edit",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.editForm)
// );

//________________________________________________________________________________________________________________________________________________________
//  UPDATE ROUTE    ___________________________________________________________________
// router.patch(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingController.update)
// );

//________________________________________________________________________________________________________________________________________________________
//  DELETE ROUTE    ___________________________________________________________________
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.delete));

module.exports = router;
