'use strict';

/**
 * email-contact service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::email-contact.email-contact');
