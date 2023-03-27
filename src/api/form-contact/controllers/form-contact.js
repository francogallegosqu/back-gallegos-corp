'use strict'

/**
 * form-contact controller
 */

const { createCoreController } = require('@strapi/strapi').factories
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
}
module.exports = createCoreController('api::form-contact.form-contact', ({ strapi }) => ({

    async create(ctx) {
        if(!ctx.request.body.data) {
            return ctx.send({
                message: 'Please Send data',
                code: '400',
            }, 400)
        }
        const files = JSON.stringify(ctx.request.files) == '{}' ? null : ctx.request.files['files.file']
        const body = JSON.parse(ctx.request.body.data)
        if (!validateEmail(body.email)) {
            return ctx.send({
                message: 'Invalid email',
                code: '400',
            }, 400)
        }
        try {
            await super.create(ctx)
            await strapi.plugins.email.services.email.send({
                to: 'services@gallegoscorporation.com',
                from: 'services@gallegoscorporation.com',
                subject: `Gallegos Corp. ${body.subject}`,
                cc: 'gallegos.corporation.pre@gmail.com',
                html: `<h2>Hola Soy ${body.name}. </h2>
                    <br/>
                    <h2>Y mi correo es ${body.email}</h2>
                    <br/>
                    <h2>Mi empresa es ${body.business} y necesito lo siguiente :</h2>
                    <br/>
                    <p>${body.message}</p>`,
                ...(files == null ? {} : {
                    attachments: [
                        {
                            filename: files.name,
                            path: files.path,
                        }
                    ]
                })

            })
            return ctx.send({
                message: 'success',
                code: '200',
            }, 200)

        } catch (error) {
            return ctx.send({
                message: 'Error de Server',
                text: error.message,
                code: '400',
            }, 400)
        }



    }
}))
