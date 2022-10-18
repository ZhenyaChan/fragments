const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */

let fragment;

module.exports = async (req, res) => {
  fragment = await Fragment.byUser(req.user, req.query.expand);

  res.status(200).json(createSuccessResponse({ fragments: fragment }));
  logger.info({ fragmentList: fragment }, `User's fragment list have been retrieved successfully`);
};
