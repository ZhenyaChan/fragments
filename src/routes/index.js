const express = require('express');

// version and author from package.json
const { version, author } = require('../../package.json');

// Our authorization middleware
const { authenticate } = require('../authorization');

// use the built-in os.hostname() function to get the server's hostname and add it to the JSON we return for the health check
// see https://nodejs.org/api/os.html#oshostname
const { hostname } = require('os');

// Create a router that we can use to mount our API
const router = express.Router();

const { createSuccessResponse } = require('../response');

/**
 * Expose all of our API routes on /v1/* to include an API version.
 * Protect them all so you have to be authenticated in order to access.
 */
router.use(`/v1`, authenticate(), require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response
  res.status(200).json(
    createSuccessResponse({
      author: author,
      githubUrl: 'https://github.com/ZhenyaChan/fragments',
      version,
      // include the hostname in the response
      hostname: hostname(),
    })
  );
});

module.exports = router;
